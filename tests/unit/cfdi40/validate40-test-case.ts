/* eslint-disable @typescript-eslint/indent */
import { Cfdi40 } from '@nodecfdi/cfdiutils-elements';
import { XmlResolver } from '@nodecfdi/cfdiutils-core';
import { CNodeInterface, install } from '@nodecfdi/cfdiutils-common';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { useValidateBaseTestCase } from '../validate-base-test-case';
import { Asserts, Hydrater, Status, ValidatorInterface, Assert } from '~/index';

const useValidate40TestCase = (): {
    runValidate: () => Promise<void>;
    setComprobante: (comprobante: CNodeInterface) => void;
    getComprobante40: () => Cfdi40.Comprobante;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    assertStatusEqualsAssert: (expected: Status, assert: Assert) => void;
    assertStatusEqualsStatus: (expected: Status, current: Status) => void;
    getAsserts: () => Asserts;
    setValidator: (validator: ValidatorInterface) => void;
    getAssertByCodeOrFail: (code: string) => Assert;
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
    setupCfdiFile(cfdiFile: string): void;
    getComprobante(): CNodeInterface;
    getHydrater(): Hydrater;
    getValidator(): ValidatorInterface;
    setUpCertificado(
        comprobanteAttributes?: Record<string, unknown>,
        emisorAttributes?: Record<string, unknown>,
        certificateFile?: string
    ): void;
} => {
    const {
        runValidate,
        assertStatusEqualsCode,
        setComprobante,
        getComprobante,
        getAsserts,
        setValidator,
        assertStatusEqualsAssert,
        getAssertByCodeOrFail,
        assertStatusEqualsStatus,
        utilAsset,
        newResolver,
        setupCfdiFile,
        getHydrater,
        setUpCertificado,
        getValidator
    } = useValidateBaseTestCase();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    beforeEach(() => {
        setComprobante(new Cfdi40.Comprobante());
    });

    const getComprobante40 = (): Cfdi40.Comprobante => {
        const comprobante = getComprobante();
        if (comprobante instanceof Cfdi40.Comprobante) {
            return comprobante;
        }
        throw new Error(`The current comprobante node is not a ${Cfdi40.Comprobante.name}`);
    };

    return {
        runValidate,
        getComprobante40,
        assertStatusEqualsCode,
        getAsserts,
        setValidator,
        assertStatusEqualsAssert,
        getAssertByCodeOrFail,
        assertStatusEqualsStatus,
        utilAsset,
        newResolver,
        setComprobante,
        setupCfdiFile,
        getComprobante,
        getHydrater,
        setUpCertificado,
        getValidator
    };
};
export { useValidate40TestCase };
