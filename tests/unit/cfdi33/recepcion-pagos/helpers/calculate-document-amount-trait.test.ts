import { CalculateDocumentAmountUse } from './calculate-document-amount-use';
import { Pagos10 } from '@nodecfdi/cfdiutils-elements';

describe('CalculateDocumentAmountTrait', () => {
    test('calculate document amount when is set', () => {
        const validador = new CalculateDocumentAmountUse();
        const amount = validador.calculateDocumentAmount(
            new Pagos10.DoctoRelacionado({
                ImpPagado: '123.45',
            }),
            new Pagos10.Pago()
        );

        expect(amount).toBe(123.45);
    });

    test('calculate document amount when is undefined', () => {
        const pago = new Pagos10.Pago({ Monto: '123.45' });
        const docto = pago.addDoctoRelacionado();

        const validator = new CalculateDocumentAmountUse();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(123.45);
    });

    test('calculate document amount when is undefined with exchange rate', () => {
        const pago = new Pagos10.Pago({ Monto: '123.45' });
        const docto = pago.addDoctoRelacionado({ TipoCambioDR: 'EUR' });

        const validator = new CalculateDocumentAmountUse();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(0);
    });

    test('calculate document amount when is undefined with more documents', () => {
        const pago = new Pagos10.Pago({ Monto: '123.45' });
        pago.addDoctoRelacionado(); // first
        const docto = pago.addDoctoRelacionado(); // second

        const validator = new CalculateDocumentAmountUse();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(0);
    });
});
