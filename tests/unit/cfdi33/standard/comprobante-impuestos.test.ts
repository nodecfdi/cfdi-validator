import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteImpuestos } from '../../../../src/cfdi33/standard/comprobante-impuestos';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../../../src/status';

describe('ComprobanteImpuestos', () => {
    const { setValidator, runValidate, assertStatusEqualsCode, getComprobante33 } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteImpuestos());
    });

    test.each([
        [true, false],
        [false, true],
        [true, true],
    ])('valid impuestos', async (putTraslados, putRetenciones) => {
        const nodeImpuestos = new CNode('cfdi:Impuestos');
        if (putTraslados) {
            nodeImpuestos.attributes().set('TotalImpuestosTrasladados', '');
            nodeImpuestos.addChild(new CNode('cfdi:Traslados', {}, [new CNode('cfdi:Traslado')]));
        }
        if (putRetenciones) {
            nodeImpuestos.attributes().set('TotalImpuestosRetenidos', '');
            nodeImpuestos.addChild(new CNode('cfdi:Retenciones', {}, [new CNode('cfdi:Retencion')]));
        }
        getComprobante33().addChild(nodeImpuestos);

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPIMPUESTOSC01');
        assertStatusEqualsCode(Status.ok(), 'COMPIMPUESTOSC02');
        assertStatusEqualsCode(Status.ok(), 'COMPIMPUESTOSC03');
    });

    test('invalid with empty impuestos', async () => {
        getComprobante33().addChild(new CNode('cfdi:Impuestos'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPIMPUESTOSC01');
    });

    test('invalid traslados nodes without total traslados', async () => {
        getComprobante33().addChild(
            new CNode('cfdi:Impuestos', {}, [new CNode('cfdi:Traslados', {}, [new CNode('cfdi:Traslado')])])
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPIMPUESTOSC02');
    });

    test('valid total traslados without traslados nodes', async () => {
        getComprobante33().addChild(
            new CNode('cfdi:Impuestos', {
                TotalImpuestosTrasladados: '',
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPIMPUESTOSC02');
    });

    test('invalid retenciones nodes without total retenciones', async () => {
        getComprobante33().addChild(
            new CNode('cfdi:Impuestos', {}, [new CNode('cfdi:Retenciones', {}, [new CNode('cfdi:Retencion')])])
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPIMPUESTOSC03');
    });

    test('valid total traslados without retenciones nodes', async () => {
        getComprobante33().addChild(
            new CNode('cfdi:Impuestos', {
                TotalImpuestosRetenidos: '',
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPIMPUESTOSC03');
    });

    test('without node impuestos', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'COMPIMPUESTOSC01');
        assertStatusEqualsCode(Status.none(), 'COMPIMPUESTOSC02');
        assertStatusEqualsCode(Status.none(), 'COMPIMPUESTOSC03');
    });
});
