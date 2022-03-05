import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { ComprobantePagos } from '../../../../src/cfdi33/recepcion-pagos/comprobante-pagos';
import { Status } from '../../../../src';
import { Pagos10 } from '@nodecfdi/cfdiutils-elements';

describe('ComprobantePagos', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } =
        useValidateComplementoPagosTestCase();

    beforeEach(() => {
        setValidator(new ComprobantePagos());

        // setup a valid case and in the test change to make it fail
        const comprobante = getComprobante33();
        comprobante.addAttributes({
            Moneda: 'XXX',
            SubTotal: '0',
            Total: '0',
        });
    });

    test('valid case', async () => {
        await runValidate();

        for (let i = 1; i <= 10; i++) {
            assertStatusEqualsCode(Status.ok(), `PAGCOMP${i.toString().padStart(2, '0')}`);
        }
    });

    test('error with more than one complemento pagos', async () => {
        getComprobante33().getComplemento().add(new Pagos10.Pagos());
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP01');
    });

    test('error with forma pago', async () => {
        getComprobante33().addAttributes({
            FormaPago: '', // exists, even empty
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP02');
    });

    test('error with condiciones de pago', async () => {
        getComprobante33().addAttributes({
            CondicionesDePago: '', // exists, even empty
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP03');
    });

    test('error with metodo pago', async () => {
        getComprobante33().addAttributes({
            MetodoPago: '', // exists, even empty
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP04');
    });

    test.each([[''], [null], ['MXN']])('error with moneda not XXX', async (input: string | null) => {
        getComprobante33().addAttributes({
            Moneda: input,
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP05');
    });

    test('error with tipo cambio', async () => {
        getComprobante33().addAttributes({
            TipoCambio: '', // exists, even empty
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP06');
    });

    test('error with descuento', async () => {
        getComprobante33().addAttributes({
            Descuento: '', // exists, even empty
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP07');
    });

    test.each([[''], [null], ['0.0']])('error with subtotal not zero', async (input: string | null) => {
        getComprobante33().addAttributes({
            SubTotal: input,
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP08');
    });

    test.each([[''], [null], ['0.0']])('error with total not zero', async (input: string | null) => {
        getComprobante33().addAttributes({
            Total: input,
        });
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP09');
    });

    test('error with impuestos', async () => {
        getComprobante33().getImpuestos();
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGCOMP10');
    });
});
