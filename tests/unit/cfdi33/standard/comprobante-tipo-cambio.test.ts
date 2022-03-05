import { ComprobanteTipoCambio } from '../../../../src/cfdi33/standard/comprobante-tipo-cambio';
import { useValidate33TestCase } from '../validate33-test-case';
import { Status } from '../../../../src';

describe('ComprobanteTipoCambio', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteTipoCambio());
    });

    test.each([
        ['MXN', '1', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['MXN', '1.000000', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['MXN', null, 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['XXX', null, 'TIPOCAMBIO03', ['TIPOCAMBIO02', 'TIPOCAMBIO04']],
        ['USD', '10.0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '20', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0005.10000', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '123456789012345678.0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0.123456', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
    ])('moneda with valid values', async (moneda: string, tipoCambio: string | null, ok: string, nones: string[]) => {
        getComprobante33().addAttributes({
            Moneda: moneda,
            TipoCambio: tipoCambio,
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TIPOCAMBIO01');
        assertStatusEqualsCode(Status.ok(), ok);
        nones.forEach((none) => {
            assertStatusEqualsCode(Status.none(), none);
        });
    });

    test.each([
        [null, null],
        [null, ''],
        [null, '18.9000'],
        ['', null],
        ['', ''],
        ['', '18.9000'],
    ])('no moneda or empty', async (moneda: string | null, tipoCambio: string | null) => {
        getComprobante33().addAttributes({
            Moneda: moneda,
            TipoCambio: tipoCambio,
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCAMBIO01');
        assertStatusEqualsCode(Status.none(), 'TIPOCAMBIO02');
        assertStatusEqualsCode(Status.none(), 'TIPOCAMBIO03');
        assertStatusEqualsCode(Status.none(), 'TIPOCAMBIO04');
    });

    test.each([
        ['MXN', '', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['MXN', '1.000001', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['MXN', '0.999999', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['MXN', '10.0', 'TIPOCAMBIO02', ['TIPOCAMBIO03', 'TIPOCAMBIO04']],
        ['XXX', '', 'TIPOCAMBIO03', ['TIPOCAMBIO02', 'TIPOCAMBIO04']],
        ['XXX', '10.0', 'TIPOCAMBIO03', ['TIPOCAMBIO02', 'TIPOCAMBIO04']],
        ['USD', null, 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', 'abc', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '1234567890123456789.0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0.1234567', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0.', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '.0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0..0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
        ['USD', '0.0.0', 'TIPOCAMBIO04', ['TIPOCAMBIO02', 'TIPOCAMBIO03']],
    ])(
        'moneda with invalid values',
        async (moneda: string, tipoCambio: string | null, error: string, nones: string[]) => {
            getComprobante33().addAttributes({
                Moneda: moneda,
                TipoCambio: tipoCambio,
            });

            await runValidate();

            assertStatusEqualsCode(Status.ok(), 'TIPOCAMBIO01');
            assertStatusEqualsCode(Status.error(), error);
            nones.forEach((none) => {
                assertStatusEqualsCode(Status.none(), none);
            });
        }
    );
});
