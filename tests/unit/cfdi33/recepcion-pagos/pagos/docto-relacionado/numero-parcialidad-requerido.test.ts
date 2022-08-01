import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { NumeroParcialidadRequerido } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/numero-parcialidad-requerido';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('NumeroParcialidadRequerido', () => {
    const { DoctoRelacionado } = Pagos10;

    test('valid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            NumParcialidad: '1'
        });
        const validator = new NumeroParcialidadRequerido();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test('invalid', () => {
        const docto = new DoctoRelacionado({
            MetodoDePagoDR: 'PPD',
            NumParcialidad: null
        });
        const validator = new NumeroParcialidadRequerido();
        validator.setIndex(0);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
