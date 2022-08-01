/* eslint-disable jest/expect-expect */
import { CNode } from '@nodecfdi/cfdiutils-common';
import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteDecimalesMoneda } from '~/cfdi33/standard/comprobante-decimales-moneda';
import { Status } from '~/status';

describe('ComprobanteDecimalesMoneda', () => {
    const {
        setValidator,
        getComprobante33,
        runValidate,
        getAsserts,
        assertStatusEqualsStatus,
        assertStatusEqualsAssert,
        assertStatusEqualsCode
    } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteDecimalesMoneda());
    });

    test('unknown currency', async () => {
        getComprobante33().attributes().set('Moneda', 'LYD'); // Dinar libio
        await runValidate();

        for (const assert of getAsserts().values()) {
            assertStatusEqualsStatus(Status.none(), assert.getStatus());
        }
    });

    test('all asserts are ok', async () => {
        getComprobante33().addAttributes({
            Moneda: 'MXN',
            SubTotal: '123',
            Descuento: '1.2',
            Total: '999.99'
        });
        getComprobante33().addChild(
            new CNode(
                'cfdi:Impuestos',
                {
                    TotalImpuestosTrasladados: '1.23',
                    TotalImpuestosRetenidos: '1.23'
                },
                [
                    new CNode('cfdi:Traslados', {}, [new CNode('cfdi:Traslado', { Importe: '123.45' })]),
                    new CNode('cfdi:Retenciones', {}, [new CNode('cfdi:Retencion', { Importe: '123.45' })])
                ]
            )
        );

        await runValidate();
        for (const assert of getAsserts().values()) {
            assertStatusEqualsAssert(Status.ok(), assert);
        }
    });

    test('all asserts missing attributes', async () => {
        getComprobante33().addAttributes({
            Moneda: 'MXN'
        });
        getComprobante33().addChild(
            new CNode('cfdi:Impuestos', {}, [
                new CNode('cfdi:Traslados', {}, [new CNode('cfdi:Traslado', {})]),
                new CNode('cfdi:Retenciones', {}, [new CNode('cfdi:Retencion', {})])
            ])
        );

        await runValidate();
        assertStatusEqualsCode(Status.error(), 'MONDEC01');
        assertStatusEqualsCode(Status.ok(), 'MONDEC02');
        assertStatusEqualsCode(Status.error(), 'MONDEC03');
        assertStatusEqualsCode(Status.ok(), 'MONDEC04');
        assertStatusEqualsCode(Status.ok(), 'MONDEC05');
    });

    test('all asserts are error', async () => {
        getComprobante33().addAttributes({
            Moneda: 'MXN',
            SubTotal: '123.000',
            Descuento: '123.000',
            Total: '123.000'
        });
        getComprobante33().addChild(
            new CNode(
                'cfdi:Impuestos',
                {
                    TotalImpuestosTrasladados: '123.000',
                    TotalImpuestosRetenidos: '123.000'
                },
                [
                    new CNode('cfdi:Traslados', {}, [
                        new CNode('cfdi:Traslado', { Importe: '123.00' }),
                        new CNode('cfdi:Traslado', { Importe: '123.000' })
                    ]),
                    new CNode('cfdi:Retenciones', {}, [
                        new CNode('cfdi:Retencion', { Importe: '123.000' }),
                        new CNode('cfdi:Retencion', { Importe: '123.000' })
                    ])
                ]
            )
        );

        await runValidate();
        for (const assert of getAsserts().values()) {
            assertStatusEqualsAssert(Status.error(), assert);
        }
    });
});
