import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { CuentaBeneficiariaProhibida } from '../../../../../src/cfdi33/recepcion-pagos/pagos/cuenta-beneficiaria-prohibida';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('CuentaBeneficiariaProhibida', () => {
    const { Pago } = Pagos10;

    test.each([
        ['02', 'x'],
        ['02', ''],
        ['02', null],
        ['01', null],
    ])('valid', (paymentType: string, account: string | null) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            CtaBeneficiario: account,
        });
        const validator = new CuentaBeneficiariaProhibida();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['01', 'x'],
        ['01', ''],
    ])('invalid', (paymentType: string, account: string) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            CtaBeneficiario: account,
        });
        const validator = new CuentaBeneficiariaProhibida();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
