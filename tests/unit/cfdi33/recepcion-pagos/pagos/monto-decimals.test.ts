import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MontoDecimals } from '../../../../../src/cfdi33/recepcion-pagos/pagos/monto-decimals';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MontoDecimals', () => {
    const { Pago } = Pagos10;

    test('valid', () => {
        const pago = new Pago({
            MonedaP: 'USD', // 2 decimals
            Monto: '1.00',
        });
        const validator = new MontoDecimals();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['0.001'], ['0.000'], ['0.123']])('valid', (amount) => {
        const pago = new Pago({
            MonedaP: 'USD', // 2 decimals
            Monto: amount,
        });
        const validator = new MontoDecimals();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
