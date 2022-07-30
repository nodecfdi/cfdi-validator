import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImportesDecimales } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importes-decimales';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImportesDecimales', () => {
    const { Pago } = Pagos10;

    test.each([
        ['MXN', '100.00', '100.00', '0.00'],
        ['MXN', '100.0', '100.0', '0.0'],
        ['MXN', '100', '100', '0']
    ])('valid', (currency, previous, payment, left) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currency,
            ImpSaldoAnt: previous,
            ImpPagado: payment,
            ImpSaldoInsoluto: left
        });
        const validator = new ImportesDecimales();
        validator.setIndex(0);
        validator.setPago(pago);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([
        ['MXN', '100.000', '100.00', '0.00'],
        ['MXN', '100.00', '100.000', '0.00'],
        ['MXN', '100.00', '100.00', '0.000']
    ])('invalid', (currency, previous, payment, left) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            MonedaDR: currency,
            ImpSaldoAnt: previous,
            ImpPagado: payment,
            ImpSaldoInsoluto: left
        });
        const validator = new ImportesDecimales();
        validator.setIndex(0);
        validator.setPago(pago);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
