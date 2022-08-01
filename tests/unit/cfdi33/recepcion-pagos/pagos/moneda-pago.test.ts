import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MonedaPago } from '~/cfdi33/recepcion-pagos/pagos/moneda-pago';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MonedaPago', () => {
    const { Pago } = Pagos10;

    test('valid', () => {
        const pago = new Pago({
            MonedaP: '999'
        });
        const validator = new MonedaPago();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([[null], [''], ['XXX']])('invalid', (currency: string | null) => {
        const pago = new Pago({
            MonedaP: currency
        });
        const validator = new MonedaPago();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
