import { use } from 'typescript-mix';
import { NodeCertificado, XmlResolverPropertyTrait, XsltBuilderPropertyTrait } from '@nodecfdi/cfdiutils-core';
import { XmlStringPropertyTrait } from '../traits/xml-string-property-trait';
import { Asserts } from '../asserts';
import { Certificate } from '@nodecfdi/credentials';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Status } from '../status';
import { DateTime } from 'luxon';

interface SelloDigitalCertificadoValidatorTrait
    extends XmlResolverPropertyTrait,
        XmlStringPropertyTrait,
        XsltBuilderPropertyTrait {}

abstract class SelloDigitalCertificadoValidatorTrait {
    @use(XmlResolverPropertyTrait, XmlStringPropertyTrait, XsltBuilderPropertyTrait) protected this: unknown;

    private _asserts!: Asserts;
    private _certificado!: Certificate;

    private registerAsserts(): void {
        const asserts: Record<string, string> = {
            SELLO01: 'Se puede obtener el certificado del comprobante',
            SELLO02: 'El número de certificado del comprobante igual al encontrado en el certificado',
            SELLO03: 'El RFC del comprobante igual al encontrado en el certificado',
            SELLO04: 'El nombre del emisor del comprobante es igual al encontrado en el certificado',
            SELLO05: 'La fecha del documento es mayor o igual a la fecha de inicio de vigencia del certificado',
            SELLO06: 'La fecha del documento menor o igual a la fecha de fin de vigencia del certificado',
            SELLO07: 'El sello del comprobante está en base 64',
            SELLO08: 'El sello del comprobante coincide con el certificado y la cadena de origen generada',
        };
        Object.entries(asserts).forEach(([code, title]) => {
            this._asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this._asserts = asserts;
        this.registerAsserts();

        // create the certificate
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const extractor = new NodeCertificado(comprobante);
        let certificado: Certificate;
        let version: string;
        try {
            certificado = extractor.obtain();
            version = extractor.getVersion();
        } catch (e) {
            this._asserts.putStatus('SELLO01', Status.error(), (e as Error).message);
            return Promise.resolve(undefined);
        }
        this._certificado = certificado;
        this._asserts.putStatus('SELLO01', Status.ok());

        // start validations
        this.validateNoCertificado(comprobante.attributes().get('NoCertificado') || '');
        const hasRegistroFiscal =
            comprobante.searchNodes('cfdi:Complemento', 'registrofiscal:CFDIRegistroFiscal').length > 0;
        const noCertificadoSAT = comprobante.searchAttribute(
            'cfdi:Complemento',
            'tfd:TimbreFiscalDigital',
            'NoCertificadoSAT'
        );
        if (!hasRegistroFiscal || comprobante.attributes().get('NoCertificado') !== noCertificadoSAT) {
            // validate emisor rfc
            this.validateRfc(comprobante.searchAttribute('cfdi:Emisor', 'Rfc'));
            // validate emisor nombre
            this.validateNombre(comprobante.searchAttribute('cfdi:Emisor', 'Nombre'));
        }
        this.validateFecha(comprobante.attributes().get('Fecha') || '');

        return this.validateSello(comprobante.attributes().get('Sello') || '', version);
    }

    private async buildCadenaOrigen(version: string): Promise<string> {
        const xsltLocation = await this.getXmlResolver().resolveCadenaOrigenLocation(version);
        return this.getXsltBuilder().build(this.getXmlString(), xsltLocation);
    }

    private validateNoCertificado(noCertificado: string): void {
        const expectedNumber = this._certificado.serialNumber().bytes();
        this._asserts.putStatus(
            'SELLO02',
            Status.when(expectedNumber === noCertificado),
            `Certificado: ${expectedNumber}, Comprobante: ${noCertificado}`
        );
    }

    private validateRfc(emisorRfc: string): void {
        const expectedRfc = this._certificado.rfc();
        this._asserts.put(
            'SELLO03',
            'El RFC del comprobante igual al encontrado en el certificado',
            Status.when(expectedRfc === emisorRfc),
            `Rfc certificado: ${expectedRfc}, Rfc comprobante: ${emisorRfc}`
        );
    }

    private validateNombre(emisorNombre: string): void {
        if ('' === emisorNombre) {
            return;
        }

        this._asserts.putStatus(
            'SELLO04',
            Status.when(this.compareNames(this._certificado.legalName(), emisorNombre)),
            `Nombre certificado: ${this._certificado.legalName()}, Nombre comprobante: ${emisorNombre}`
        );
    }

    private validateFecha(fechaSource: string): void {
        const fecha = '' === fechaSource ? 0 : DateTime.fromISO(fechaSource).toMillis();
        if (0 === fecha) {
            return;
        }
        const validFrom = this._certificado.validFromDateTime();
        const validTo = this._certificado.validToDateTime();
        const explanation = `Validez del certificado: ${validFrom.toFormat(
            'yyyy-LL-dd HH:mm:ss'
        )} hasta ${validTo.toFormat('yyyy-LL-dd HH:mm:ss')}, Fecha comprobante ${DateTime.fromMillis(fecha).toFormat(
            'yyyy-LL-dd HH:mm:ss'
        )}`;
        this._asserts.putStatus('SELLO05', Status.when(fecha >= validFrom.toMillis()), explanation);
        this._asserts.putStatus('SELLO06', Status.when(fecha <= validTo.toMillis()), explanation);
    }

    private async validateSello(selloBase64: string, version: string): Promise<void> {
        const sello = this.obtainSello(selloBase64);
        if ('' === sello) {
            return;
        }
        const cadena = await this.buildCadenaOrigen(version);
        const selloIsValid = this._certificado.publicKey().verify(cadena, Buffer.from(sello, 'binary').toString('hex'));
        this._asserts.putStatus(
            'SELLO08',
            Status.when(selloIsValid),
            'La verificación del sello del CFDI no coincide, probablemente el CFDI fue alterado o mal generado'
        );
    }

    private obtainSello(selloBase64: string): string {
        let sello: string | boolean;
        try {
            sello = Buffer.from(selloBase64, 'base64').toString('binary');
        } catch (e) {
            sello = false;
        }
        this._asserts.putStatus('SELLO07', Status.when(false !== sello));
        return sello || '';
    }

    protected compareNames(first: string, second: string): boolean {
        return this.castNombre(first) === this.castNombre(second);
    }

    protected castNombre(nombre: string): string {
        [' ', '-', ',', '.', '#', '&', "'", '"', '~', '¨', '^'].forEach((searchString) => {
            nombre = nombre.replace(searchString, '');
        });
        return nombre.toUpperCase();
    }
}

export { SelloDigitalCertificadoValidatorTrait };
