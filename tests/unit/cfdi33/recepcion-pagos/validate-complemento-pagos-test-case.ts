import { Cfdi33, Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { useValidate33TestCase } from '../validate33-test-case';
import { Status } from '../../../../src/status';
import { ValidatorInterface } from '../../../../src/contracts/validator-interface';

const useValidateComplementoPagosTestCase = (): {
    runValidate: () => Promise<void>;
    getComprobante33: () => Cfdi33.Comprobante;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    setValidator: (validator: ValidatorInterface) => void;
} => {
    const { getComprobante33, runValidate, assertStatusEqualsCode, getAsserts, setValidator } = useValidate33TestCase();
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

    return {
        getComprobante33,
        runValidate,
        assertStatusEqualsCode,
        setValidator,
    };
};

export { useValidateComplementoPagosTestCase };
