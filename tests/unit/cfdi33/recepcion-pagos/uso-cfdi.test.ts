/* eslint-disable jest/expect-expect */
import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { UsoCfdi } from '~/cfdi33/recepcion-pagos/uso-cfdi';
import { Status } from '~/status';

describe('UsoCfdi', () => {
    const { setValidator, runValidate, getComprobante33, assertStatusEqualsCode } =
        useValidateComplementoPagosTestCase();

    beforeEach(() => {
        setValidator(new UsoCfdi());
    });

    test('valid case', async () => {
        const comprobante = getComprobante33();
        comprobante.addReceptor({
            UsoCFDI: 'P01'
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'PAGUSO01');
    });

    test('invalid uso cfdi', async () => {
        const comprobante = getComprobante33();
        comprobante.addReceptor({
            UsoCFDI: 'P02'
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGUSO01');
    });

    test('invalid no receptor', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGUSO01');
    });
});
