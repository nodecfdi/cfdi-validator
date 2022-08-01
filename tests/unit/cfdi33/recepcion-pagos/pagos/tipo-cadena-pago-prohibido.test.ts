import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCadenaPagoProhibido } from '~/cfdi33/recepcion-pagos/pagos/tipo-cadena-pago-prohibido';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('TipoCadenaPagoProhibido', () => {
    const { Pago } = Pagos10;

    test.each([
        ['01', null],
        ['03', null],
        ['03', 'SPEI']
    ])('valid', (paymentForm: string, input: string | null) => {
        const pago = new Pago({
            FormaDePagoP: paymentForm,
            TipoCadPago: input
        });
        const validator = new TipoCadenaPagoProhibido();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['01', 'SPEI'],
        ['01', '']
    ])('invalid', (paymentForm: string, input: string) => {
        const pago = new Pago({
            FormaDePagoP: paymentForm,
            TipoCadPago: input
        });
        const validator = new TipoCadenaPagoProhibido();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
