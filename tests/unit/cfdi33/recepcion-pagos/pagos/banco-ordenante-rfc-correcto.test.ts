import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { BancoOrdenanteRfcCorrecto } from '../../../../../src/cfdi33/recepcion-pagos/pagos/banco-ordenante-rfc-correcto';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('BancoOrdenanteRfcCorrecto', () => {
    const { Pago } = Pagos10;

    test.each([['COSC8001137NA'], ['XEXX010101000'], [null]])('valid', (rfc: string | null) => {
        const pago = new Pago({
            RfcEmisorCtaOrd: rfc,
        });
        const validator = new BancoOrdenanteRfcCorrecto();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['COSC8099137N1'], ['XAXX010101000'], ['']])('invalid', (rfc: string) => {
        const pago = new Pago({
            RfcEmisorCtaOrd: rfc,
        });
        const validator = new BancoOrdenanteRfcCorrecto();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
