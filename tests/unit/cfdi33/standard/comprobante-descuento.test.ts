import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteDescuento } from '../../../../src/cfdi33/standard/comprobante-descuento';
import { Status } from '../../../../src/status';

describe('ComprobanteDescuento', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteDescuento());
    });

    test.each([
        ['0', '1'],
        ['1', '1'],
        ['0.000000', '0.000001'],
        ['0', '0'],
        ['1.00', '1.01'],
    ])('valid cases', async (descuento, subtotal) => {
        getComprobante33().addAttributes({
            Descuento: descuento,
            SubTotal: subtotal,
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'DESCUENTO01');
    });

    test.each([
        ['', '0'],
        ['1', '0'],
        ['5', null],
        ['0.000001', '0.000000'],
        ['-1', '5'],
        ['-5', '5'],
    ])('invalid cases', async (descuento: string, subtotal: string | null) => {
        getComprobante33().addAttributes({
            Descuento: descuento,
            SubTotal: subtotal,
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'DESCUENTO01');
    });

    test('node case', async () => {
        getComprobante33().addAttributes({
            Descuento: null,
        });

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'DESCUENTO01');
    });
});
