import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCadenaPagoCadena } from '~/cfdi33/recepcion-pagos/pagos/tipo-cadena-pago-cadena';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('TipoCadenaPagoCadena', () => {
    const { Pago } = Pagos10;

    test.each([
        [null, null],
        ['1', '1']
    ])('valid', (tipoCadPago: string | null, input: string | null) => {
        const pago = new Pago({
            TipoCadPago: tipoCadPago,
            CadPago: input
        });
        const validator = new TipoCadenaPagoCadena();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        [null, '1'],
        ['', '1'],
        ['1', null],
        ['1', ''],
        [null, ''],
        ['', null]
    ])('invalid', (tipoCadPago: string | null, input: string | null) => {
        const pago = new Pago({
            TipoCadPago: tipoCadPago,
            CadPago: input
        });
        const validator = new TipoCadenaPagoCadena();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
