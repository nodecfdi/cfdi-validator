import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MonedaPago } from '../../../../../src/cfdi33/recepcion-pagos/pagos/moneda-pago';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MonedaPago', () => {
    const { Pago } = Pagos10;

    test('valid', () => {
        const pago = new Pago({
            MonedaP: '999',
        });
        const validator = new MonedaPago();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([[null], [''], ['XXX']])('invalid', (currency: string | null) => {
        const pago = new Pago({
            MonedaP: currency,
        });
        const validator = new MonedaPago();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
