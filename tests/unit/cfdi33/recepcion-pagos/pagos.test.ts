/* eslint-disable jest/expect-expect */
import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { Pagos } from '~/cfdi33/recepcion-pagos/pagos';
import { Status } from '~/status';

describe('Pagos', () => {
    const { setValidator, runValidate, assertStatusEqualsCode, getComplemento } = useValidateComplementoPagosTestCase();

    beforeEach(() => {
        setValidator(new Pagos());
    });

    test('valid case', async () => {
        getComplemento().addPago();

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'PAGOS01');
    });

    test('without nodes', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGOS01');
    });
});
