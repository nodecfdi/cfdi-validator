import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImporteSaldoAnteriorValor } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-saldo-anterior-valor';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImporteSaldoAnteriorValor', () => {
    const { DoctoRelacionado } = Pagos10;

    test.each([['0.01'], ['123456.78']])('valid %s', (input) => {
        const docto = new DoctoRelacionado({
            ImpSaldoAnt: input
        });
        const validator = new ImporteSaldoAnteriorValor();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([['0'], ['-123.45'], [''], [null]])('invalid %s', (input: string | null) => {
        const docto = new DoctoRelacionado({
            ImpSaldoAnt: input
        });
        const validator = new ImporteSaldoAnteriorValor();
        validator.setIndex(0);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
