import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * CfdiRelacionados
 *
 * - PAGREL01: El tipo de relación en los CFDI relacionados debe ser "04"
 */
export class CfdiRelacionados extends AbstractRecepcionPagos10 {
    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('PAGREL01', 'El tipo de relación en los CFDI relacionados debe ser "04"');
        const cfdiRelacionados = comprobante.searchNode('cfdi:CfdiRelacionados');
        if (!cfdiRelacionados) {
            return Promise.resolve();
        }
        assert.setStatus(
            Status.when('04' === cfdiRelacionados.get('TipoRelacion')),
            `Tipo de relación: "${cfdiRelacionados.get('TipoRelacion')}"`
        );

        return Promise.resolve();
    }
}
