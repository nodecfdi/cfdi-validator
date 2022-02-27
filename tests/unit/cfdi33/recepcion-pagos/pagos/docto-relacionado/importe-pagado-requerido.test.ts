import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImportePagadoRequerido } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-pagado-requerido';
import { ValidateDoctoException } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImportePagadoRequerido', () => {
    const { DoctoRelacionado, Pago } = Pagos10;

    test('valid', () => {
        const docto = new DoctoRelacionado({ ImpPagado: '1' });
        const validator = new ImportePagadoRequerido();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([['19.8765'], ['']])('invalid exchange rate %s', (exchangeRate) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            TipoCambioDR: exchangeRate, // exists!
        });
        const validator = new ImportePagadoRequerido();
        validator.setIndex(0);
        validator.setPago(pago);

        expect.hasAssertions();
        try {
            validator.validateDoctoRelacionado(docto);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidateDoctoException);
            expect((e as ValidateDoctoException).message).toContain('existe el tipo de cambio');
        }
    });

    test('invalid more than one document', () => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado();
        pago.addDoctoRelacionado(); // second document
        const validator = new ImportePagadoRequerido();
        validator.setIndex(0);
        validator.setPago(pago);

        expect.hasAssertions();
        try {
            validator.validateDoctoRelacionado(docto);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidateDoctoException);
            expect((e as ValidateDoctoException).message).toContain('hay más de 1 documento en el pago');
        }
    });
});
