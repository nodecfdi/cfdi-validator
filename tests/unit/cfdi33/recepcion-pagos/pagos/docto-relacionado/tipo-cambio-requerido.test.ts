import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCambioRequerido } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/tipo-cambio-requerido';
import { ValidateDoctoException } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('TipoCambioRequerido', () => {
    const { Pago } = Pagos10;

    test.each([
        ['USD', 'USD', null],
        ['MXN', 'USD', '19.9876'],
    ])('valid', (currencyPayment: string, currencyDocument: string, exchangeRate: string | null) => {
        const pago = new Pago({
            MonedaP: currencyPayment,
        });
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currencyDocument,
            TipoCambioDR: exchangeRate,
        });
        const validator = new TipoCambioRequerido();
        validator.setPago(pago);
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([
        ['USD', 'USD', '19.9876'],
        ['MXN', 'USD', null],
    ])('invalid', (currencyPayment: string, currencyDocument: string, exchangeRate: string | null) => {
        const pago = new Pago({
            MonedaP: currencyPayment,
        });
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currencyDocument,
            TipoCambioDR: exchangeRate,
        });
        const validator = new TipoCambioRequerido();
        validator.setPago(pago);
        validator.setIndex(0);

        expect.hasAssertions();
        try {
            validator.validateDoctoRelacionado(docto);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidateDoctoException);
        }
    });
});
