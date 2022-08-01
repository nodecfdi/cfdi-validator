import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImportePagadoValor } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-pagado-valor';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImportePagadoValor', () => {
    const { DoctoRelacionado, Pago } = Pagos10;

    test.each([['0.01'], ['123456.78']])('valid', (input) => {
        const docto = new DoctoRelacionado({
            ImpPagado: input
        });
        const validator = new ImportePagadoValor();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test('with calculate', () => {
        const pago = new Pago({ Monto: 123 });
        const docto = pago.addDoctoRelacionado();
        const validator = new ImportePagadoValor();
        validator.setIndex(0);
        validator.setPago(pago);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([['0'], ['-123.45'], [''], [null]])('invalid %s', (input: string | null) => {
        const pago = new Pago();
        const docto = pago.addDoctoRelacionado({
            ImpPagado: input
        });
        const validator = new ImportePagadoValor();
        validator.setIndex(0);
        validator.setPago(pago);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
