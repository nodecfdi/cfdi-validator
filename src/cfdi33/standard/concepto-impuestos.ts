import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../status';

/**
 * ConceptoImpuestos
 *
 * Válida que:
 * - CONCEPIMPC01: El nodo impuestos de un concepto debe incluir traslados y/o retenciones (CFDI33152)
 * - CONCEPIMPC02: Los traslados de los impuestos de un concepto deben tener una base y ser mayor a cero (CFDI33154)
 * - CONCEPIMPC03: No se debe registrar la tasa o cuota ni el importe cuando
 *                 el tipo de factor de traslado es exento (CFDI33157)
 * - CONCEPIMPC04: Se debe registrar la tasa o cuota y el importe cuando
 *                 el tipo de factor de traslado es tasa o cuota (CFDI33158)
 * - CONCEPIMPC05: Las retenciones de los impuestos de un concepto deben tener una base y ser mayor a cero (CFDI33154)
 * - CONCEPIMPC06: Las retenciones de los impuestos de un concepto deben tener
 *                 un tipo de factor diferente de exento (CFDI33166)
 */
export class ConceptoImpuestos extends AbstractDiscoverableVersion33 {
    private registerAsserts(asserts: Asserts): void {
        const assertsDescriptions: Record<string, string> = {
            CONCEPIMPC01: 'El nodo impuestos de un concepto debe incluir traslados y/o retenciones (CFDI33152)',
            CONCEPIMPC02: [
                'Los traslados de los impuestos de un concepto deben tener una base y ser mayor a cero',
                ' (CFDI33154)',
            ].join(''),
            CONCEPIMPC03: [
                'No se debe registrar la tasa o cuota ni el importe cuando el tipo de factor de traslado',
                ' es exento (CFDI33157)',
            ].join(''),
            CONCEPIMPC04: [
                'Se debe registrar la tasa o cuota y el importe cuando el tipo de factor de traslado',
                ' es tasa o cuota (CFDI33158)',
            ].join(''),
            CONCEPIMPC05: [
                'Las retenciones de los impuestos de un concepto deben tener una base y ser mayor a cero',
                '(CFDI33154)',
            ].join(''),
            CONCEPIMPC06: [
                'Las retenciones de los impuestos de un concepto deben tener un tipo de factor diferente',
                ' de exento (CFDI33166)',
            ].join(''),
        };
        Object.entries(assertsDescriptions).forEach(([code, title]) => {
            asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this.registerAsserts(asserts);

        let status01 = Status.ok();
        let status02 = Status.ok();
        let status03 = Status.ok();
        let status04 = Status.ok();
        let status05 = Status.ok();
        let status06 = Status.ok();

        comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto').forEach((concepto, i) => {
            if (status01.isOk() && !this.conceptoImpuestosHasTrasladosOrRetenciones(concepto)) {
                status01 = Status.error();
                asserts.get('CONCEPIMPC01').setExplanation(`Concepto #${i}`);
            }

            const traslados = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado');
            traslados.forEach((traslado, k) => {
                if (status02.isOk() && !this.impuestoHasBaseGreaterThanZero(traslado)) {
                    status02 = Status.error();
                    asserts.get('CONCEPIMPC02').setExplanation(`Concepto #${i}, Traslado #${k}`);
                }
                if (status03.isOk() && !this.trasladoHasTipoFactorExento(traslado)) {
                    status03 = Status.error();
                    asserts.get('CONCEPIMPC03').setExplanation(`Concepto #${i}, Traslado #${k}`);
                }
                if (status04.isOk() && !this.trasladoHasTipoFactorTasaOCuota(traslado)) {
                    status04 = Status.error();
                    asserts.get('CONCEPIMPC04').setExplanation(`Concepto #${i}, Traslado #${k}`);
                }
            });

            const retenciones = concepto.searchNodes('cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion');
            retenciones.forEach((retencion, j) => {
                if (status05.isOk() && !this.impuestoHasBaseGreaterThanZero(retencion)) {
                    status05 = Status.error();
                    asserts.get('CONCEPIMPC05').setExplanation(`Concepto #${i}, Retención #${j}`);
                }
                if (status06.isOk() && 'Exento' === retencion.attributes().get('TipoFactor')) {
                    status06 = Status.error();
                    asserts.get('CONCEPIMPC06').setExplanation(`Concepto #${i}, Retención #${j}`);
                }
            });
        });

        asserts.putStatus('CONCEPIMPC01', status01);
        asserts.putStatus('CONCEPIMPC02', status02);
        asserts.putStatus('CONCEPIMPC03', status03);
        asserts.putStatus('CONCEPIMPC04', status04);
        asserts.putStatus('CONCEPIMPC05', status05);
        asserts.putStatus('CONCEPIMPC06', status06);

        return Promise.resolve(undefined);
    }

    protected conceptoImpuestosHasTrasladosOrRetenciones(concepto: CNodeInterface): boolean {
        const impuestos = concepto.searchNode('cfdi:Impuestos');
        if (!impuestos) {
            return true;
        }
        return (
            impuestos.searchNodes('cfdi:Traslados', 'cfdi:Traslado').length !== 0 ||
            impuestos.searchNodes('cfdi:Retenciones', 'cfdi:Retencion').length !== 0
        );
    }

    protected impuestoHasBaseGreaterThanZero(impuesto: CNodeInterface): boolean {
        if (!impuesto.offsetExists('Base')) {
            return false;
        }
        if (isNaN(Number(impuesto.get('Base')))) {
            return false;
        }
        return parseFloat(impuesto.get('Base') || '0') >= 0.000001;
    }

    protected trasladoHasTipoFactorExento(traslado: CNodeInterface): boolean {
        if ('Exento' === traslado.get('TipoFactor')) {
            if (traslado.offsetExists('TasaOCuota')) {
                return false;
            }
            if (traslado.offsetExists('Importe')) {
                return false;
            }
        }
        return true;
    }

    protected trasladoHasTipoFactorTasaOCuota(traslado: CNodeInterface): boolean {
        if ('Tasa' === traslado.get('TipoFactor') || 'Cuota' === traslado.get('TipoFactor')) {
            if ('' === traslado.get('TasaOCuota')) {
                return false;
            }
            if ('' === traslado.get('Importe')) {
                return false;
            }
        }
        return true;
    }

    public static createDiscovered(): ValidatorInterface {
        return new ConceptoImpuestos();
    }
}
