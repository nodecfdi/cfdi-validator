import { useValidate33TestCase } from '../validate33-test-case';
import { SumasConceptosComprobanteImpuestos } from '../../../../src/cfdi33/standard/sumas-conceptos-comprobante-impuestos';
import { AbstractDiscoverableVersion33 } from '../../../../src/cfdi33/abstracts/abstract-discoverable-version33';
import { Status } from '../../../../src/status';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('SumasConceptosComprobanteImpuestos', () => {
    const {
        setValidator,
        runValidate,
        getAsserts,
        assertStatusEqualsAssert,
        assertStatusEqualsCode,
        setupCfdiFile,
        getComprobante,
    } = useValidate33TestCase();

    let validator: SumasConceptosComprobanteImpuestos;
    beforeEach(() => {
        validator = new SumasConceptosComprobanteImpuestos();
        setValidator(validator);
    });

    test('object specification', () => {
        expect(validator).toBeInstanceOf(AbstractDiscoverableVersion33);
        expect(validator.canValidateCfdiVersion('3.3')).toBeTruthy();
    });

    test('validate ok', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        await runValidate();
        // all asserts
        for (const assert of getAsserts().values()) {
            assertStatusEqualsAssert(Status.ok(), assert);
        }
        // total expected count: 12 regular + 2 extras
        expect(getAsserts()).toHaveLength(14);
    });

    test('validate bad subtotal', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().set('SubTotal', '123.45');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS01');
    });

    test('validate unset subtotal', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().delete('SubTotal');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS01');
    });

    test('validate bad descuentos', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().set('Descuento', '123.45');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS02');
    });

    test('validate bad total', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().set('Total', '123.45');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS03');
    });

    test('validate unset total', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().delete('Total');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS03');
    });

    test('validate unset impuestos', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const impuestos = getComprobante().searchNode('cfdi:Impuestos');
        if (impuestos) {
            getComprobante().children().remove(impuestos);
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS04');
        assertStatusEqualsCode(Status.error(), 'SUMAS05');
        assertStatusEqualsCode(Status.error(), 'SUMAS06');
        assertStatusEqualsCode(Status.error(), 'SUMAS08');
        assertStatusEqualsCode(Status.error(), 'SUMAS09');
        assertStatusEqualsCode(Status.error(), 'SUMAS10');
    });

    test('validate unset total impuestos trasladados', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const impuestos = getComprobante().searchNode('cfdi:Impuestos');
        if (impuestos) {
            impuestos.attributes().set('TotalImpuestosTrasladados', '123456.78');
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS04');
    });

    test('validate unset one impuestos trasladados', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const traslados = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Traslados');
        if (traslados) {
            const traslado = traslados.searchNode('cfdi:Traslado');
            if (traslado) {
                traslados.children().remove(traslado);
            }
        }
        expect(getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado')).toBeUndefined();

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS05');
    });

    test('validate bad one impuestos trasladados', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const traslados = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Traslados');
        if (traslados) {
            const traslado = traslados.searchNode('cfdi:Traslado');
            if (traslado) {
                traslado.attributes().set('Importe', '123456.78');
            }
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS06');
    });

    test('validate more impuestos trasladados', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const traslados = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Traslados');
        if (traslados) {
            traslados.addChild(
                new CNode('cfdi:Traslado', {
                    Base: '1000.00',
                    Impuesto: 'XXX',
                    TipoFactor: '0.050000',
                    TasaOCuota: 'tasa',
                    Importe: '50.00',
                })
            );
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS07');
    });

    test('validate unset total impuestos retenidos', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const impuestos = getComprobante().searchNode('cfdi:Impuestos');
        if (impuestos) {
            impuestos.attributes().set('TotalImpuestosRetenidos', '123456.78');
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS08');
    });

    test('validate unset one impuestos retenidos', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const retenciones = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Retenciones');
        if (retenciones) {
            const retencion = retenciones.searchNode('cfdi:Retencion');
            if (retencion) {
                retenciones.children().remove(retencion);
            }
        }
        expect(getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion')).toBeUndefined();

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS09');
    });

    test('validate bad one impuestos retenidos', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const retenciones = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Retenciones');
        if (retenciones) {
            const retencion = retenciones.searchNode('cfdi:Retencion');
            if (retencion) {
                retencion.attributes().set('Importe', '123456.78');
            }
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS10');
    });

    test('validate more impuestos retenciones', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        const retenciones = getComprobante().searchNode('cfdi:Impuestos', 'cfdi:Retenciones');
        if (retenciones) {
            retenciones.addChild(
                new CNode('cfdi:Retencion', {
                    Base: '1000.00',
                    Impuesto: 'XXX',
                    TipoFactor: '0.050000',
                    TasaOCuota: 'tasa',
                    Importe: '50.00',
                })
            );
        }

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SUMAS11');
    });

    test.each([
        ['greater', '12345.679', '12345.678', Status.error()],
        ['equal', '12345.678', '12345.678', Status.ok()],
        ['less', '12345.677', '12345.678', Status.ok()],
        ['empty', '', '12345.678', Status.ok()],
        ['zeros', '0.00', '0.00', Status.ok()],
    ])(
        'validate descuento less or equal than subtotal %s',
        async (name: string, descuento: string, subtotal: string, expected: Status) => {
            getComprobante().addAttributes({
                SubTotal: subtotal,
                Descuento: descuento,
            });

            await runValidate();

            assertStatusEqualsCode(expected, 'SUMAS12');
        }
    );
});
