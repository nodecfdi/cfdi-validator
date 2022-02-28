import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { CuentaOrdenanteProhibida } from '../../../../../src/cfdi33/recepcion-pagos/pagos/cuenta-ordenante-prohibida';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('CuentaOrdenanteProhibida', () => {
    const { Pago } = Pagos10;

    test.each([
        ['02', 'x'],
        ['02', ''],
        ['02', null],
        ['01', null],
    ])('valid', (paymentType: string, account: string | null) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            CtaOrdenante: account,
        });
        const validator = new CuentaOrdenanteProhibida();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['01', 'x'],
        ['01', ''],
    ])('invalid', (paymentType: string, account: string) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            CtaOrdenante: account,
        });
        const validator = new CuentaOrdenanteProhibida();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});