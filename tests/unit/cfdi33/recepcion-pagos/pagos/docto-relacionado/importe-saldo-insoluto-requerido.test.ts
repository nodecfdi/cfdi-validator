import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { ImporteSaldoInsolutoRequerido } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/importe-saldo-insoluto-requerido';
import { ValidateDoctoException } from '../../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('ImporteSaldoInsolutoRequerido', () => {
    const { DoctoRelacionado } = Pagos10;

    test('valid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            ImpSaldoInsoluto: '1',
        });
        const validator = new ImporteSaldoInsolutoRequerido();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto));
    });

    test('invalid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            ImpSaldoInsoluto: null,
        });
        const validator = new ImporteSaldoInsolutoRequerido();
        validator.setIndex(0);

        expect.hasAssertions();
        try {
            validator.validateDoctoRelacionado(docto);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidateDoctoException);
        }
    });
});
