import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { Moneda } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/moneda';
import { ValidateDoctoException } from '~/cfdi33/recepcion-pagos/pagos/docto-relacionado/validate-docto-exception';

describe('Moneda', () => {
    const { DoctoRelacionado } = Pagos10;

    test.each([['MXN'], ['USD'], [''], [null]])('valid', (input: string | null) => {
        const docto = new DoctoRelacionado({
            MonedaDR: input
        });
        const validator = new Moneda();
        validator.setIndex(0);

        expect(validator.validateDoctoRelacionado(docto)).toBeTruthy();
    });

    test.each([['XXX']])('invalid', (input) => {
        const docto = new DoctoRelacionado({
            MonedaDR: input
        });
        const validator = new Moneda();
        validator.setIndex(0);

        const t = (): boolean => validator.validateDoctoRelacionado(docto);

        expect(t).toThrow(ValidateDoctoException);
    });
});
