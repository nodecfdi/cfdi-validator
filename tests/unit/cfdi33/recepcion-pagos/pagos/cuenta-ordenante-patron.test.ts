import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { CuentaOrdenantePatron } from '../../../../../src/cfdi33/recepcion-pagos/pagos/cuenta-ordenante-patron';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('CuentaOrdenantePatron', () => {
    const { Pago } = Pagos10;

    test.each([['1234567890123456'], [null]])('valid', (input: string | null) => {
        const pago = new Pago({
            FormaDePagoP: '04', // require a pattern of 16 digits
            CtaOrdenante: input,
        });
        const validator = new CuentaOrdenantePatron();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['1'], ['']])('invalid', (input: string) => {
        const pago = new Pago({
            FormaDePagoP: '04', // require a pattern of 16 digits
            CtaOrdenante: input,
        });
        const validator = new CuentaOrdenantePatron();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
