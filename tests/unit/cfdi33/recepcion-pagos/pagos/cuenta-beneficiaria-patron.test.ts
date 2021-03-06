import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { CuentaBeneficiariaPatron } from '~/cfdi33/recepcion-pagos/pagos/cuenta-beneficiaria-patron';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('CuentaBeneficiariaPatron', () => {
    const { Pago } = Pagos10;

    test.each([['1234567890123456'], [null]])('valid', (input: string | null) => {
        const pago = new Pago({
            FormaDePagoP: '04', // require a pattern of 16 digits
            CtaBeneficiario: input
        });
        const validator = new CuentaBeneficiariaPatron();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['1'], ['']])('invalid', (input) => {
        const pago = new Pago({
            FormaDePagoP: '04', // require a pattern of 16 digits
            CtaBeneficiario: input
        });
        const validator = new CuentaBeneficiariaPatron();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
