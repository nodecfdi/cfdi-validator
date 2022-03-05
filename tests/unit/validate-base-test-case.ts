import { ValidatorInterface, Assert, Status, Asserts, Hydrater } from '../../src';
import { CNode, CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { useTestCase } from '../test-case';
import { SaxonbCliBuilder, XmlResolver } from '@nodecfdi/cfdiutils-core';
import { readFileSync } from 'fs';
import { Certificate } from '@nodecfdi/credentials';

const useValidateBaseTestCase = (): {
    runValidate: () => Promise<void>;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    assertStatusEqualsAssert: (expected: Status, assert: Assert) => void;
    assertStatusEqualsStatus: (expected: Status, current: Status) => void;
    setValidator: (validator: ValidatorInterface) => void;
    setAsserts: (asserts: Asserts) => void;
    setComprobante: (comprobante: CNodeInterface) => void;
    getComprobante: () => CNodeInterface;
    getAsserts: () => Asserts;
    getAssertByCodeOrFail: (code: string) => Assert;
    getHydrater: () => Hydrater;
    getValidator: () => ValidatorInterface;
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
    setupCfdiFile(cfdiFile: string): void;
    setUpCertificado(
        comprobanteAttributes?: Record<string, unknown>,
        emisorAttributes?: Record<string, unknown>,
        certificateFile?: string
    ): void;
} => {
    const { utilAsset, newResolver } = useTestCase();

    let _validator: ValidatorInterface;
    let _comprobante: CNodeInterface;
    let _asserts: Asserts;
    let _hidrater: Hydrater;

    beforeEach(() => {
        _comprobante = new CNode('root');
        _asserts = new Asserts();
        _hidrater = new Hydrater();
        _hidrater.setXmlResolver(newResolver());
        _hidrater.setXsltBuilder(new SaxonbCliBuilder('/usr/bin/saxonb-xslt'));
    });

    const setupCfdiFile = (cfdiFile: string): void => {
        // setup hydrate and re-hydrate the validator
        const content = readFileSync(utilAsset(cfdiFile), 'binary');
        _hidrater.setXmlString(content);
        _hidrater.hydrate(_validator);

        // setup comprobante
        _comprobante = XmlNodeUtils.nodeFromXmlString(content);
    };

    const setValidator = (validator: ValidatorInterface): void => {
        _validator = validator;
    };

    const setComprobante = (comprobante: CNodeInterface): void => {
        _comprobante = comprobante;
    };

    const setAsserts = (asserts: Asserts): void => {
        _asserts = asserts;
    };

    const getValidator = (): ValidatorInterface => {
        return _validator;
    };

    const getComprobante = (): CNodeInterface => {
        return _comprobante;
    };

    const getHydrater = (): Hydrater => {
        return _hidrater;
    };

    const getAsserts = (): Asserts => {
        return _asserts;
    };

    const runValidate = (): Promise<void> => {
        return _validator.validate(_comprobante, _asserts);
    };

    const getAssertByCodeOrFail = (code: string): Assert => {
        if (!_asserts.exists(code)) {
            throw new Error(`Did not receive actual status for code '${code}', it may not exists`);
        }
        return _asserts.get(code);
    };

    const assertStatusEqualsAssert = (expected: Status, assert: Assert): void => {
        const actual = assert.getStatus();
        expect(expected.equalsTo(actual)).toBeTruthy();
    };

    const assertStatusEqualsStatus = (expected: Status, current: Status): void => {
        expect(current).toStrictEqual(current);
    };

    const assertStatusEqualsCode = (expected: Status, code: string): void => {
        const actualAssert = getAssertByCodeOrFail(code);
        assertStatusEqualsAssert(expected, actualAssert);
    };

    const setUpCertificado = (
        comprobanteAttributes: Record<string, unknown> = {},
        emisorAttributes: Record<string, unknown> = {},
        certificateFile = ''
    ): void => {
        certificateFile = certificateFile !== '' ? certificateFile : utilAsset('certs/EKU9003173C9.cer');
        const certificado = Certificate.openFile(certificateFile);
        _comprobante.addAttributes({
            Certificado: certificado.pemAsOneLine(),
            NoCertificado: certificado.serialNumber().bytes(),
            ...comprobanteAttributes,
        });

        let emisor = _comprobante.searchNode('cfdi:Emisor');
        if (!emisor) {
            emisor = new CNode('cfdi:Emisor');
            _comprobante.addChild(emisor);
        }
        emisor.addAttributes({
            Nombre: certificado.legalName(),
            Rfc: certificado.rfc(),
            ...emisorAttributes,
        });
    };

    return {
        setAsserts,
        setComprobante,
        setValidator,
        getComprobante,
        getAsserts,
        runValidate,
        assertStatusEqualsCode,
        assertStatusEqualsAssert,
        assertStatusEqualsStatus,
        getAssertByCodeOrFail,
        utilAsset,
        newResolver,
        setupCfdiFile,
        getHydrater,
        setUpCertificado,
        getValidator,
    };
};
export { useValidateBaseTestCase };
