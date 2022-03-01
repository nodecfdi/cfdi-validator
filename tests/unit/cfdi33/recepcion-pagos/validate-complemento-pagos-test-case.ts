import { Cfdi33, Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { useValidate33TestCase } from '../validate33-test-case';
import { Status } from '../../../../src/status';
import { ValidatorInterface } from '../../../../src/contracts/validator-interface';
import { Assert } from '../../../../src/assert';

const useValidateComplementoPagosTestCase = (): {
    runValidate: () => Promise<void>;
    getComprobante33: () => Cfdi33.Comprobante;
    getComplemento: () => Pagos10.Pagos;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    assertStatusEqualsAssert: (expected: Status, assert: Assert) => void;
    setValidator: (validator: ValidatorInterface) => void;
    getAssertByCodeOrFail: (code: string) => Assert;
} => {
    const {
        getComprobante33,
        runValidate,
        assertStatusEqualsCode,
        getAsserts,
        setValidator,
        assertStatusEqualsAssert,
        getAssertByCodeOrFail,
    } = useValidate33TestCase();
    let complemento: Pagos10.Pagos;

    beforeEach(() => {
        const comprobante = getComprobante33();
        comprobante.attributes().set('TipoDeComprobante', 'P');

        complemento = new Pagos10.Pagos();
        comprobante.addComplemento(complemento);
    });

    test('without complemento did not create any assertion', async () => {
        getComprobante33().children().removeAll();
        await runValidate();

        expect(getAsserts()).toHaveLength(0);
    });

    const getComplemento = (): Pagos10.Pagos => {
        return complemento;
    };

    return {
        getComprobante33,
        getComplemento,
        runValidate,
        assertStatusEqualsCode,
        setValidator,
        assertStatusEqualsAssert,
        getAssertByCodeOrFail,
    };
};
export { useValidateComplementoPagosTestCase };
