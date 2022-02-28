import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { DateTime } from 'luxon';
import { Fecha } from '../../../../../src/cfdi33/recepcion-pagos/pagos/fecha';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('Fecha', () => {
    const { Pago } = Pagos10;

    test('valid', () => {
        const pagoNode = new Pago({
            FechaPago: DateTime.fromMillis(Date.now()).toFormat("yyyy-LL-dd'T'HH:mm:ss"),
        });
        const validator = new Fecha();

        expect(validator.validatePago(pagoNode));
    });

    test.each([[null], [''], ['not a date'], ['2018-01-01']])('invalid', (fechaPago: string | null) => {
        const pagoNode = new Pago({
            FechaPago: fechaPago,
        });
        const validator = new Fecha();

        expect.hasAssertions();
        try {
            validator.validatePago(pagoNode);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
