import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MontoGreaterThanZero } from '../../../../../src/cfdi33/recepcion-pagos/pagos/monto-greater-than-zero';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MontoGreaterThanZero', () => {
    const { Pago } = Pagos10;

    test.each([['0.000001'], ['1']])('valid', (amount) => {
        const pago = new Pago({
            Monto: amount,
        });
        const validator = new MontoGreaterThanZero();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['0.0000001'], ['0'], ['-1'], [null], [''], ['not numeric']])('invalid', (amount: string | null) => {
        const pago = new Pago({
            Monto: amount,
        });
        const validator = new MontoGreaterThanZero();

        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
