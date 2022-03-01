import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * UsoCfdi
 *
 * - PAGUSO01: El uso del CFDI debe ser "P01" (CRP110)
 */
export class UsoCfdi extends AbstractRecepcionPagos10 {
    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('PAGUSO01', 'El uso del CFDI debe ser "P01" (CRP110)');

        const receptor = comprobante.searchNode('cfdi:Receptor');
        if (!receptor) {
            assert.setStatus(Status.error(), 'No se encontró el nodo Receptor');
            return Promise.resolve();
        }
        assert.setStatus(
            Status.when('P01' === receptor.attributes().get('UsoCFDI')),
            `Uso CFDI: "${receptor.attributes().get('UsoCFDI')}"`
        );
        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new UsoCfdi();
    }
}
