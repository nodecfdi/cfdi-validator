import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCambioValue } from '../../../../../src/cfdi33/recepcion-pagos/pagos/tipo-cambio-value';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('TipoCambioValue', () => {
    const { Pago } = Pagos10;

    test.each([['0.000002'], ['18.5623'], [null]])('valid', (exchangeRate: string | null) => {
        const pago = new Pago({
            TipoCambioP: exchangeRate,
        });
        const validator = new TipoCambioValue();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['0.000001'], ['1.0000001'], ['-1'], ['not numeric'], ['']])(
        'invalid',
        (exchangeRate: string | null) => {
            const pago = new Pago({
                TipoCambioP: exchangeRate,
            });
            const validator = new TipoCambioValue();

            expect.hasAssertions();
            try {
                validator.validatePago(pago);
            } catch (e) {
                expect(e).toBeInstanceOf(ValidatePagoException);
            }
        }
    );
});
