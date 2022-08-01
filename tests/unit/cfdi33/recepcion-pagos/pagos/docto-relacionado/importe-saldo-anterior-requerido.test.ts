import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImporteSaldoAnteriorRequerido } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-saldo-anterior-requerido';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImporteSaldoAnteriorRequerido', () => {
    const { DoctoRelacionado } = Pagos10;

    test('valid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            ImpSaldoAnt: '1'
        });
        const validator = new ImporteSaldoAnteriorRequerido();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test('invalid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            ImpSaldoAnt: null
        });
        const validator = new ImporteSaldoAnteriorRequerido();
        validator.setIndex(0);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
