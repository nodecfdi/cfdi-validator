import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { TipoCambioValor } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/tipo-cambio-valor';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('TipoCambioValor', () => {
    const { Pago } = Pagos10;

    test.each([['USD', 'MXN', '1']])('valid', (currencyPayment, currencyDocument, exchangeRate) => {
        const pago = new Pago({
            MonedaP: currencyPayment
        });
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currencyDocument,
            TipoCambioDR: exchangeRate
        });
        const validator = new TipoCambioValor();
        validator.setPago(pago);
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([
        ['USD', 'MXN', '1.0'],
        ['USD', 'MXN', ''],
        ['USD', 'MXN', null]
    ])('Invalid', (currencyPayment: string, currencyDocument: string, exchangeRate: string | null) => {
        const pago = new Pago({
            MonedaP: currencyPayment
        });
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currencyDocument,
            TipoCambioDR: exchangeRate
        });
        const validator = new TipoCambioValor();
        validator.setPago(pago);
        validator.setIndex(0);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
