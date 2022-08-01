import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCadenaPagoCertificado } from '~/cfdi33/recepcion-pagos/pagos/tipo-cadena-pago-certificado';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('TipoCadenaPagoCertificado', () => {
    const { Pago } = Pagos10;

    test.each([
        [null, null],
        ['1', '1']
    ])('valid', (tipoCadPago: string | null, input: string | null) => {
        const pago = new Pago({
            TipoCadPago: tipoCadPago,
            CertPago: input
        });
        const validator = new TipoCadenaPagoCertificado();

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
            CertPago: input
        });
        const validator = new TipoCadenaPagoCertificado();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
