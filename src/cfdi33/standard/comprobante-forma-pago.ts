import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { ValidatorInterface } from '../../contracts/validator-interface';
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
            const existsFormaPago = comprobante.attributes().has('FormaPago');
            assert.setStatus(Status.when(!existsFormaPago));
        }
        return Promise.resolve(undefined);
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobanteFormaPago();
    }
}
