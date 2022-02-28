import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { BancoBeneficiarioRfcProhibido } from '../../../../../src/cfdi33/recepcion-pagos/pagos/banco-beneficiario-rfc-prohibido';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('BancoBeneficiarioRfcProhibido', () => {
    const { Pago } = Pagos10;

    test.each([
        ['02', 'COSC8001137NA'],
        ['02', ''],
        ['02', null],
        ['01', null],
    ])('valid', (paymentType: string, rfc: string | null) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            RfcEmisorCtaBen: rfc,
        });
        const validator = new BancoBeneficiarioRfcProhibido();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['01', 'COSC8001137NA'],
        ['01', ''],
    ])('invalid', (paymentType: string, rfc: string) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            RfcEmisorCtaBen: rfc,
        });
        const validator = new BancoBeneficiarioRfcProhibido();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
