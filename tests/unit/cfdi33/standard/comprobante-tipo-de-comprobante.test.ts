/* eslint-disable jest/expect-expect */
import { CNode } from '@nodecfdi/cfdiutils-common';
import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteTipoDeComprobante } from '~/cfdi33/standard/comprobante-tipo-de-comprobante';
import { Status } from '~/status';

describe('ComprobanteTipoDeComprobante', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteTipoDeComprobante());
    });

    test.each([['T'], ['P'], ['N']])('valid TPN', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP01');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP02');
    });

    test.each([['T'], ['P'], ['N']])('invalid TPN', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            CondicionesDePago: '',
            FormaPago: '',
            MetodoPago: ''
        });
        getComprobante33().addChild(new CNode('cfdi:Impuestos'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCOMP01');
        assertStatusEqualsCode(Status.error(), 'TIPOCOMP02');
    });

    test.each([['T'], ['P']])('valid TP', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            FormaPago: null, // set to null to make clear that it must not exist
            MetodoPago: null, // set to null to make clear that it must not exist
            SubTotal: '0',
            Total: '0.00'
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP03');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP04');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP05');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP06');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP07');
        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP08');
    });

    test.each([['T'], ['P']])('invalid TP', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            FormaPago: '',
            MetodoPago: ''
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCOMP03');
        assertStatusEqualsCode(Status.error(), 'TIPOCOMP04');
    });

    test.each([['T'], ['P']])('invalid TP descuentos', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            Descuento: ''
        });
        getComprobante33().addChild(
            new CNode('cfdi:Conceptos', {}, [new CNode('cfdi:Concepto'), new CNode('cfdi:Concepto', { Descuento: '' })])
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCOMP05');
        assertStatusEqualsCode(Status.error(), 'TIPOCOMP06');
    });

    const providerToNonZero = (): (string | null)[][] => {
        const types = ['T', 'P'];
        const values = [null, '', '0.000001', '123.45', 'foo'];
        const provider: (string | null)[][] = [];
        types.forEach((tipoDeComprobante) => {
            values.forEach((subtotal) => {
                provider.push([tipoDeComprobante, subtotal]);
            });
        });

        return provider;
    };

    test.each(providerToNonZero())('invalid subtotal', async (tipoDeComprobante, subtotal) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            SubTotal: subtotal
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCOMP07');
    });

    test.each(providerToNonZero())('invalid total', async (tipoDeComprobante, total) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante,
            Total: total
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TIPOCOMP08');
    });

    test.each([['I'], ['E'], ['N']])('valid IEN valor unitario greater than zero %s', async (tipoDeComprobante) => {
        getComprobante33().addAttributes({
            TipoDeComprobante: tipoDeComprobante
        });
        getComprobante33().addChild(
            new CNode('cfdi:Conceptos', {}, [
                new CNode('cfdi:Concepto', { ValorUnitario: '123.45' }),
                new CNode('cfdi:Concepto', { ValorUnitario: '0.000001' })
            ])
        );

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TIPOCOMP09');
    });

    const providerIENWrongValue = (): (string | null)[][] => {
        const tC = ['I', 'E', 'N'];
        const wrongUnits = [null, '', '0', '0.00', '0.0000001'];
        const provider: (string | null)[][] = [];
        tC.forEach((tipoDeComprobante) => {
            wrongUnits.forEach((wrongUnit) => {
                provider.push([tipoDeComprobante, wrongUnit]);
            });
        });

        return provider;
    };

    test.each(providerIENWrongValue())(
        'invalid IEN valor unitario greater than zero',
        async (tipoDeComprobante, wrongUnitValue) => {
            getComprobante33().addAttributes({
                TipoDeComprobante: tipoDeComprobante
            });
            getComprobante33().addChild(
                new CNode('cfdi:Conceptos', {}, [
                    new CNode('cfdi:Concepto', { ValorUnitario: '123.45' }),
                    new CNode('cfdi:Concepto', { ValorUnitario: wrongUnitValue })
                ])
            );

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'TIPOCOMP09');
        }
    );
});
