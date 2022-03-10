import { CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../asserts';
import { use } from 'typescript-mix';
import {
    SatCertificateNumber,
    TfdCadenaDeOrigen,
    XmlResolver,
    XmlResolverPropertyTrait,
    XsltBuilderPropertyTrait,
} from '@nodecfdi/cfdiutils-core';
import { Status } from '../status';
import { Certificate } from '@nodecfdi/credentials';
import { cleanupSync, openSync } from 'temp';

interface TimbreFiscalDigitalSelloValidatorTrait extends XmlResolverPropertyTrait, XsltBuilderPropertyTrait {}

abstract class TimbreFiscalDigitalSelloValidatorTrait {
    @use(XmlResolverPropertyTrait, XsltBuilderPropertyTrait) protected this: unknown;

    public async validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put(
            'TFDSELLO01',
            'El sello SAT del Timbre Fiscal Digital corresponde al certificado SAT'
        );

        if (!this.hasXmlResolver()) {
            assert.setExplanation('No se puede hacer la validación porque carece de un objeto resolvedor');
            return Promise.resolve(undefined);
        }

        const tfd = comprobante.searchNode('cfdi:Complemento', 'tfd:TimbreFiscalDigital');
        if (!tfd) {
            assert.setExplanation('El CFDI no contiene un Timbre Fiscal Digital');
            return Promise.resolve(undefined);
        }

        if ('1.1' !== tfd.get('Version')) {
            assert.setExplanation('La versión del timbre fiscal digital no es 1.1');
            return Promise.resolve(undefined);
        }

        const validationSellosMatch = comprobante.get('Sello') !== tfd.get('SelloCFD');
        if (validationSellosMatch) {
            assert.setStatus(
                Status.error(),
                'El atributo SelloCFD del Timbre Fiscal Digital no coincide con el atributo Sello del Comprobante'
            );
            return Promise.resolve(undefined);
        }

        const certificadoSAT = tfd.get('NoCertificadoSAT');
        if (!SatCertificateNumber.isValidCertificateNumber(certificadoSAT)) {
            assert.setStatus(
                Status.error(),
                `El atributo NoCertificadoSAT con el valor "${certificadoSAT}" no es valido`
            );
            return Promise.resolve(undefined);
        }

        let certificado: Certificate;
        const resolver = this.getXmlResolver();
        try {
            const certificadoUrl = new SatCertificateNumber(certificadoSAT).remoteUrl();
            if (!resolver.hasLocalPath()) {
                const temporaryFile = openSync({ prefix: '.cer' });
                const certificadoFile = temporaryFile.path;
                await resolver.getDownloader().downloadTo(certificadoUrl, certificadoFile);
                certificado = Certificate.openFile(certificadoFile);
                cleanupSync();
            } else {
                const certificadoFile = await resolver.resolve(certificadoUrl, XmlResolver.TYPE_CER);
                certificado = Certificate.openFile(certificadoFile);
            }
        } catch (e) {
            assert.setStatus(
                Status.error(),
                `No se ha podido obtener el certificado ${certificadoSAT}: ${(e as Error).message}`
            );
            return Promise.resolve(undefined);
        }

        const tfdCadenaOrigen = new TfdCadenaDeOrigen(resolver, this.getXsltBuilder());
        // fix al parecer no me regresa el namespace xmlns:xsi
        tfd.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        const source = await tfdCadenaOrigen.build(XmlNodeUtils.nodeToXmlString(tfd), tfd.get('Version'));
        const signature = Buffer.from(tfd.get('SelloSAT'), 'base64').toString('hex');

        const verification = certificado.publicKey().verify(source, signature);
        if (!verification) {
            assert.setStatus(
                Status.error(),
                [
                    'La verificación del timbrado fue negativa,',
                    ' posiblemente el CFDI fue modificado después de general el sello',
                ].join('')
            );
            return Promise.resolve(undefined);
        }
        assert.setStatus(Status.ok());

        return Promise.resolve(undefined);
    }
}

export { TimbreFiscalDigitalSelloValidatorTrait };
