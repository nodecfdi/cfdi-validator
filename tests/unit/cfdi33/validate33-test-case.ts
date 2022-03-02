import { useValidateBaseTestCase } from '../validate-base-test-case';
import { Cfdi33 } from '@nodecfdi/cfdiutils-elements';
import { Status } from '../../../src/status';
import { Asserts } from '../../../src/asserts';
import { ValidatorInterface } from '../../../src/contracts/validator-interface';
import { Assert } from '../../../src/assert';
import { XmlResolver } from '@nodecfdi/cfdiutils-core';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Hydrater } from '../../../src/hydrater';

const useValidate33TestCase = (): {
    runValidate: () => Promise<void>;
    setComprobante: (comprobante: CNodeInterface) => void;
    getComprobante33: () => Cfdi33.Comprobante;
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
    } = useValidateBaseTestCase();

    beforeEach(() => {
        setComprobante(new Cfdi33.Comprobante());
    });

    const getComprobante33 = (): Cfdi33.Comprobante => {
        const comprobante = getComprobante();
        if (comprobante instanceof Cfdi33.Comprobante) {
            return comprobante;
        }
        throw new Error(`The current comprobante node is not a ${Cfdi33.Comprobante.name}`);
    };

    return {
        runValidate,
        getComprobante33,
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
    };
};
export { useValidate33TestCase };
