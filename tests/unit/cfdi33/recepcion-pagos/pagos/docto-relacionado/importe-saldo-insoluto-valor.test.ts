import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImporteSaldoInsolutoValor } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-saldo-insoluto-valor';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImporteSaldoInsolutoValor', () => {
    const { Pago } = Pagos10;

    test.each([['100.00', '100.00', '0.0']])('valid', (previous, payment, left) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            ImpSaldoAnt: previous,
            ImpPagado: payment,
            ImpSaldoInsoluto: left
        });
        const validator = new ImporteSaldoInsolutoValor();
        validator.setIndex(0);
        validator.setPago(pago);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([['150.00', '100.00', '50.0']])('with calculate', (previous, payment, left) => {
        const pago = new Pago({
            Monto: payment
        });
        const docto = pago.addDoctoRelacionado({
            ImpSaldoAnt: previous,
            ImpSaldoInsoluto: left
        });
        const validator = new ImporteSaldoInsolutoValor();
        validator.setIndex(0);
        validator.setPago(pago);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([
        ['100.00', '100.00', '0.01'],
        ['100.00', '100.00', '-0.01'],
        ['100.01', '100.00', '0.00'],
        ['100.00', '100.01', '0.00']
    ])('invalid', (previous, payment, left) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            ImpSaldoAnt: previous,
            ImpPagado: payment,
            ImpSaldoInsoluto: left
        });
        const validator = new ImporteSaldoInsolutoValor();
        validator.setIndex(0);
        validator.setPago(pago);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
