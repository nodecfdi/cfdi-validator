import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { MontoBetweenIntervalSumOfDocuments } from '../../../../../src/cfdi33/recepcion-pagos/pagos/monto-between-interval-sum-of-documents';
import { ValidatePagoException } from '../../../../../src/cfdi33/recepcion-pagos/pagos/validate-pago-exception';

describe('MontoBetweenIntervalSumOfDocuments', () => {
    const { Pago } = Pagos10;
    const providerValidWithRandomAmounts = (): number[][] => {
        const randomValues: number[][] = [];
        const min = 1;
        const max = 99999999;
        for (let i = 0; i < 20; i++) {
            randomValues.push([(Math.floor(Math.random() * (max - min + 1)) + min) / 100]);
        }
        return randomValues;
    };

    test('valid', () => {
        const pago = new Pago({
            MonedaP: 'USD',
            Monto: '123.45',
        });
        pago.multiDoctoRelacionado(
            ...[
                { ImpPagado: '50.00' }, // 50.00
                { MonedaDR: 'EUR', TipoCambioDR: '0.50', ImpPagado: '25.00' }, // 25.00 / 0.50 => 50
                { MonedaDR: 'MXN', TipoCambioDR: '18.7894', ImpPagado: '440.61' }, // 440.61 / 18.7894 => 23.45
            ]
        );
        const validator = new MontoBetweenIntervalSumOfDocuments();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([['122.93'], ['123.98']])('invalids', (monto) => {
        const pago = new Pago({
            MonedaP: 'USD',
            Monto: monto,
        });
        pago.multiDoctoRelacionado(
            ...[
                { ImpPagado: '20.00' }, // 20.00
                { MonedaDR: 'USD', ImpPagado: '30.00' }, // 30.00
                { MonedaDR: 'EUR', TipoCambioDR: '0.50', ImpPagado: '25.00' }, // 25.00 / 0.50 => 50
                { MonedaDR: 'MXN', TipoCambioDR: '18.7894', ImpPagado: '440.61' }, // 440.61 / 18.7894 => 23.45
            ]
        );
        const validator = new MontoBetweenIntervalSumOfDocuments();

        expect.hasAssertions();
        try {
            validator.validatePago(pago);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatePagoException);
        }
    });

    test('valid with several decimals', () => {
        // payment was made of 5137.42 USD (ER: 18.7694) => 96426.29 MXN
        // to pay a document on USD
        const pago = new Pago({
            MonedaP: 'MXN',
            Monto: '96426.29',
        });
        pago.addDoctoRelacionado({
            MonedaDR: 'USD',
            TipoCambioDR: Number(1 / 18.7694).toFixed(4),
            ImpPagado: '5137.42',
        });
        const validator = new MontoBetweenIntervalSumOfDocuments();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test('valid with multi documents', () => {
        const pago = new Pago({
            MonedaP: 'MXN',
            Monto: '21588.07',
        });
        pago.multiDoctoRelacionado(
            ...[
                { MonedaDR: 'MXN', ImpPagado: '6826.60' },
                { MonedaDR: 'MXN', ImpPagado: '2114.52' },
                { MonedaDR: 'MXN', ImpPagado: '11245.04' },
                { MonedaDR: 'MXN', ImpPagado: '1401.91' },
            ]
        );
        const validator = new MontoBetweenIntervalSumOfDocuments();

        expect(validator.validatePago(pago)).toBeTruthy();
    });

    test.each([...providerValidWithRandomAmounts()])('valid with random amounts', (amount) => {
        const pago = new Pago({
            MonedaP: 'MXN',
            Monto: amount.toFixed(2),
        });
        pago.multiDoctoRelacionado(
            ...[
                { MonedaDR: 'MXN', ImpPagado: (amount / 3).toFixed(2) },
                { MonedaDR: 'MXN', ImpPagado: ((2 * amount) / 3).toFixed(2) },
            ]
        );
        const validator = new MontoBetweenIntervalSumOfDocuments();

        expect(validator.validatePago(pago)).toBeTruthy();
    });
});
