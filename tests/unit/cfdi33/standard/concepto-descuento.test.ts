import { useValidate33TestCase } from '../validate33-test-case';
import { ConceptoDescuento } from '../../../../src/cfdi33/standard/concepto-descuento';
import { Status } from '../../../../src';

describe('ConceptoDescuento', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();
    let validator: ConceptoDescuento;

    beforeEach(() => {
        validator = new ConceptoDescuento();
        setValidator(validator);
    });

    test.each([
        ['', '0'],
        ['0', '1'],
        ['1', '1'],
        ['0.000000', '0.000001'],
        ['0', '0'],
        ['1.00', '1.01'],
    ])('valid cases', async (descuento, importe) => {
        getComprobante33().addConcepto({
            Descuento: descuento,
            Importe: importe,
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'CONCEPDESC01');
    });

    test.each([
        ['1', '0'],
        ['5', null],
        ['0.000001', '0.000000'],
        ['-1', '5'],
        ['-5', '5'],
    ])('invalid cases', async (descuento: string, importe: string | null) => {
        getComprobante33().addConcepto({
            Descuento: '1',
            Importe: '2',
        });
        const concepto = getComprobante33().addConcepto({
            Descuento: descuento,
            Importe: importe,
        });

        expect(validator.conceptoHasInvalidDiscount(concepto)).toBeTruthy();

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'CONCEPDESC01');
    });

    test('none case', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'CONCEPDESC01');
    });
});
