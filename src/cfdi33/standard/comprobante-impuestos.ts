import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ConceptoImpuestos
 *
 * Válida que:
 * - COMPIMPUESTOSC01: Si existe el nodo impuestos entonces debe incluir el total de traslados
 *                     y/o el total de retenciones
 * - COMPIMPUESTOSC02: Si existe al menos un traslado entonces debe existir el total de traslados
 * - COMPIMPUESTOSC03: Si existe al menos una retención entonces debe existir el total de retenciones
 */
export class ComprobanteImpuestos extends AbstractDiscoverableVersion33 {
    private registerAsserts(asserts: Asserts): void {
        const assertDescriptions: Record<string, string> = {
            COMPIMPUESTOSC01: [
                'Si existe el nodo impuestos entonces debe incluir el total de traslados y/o',
                ' el total de retenciones'
            ].join(''),
            COMPIMPUESTOSC02: 'Si existe al menos un traslado entonces debe existir el total de traslados',
            COMPIMPUESTOSC03: 'Si existe al menos una retención entonces debe existir el total de retenciones'
        };
        Object.entries(assertDescriptions).forEach(([code, title]) => {
            asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this.registerAsserts(asserts);

        const nodeImpuestos = comprobante.searchNode('cfdi:Impuestos');
        if (!nodeImpuestos) {
            return Promise.resolve();
        }

        const existsTotalTrasladados = nodeImpuestos.offsetExists('TotalImpuestosTrasladados');
        const existsTotalRetenidos = nodeImpuestos.offsetExists('TotalImpuestosRetenidos');

        asserts.putStatus('COMPIMPUESTOSC01', Status.when(existsTotalTrasladados || existsTotalRetenidos));

        const hasTraslados = !!nodeImpuestos.searchNode('cfdi:Traslados', 'cfdi:Traslado');
        asserts.putStatus('COMPIMPUESTOSC02', Status.when(!(hasTraslados && !existsTotalTrasladados)));

        const hasRetenciones = !!nodeImpuestos.searchNode('cfdi:Retenciones', 'cfdi:Retencion');
        asserts.putStatus('COMPIMPUESTOSC03', Status.when(!(hasRetenciones && !existsTotalRetenidos)));

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobanteImpuestos();
    }
}
