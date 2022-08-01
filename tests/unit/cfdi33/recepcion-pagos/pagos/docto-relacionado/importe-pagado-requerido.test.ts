import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImportePagadoRequerido } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-pagado-requerido';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

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
            TipoCambioDR: exchangeRate // exists!
        });
        const validator = new ImportePagadoRequerido();
        validator.setIndex(0);
        validator.setPago(pago);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
        expect(t).toThrow('existe el tipo de cambio');
    });

    test('invalid more than one document', () => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado();
        pago.addDoctoRelacionado(); // second document
        const validator = new ImportePagadoRequerido();
        validator.setIndex(0);
        validator.setPago(pago);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
        expect(t).toThrow('hay más de 1 documento en el pago');
    });
});
