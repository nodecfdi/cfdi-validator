import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { Pago } from '../../../../src/cfdi33/recepcion-pagos/pago';

describe('Pago', () => {
    const { setValidator } = useValidateComplementoPagosTestCase();
    let validator: Pago;

    beforeEach(() => {
        validator = new Pago();
        setValidator(validator);
    });

    test('validators codes', () => {
        const expectedValidators: string[] = [];
        for (let i = 2; i <= 22; i++) {
            expectedValidators.push(`PAGO${i.toString().padStart(2, '0')}`);
        }
        expectedValidators.push('PAGO30');

        const validators = validator.getValidators();
        const validatorCodes: string[] = [];
        validators.forEach((val) => {
            if ('' !== val.getCode()) {
                validatorCodes.push(val.getCode());
            }
        });

        expect(validatorCodes).toStrictEqual(expectedValidators);
    });
});
