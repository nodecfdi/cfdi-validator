import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCambioExists } from '../../../../../src/cfdi33/recepcion-pagos/pagos/tipo-cambio-exists';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('TipoCambioExists', () => {
    const { Pago } = Pagos10;

    test.each([
        ['MXN', null],
        ['USD', '18.5678'],
    ])('valid input', (currency: string, exchangeRate: string | null) => {
        const pago = new Pago({
            MonedaP: currency,
            TipoCambioP: exchangeRate,
        });
        const validator = new TipoCambioExists();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['MXN', '1'],
        ['MXN', '1.23'],
        ['USD', null],
        ['USD', ''],
    ])('invalid input', (currency: string, exchangeRate: string | null) => {
        const pago = new Pago({
            MonedaP: currency,
            TipoCambioP: exchangeRate,
        });
        const validator = new TipoCambioExists();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
