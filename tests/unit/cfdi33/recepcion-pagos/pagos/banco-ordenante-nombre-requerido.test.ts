import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { BancoOrdenanteNombreRequerido } from '~/cfdi33/recepcion-pagos/pagos/banco-ordenante-nombre-requerido';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('BancoOrdenanteNombreRequerido', () => {
    const { Pago } = Pagos10;

    test.each([
        ['XEXX010101000', 'Foreign bank'],
        ['COSC8001137NA', 'Banco X'],
        ['COSC8001137NA', null],
        [null, 'Foreign bank'],
        [null, null]
    ])('valid', (rfc: string | null, name: string | null) => {
        const pago = new Pago({
            RfcEmisorCtaOrd: rfc,
            NomBancoOrdExt: name
        });
        const validator = new BancoOrdenanteNombreRequerido();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['XEXX010101000', ''],
        ['XEXX010101000', null]
    ])('invalid', (rfc: string, name: string | null) => {
        const pago = new Pago({
            RfcEmisorCtaOrd: rfc,
            NomBancoOrdExt: name
        });
        const validator = new BancoOrdenanteNombreRequerido();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
