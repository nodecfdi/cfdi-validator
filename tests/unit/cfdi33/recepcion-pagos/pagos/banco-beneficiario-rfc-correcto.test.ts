import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { BancoBeneficiarioRfcCorrecto } from '~/cfdi33/recepcion-pagos/pagos/banco-beneficiario-rfc-correcto';
import { ValidatePagoException } from '~/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('BancoBeneficiarioRfcCorrecto', () => {
    const { Pago } = Pagos10;

    test.each([['COSC8001137NA'], ['XEXX010101000'], [null]])('valid', (rfc: string | null) => {
        const pago = new Pago({
            RfcEmisorCtaBen: rfc
        });
        const validator = new BancoBeneficiarioRfcCorrecto();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['COSC8099137N1'], ['XAXX010101000'], ['']])('invalid', (rfc) => {
        const pago = new Pago({
            RfcEmisorCtaBen: rfc
        });
        const validator = new BancoBeneficiarioRfcCorrecto();

        const t = (): boolean => validator.validatePago(pago);

        expect(t).toThrow(ValidatePagoException);
    });
});
