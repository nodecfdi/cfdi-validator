import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { FormaDePago } from '~/cfdi33/recepcion-pagos/pagos/forma-de-pago';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('FormaDePago', () => {
    const { Pago } = Pagos10;

    test('valid', () => {
        const pago = new Pago({
            FormaDePagoP: '23'
        });
        const validator = new FormaDePago();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([[null], [''], ['99']])('invalid', (formaPago: string | null) => {
        const pago = new Pago({
            FormaDePagoP: formaPago
        });
        const validator = new FormaDePago();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
