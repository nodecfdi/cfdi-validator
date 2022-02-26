import { FormaPagoCatalog } from '../../../../../src/cfdi33/recepcion-pagos/helpers/forma-pago-catalog';

describe('FormaPagoCatalog', () => {
    test.each([
        ['Efectivo', '01'],
        ['Cheque nominativo', '02'],
        ['Transferencia electrónica de fondos', '03'],
        ['Tarjeta de crédito', '04'],
        ['Monedero electrónico', '05'],
        ['Dinero electrónico', '06'],
        ['Vales de despensa', '08'],
        ['Dación en pago', '12'],
        ['Pago por subrogación', '13'],
        ['Pago por consignación', '14'],
        ['Condonación', '15'],
        ['Compensación', '17'],
        ['Novación', '23'],
        ['Confusión', '24'],
        ['Remisión de deuda', '25'],
        ['Prescripción o caducidad', '26'],
        ['A satisfacción del acreedor', '27'],
        ['Tarjeta de débito', '28'],
        ['Tarjeta de servicios', '29'],
        ['Por definir', '99'],
    ])('obtain %s', (name: string, key: string) => {
        const paymentType = new FormaPagoCatalog().obtain(key);
        expect(paymentType.key()).toBe(key);
    });

    test('obtain with non existent key', () => {
        try {
            new FormaPagoCatalog().obtain('FOO');
        } catch (e) {
            expect(e).toBeInstanceOf(RangeError);
            expect((e as RangeError).message).toContain('FOO');
        }
    });
});
