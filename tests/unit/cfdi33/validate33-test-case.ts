import { useValidateBaseTestCase } from '../validate-base-test-case';
import { Cfdi33 } from '@nodecfdi/cfdiutils-elements';
import { Status } from '../../../src/status';
import { Asserts } from '../../../src/asserts';
import { ValidatorInterface } from '../../../src/contracts/validator-interface';
import { Assert } from '../../../src/assert';

const useValidate33TestCase = (): {
    runValidate: () => Promise<void>;
    getComprobante33: () => Cfdi33.Comprobante;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    assertStatusEqualsAssert: (expected: Status, assert: Assert) => void;
    getAsserts: () => Asserts;
    setValidator: (validator: ValidatorInterface) => void;
    getAssertByCodeOrFail: (code: string) => Assert;
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
    };
};
export { useValidate33TestCase };
