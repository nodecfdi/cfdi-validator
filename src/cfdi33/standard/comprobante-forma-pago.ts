import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ComprobanteFormaPago
 *
 * Válida que:
 * - FORMAPAGO01: El campo forma de pago no debe existir cuando existe el complemento para recepción de pagos
 *                (CFDI33103)
 */
export class ComprobanteFormaPago extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put(
            'FORMAPAGO01',
            'El campo forma de pago no debe existir cuando existe el complemento para recepción de pagos (CFDI33103)',
            Status.none()
        );

        const existsComplementoPagos = undefined !== comprobante.searchNode('cfdi:Complemento', 'pago10:Pagos');
        if (existsComplementoPagos) {
            const existsFormaPago = comprobante.offsetExists('FormaPago');
            assert.setStatus(Status.when(!existsFormaPago));
        }

        return Promise.resolve();
    }
}
