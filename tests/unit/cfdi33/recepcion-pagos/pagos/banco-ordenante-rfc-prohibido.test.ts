import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { BancoOrdenanteRfcProhibido } from '../../../../../src/cfdi33/recepcion-pagos/pagos/banco-ordenante-rfc-prohibido';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('BancoOrdenanteRfcProhibido', () => {
    const { Pago } = Pagos10;

    test.each([
        ['02', 'COSC8001137NA'],
        ['02', ''],
        ['02', null],
        ['01', null],
    ])('valid', (paymentType: string, rfc: string | null) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            RfcEmisorCtaOrd: rfc,
        });
        const validator = new BancoOrdenanteRfcProhibido();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([
        ['01', 'COSC8001137NA'],
        ['01', ''],
        [null, 'COSC8001137NA'],
    ])('invalid', (paymentType: string | null, rfc: string) => {
        const pago = new Pago({
            FormaDePagoP: paymentType,
            RfcEmisorCtaOrd: rfc,
        });
        const validator = new BancoOrdenanteRfcProhibido();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });
});
