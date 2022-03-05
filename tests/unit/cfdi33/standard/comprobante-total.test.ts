import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteTotal } from '../../../../src/cfdi33/standard/comprobante-total';
import { Status } from '../../../../src';

describe('ComprobanteTotal', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteTotal());
    });

    test.each([[''], [null], ['foo'], ['1.2e3'], ['0.'], ['.0'], ['0..0'], ['0.0.0'], ['-0.0001']])(
        'total with invalid value',
        async (value: string | null) => {
            getComprobante33().addAttributes({
                Total: value,
            });

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'TOTAL01');
        }
    );

    test.each([['0'], ['0.0'], ['123.45']])('total with correct value', async (value: string | null) => {
        getComprobante33().addAttributes({
            Total: value,
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TOTAL01');
    });
});
