import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ConceptoDescuento
 *
 * Válida que:
 * - CONCEPDESC01: Si existe el atributo descuento en el concepto,
 *                 entonces debe ser menor o igual que el importe y mayor o igual que cero (CFDI33151)
 */
export class ConceptoDescuento extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        asserts.put(
            'CONCEPDESC01',
            [
                'Si existe el atributo descuento en el concepto,',
                ' entonces debe ser menor o igual que el importe y mayor o igual que cero (CFDI33151)'
            ].join('')
        );
        let checked = 0;
        comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto').forEach((concepto, i) => {
            checked = checked + 1;
            if (this.conceptoHasInvalidDiscount(concepto)) {
                const explanation = `Concepto #${i}, Descuento: "${concepto.get(
                    'Descuento'
                )}", Importe: "${concepto.get('Importe')}"`;
                asserts.putStatus('CONCEPDESC01', Status.error(), explanation);
            }
        });
        if (checked > 0 && asserts.get('CONCEPDESC01').getStatus().isNone()) {
            asserts.putStatus('CONCEPDESC01', Status.ok(), `Revisados ${checked} conceptos`);
        }

        return Promise.resolve();
    }

    public conceptoHasInvalidDiscount(concepto: CNodeInterface): boolean {
        if (!concepto.offsetExists('Descuento')) {
            return false;
        }
        const descuento = parseFloat(concepto.get('Descuento') || '0');
        const importe = parseFloat(concepto.get('Importe') || '0');

        return !(descuento >= 0 && descuento <= importe);
    }
}
