import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { Asserts } from '../../asserts';
import { Status } from '../../status';
import { ValidatorInterface } from '../../contracts/validator-interface';

/**
 * Pagos - Válida el contenido del nodo del complemento de pago
 *
 * - PAGOS01: Debe existir al menos un pago en el complemento de pagos
 */
export class Pagos extends AbstractRecepcionPagos10 {
    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('PAGOS01', 'Debe existir al menos un pago en el complemento de pagos');

        const pagoCollection = comprobante.searchNodes('cfdi:Complemento', 'pago10:Pagos', 'pago10:Pago');
        assert.setStatus(
            Status.when(pagoCollection.length > 0),
            'Debe existir al menos un pago en el complemento de pagos'
        );

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new Pagos();
    }
}
