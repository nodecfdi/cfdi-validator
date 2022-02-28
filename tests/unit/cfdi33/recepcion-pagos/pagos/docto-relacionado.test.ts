import { DoctoRelacionado } from '../../../../../src/cfdi33/recepcion-pagos/pagos/docto-relacionado';

describe('DoctoRelacionado', () => {
    test('validators codes', () => {
        const expectedValidators: string[] = [];
        for (let i = 23; i < 34; i++) {
            expectedValidators.push(`PAGO${i}`);
        }

        const validator = new DoctoRelacionado();
        const validators = validator.createValidators();

        const codes = validators.map((v) => v.getCode());

        expect(codes).toStrictEqual(expectedValidators);
    });
});
