import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MontoGreaterOrEqualThanSumOfDocuments } from '../../../../../src/cfdi33/recepcion-pagos/pagos/monto-greater-or-equal-than-sum-of-documents';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MontoGreaterOrEqualThanSumOfDocuments', () => {
    const { Pago, DoctoRelacionado } = Pagos10;

    test('valid', () => {
        const pago = new Pago({
            MonedaP: 'USD',
            Monto: '123.45',
        });
        pago.multiDoctoRelacionado(
            ...[
                { ImpPagado: '50.00' }, // 50.00
                { MonedaDR: 'EUR', TipoCambioDR: '0.5', ImpPagado: '25.00' }, // 25.00 / 0.5 => 50
                { MonedaDR: 'MXN', TipoCambioDR: '18.7894', ImpPagado: '440.61' }, // 440.61 / 18.7894 => 23.45
            ]
        );
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test('invalid', () => {
        const pago = new Pago({
            MonedaP: 'USD',
            Monto: '123.45',
        });
        pago.multiDoctoRelacionado(
            ...[
                { ImpPagado: '50.00' }, // 50.00
                { MonedaDR: 'EUR', TipoCambioDR: '0.5', ImpPagado: '25.01' }, // 25.00 / 0.5 => 50.02
                { MonedaDR: 'MXN', TipoCambioDR: '18.7894', ImpPagado: '440.61' }, // 440.61 / 18.7894 => 23.45
            ]
        );
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });

    test('calculate document amount when is set', () => {
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();
        const amount = validator.calculateDocumentAmount(
            new DoctoRelacionado({
                ImpPagado: '123.45',
            }),
            new Pago()
        );

        expect(amount).toBe(123.45);
    });

    test('calculate document amount when is undefined', () => {
        const pago = new Pago({
            Monto: '123.45',
        });
        const docto = pago.addDoctoRelacionado();
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(123.45);
    });

    test('calculate document amount when is undefined with exchange rate', () => {
        const pago = new Pago({
            Monto: '123.45',
        });
        const docto = pago.addDoctoRelacionado({ TipoCambioDR: 'EUR' });
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(0);
    });

    test('calculate document amount when is undefined with more documents', () => {
        const pago = new Pago({
            Monto: '123.45',
        });
        pago.addDoctoRelacionado(); // first
        const docto = pago.addDoctoRelacionado(); // second
        const validator = new MontoGreaterOrEqualThanSumOfDocuments();
        const amount = validator.calculateDocumentAmount(docto, pago);

        expect(amount).toBe(0);
    });
});
