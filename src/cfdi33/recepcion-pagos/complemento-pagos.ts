import { CNode, CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Status } from '../../status';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { ComprobantePagos } from './comprobante-pagos';

/**
 * ComplementoPagos
 *
 * Este complemento se ejecuta siempre
 *
 * - COMPPAG01: El complemento de pagos debe existir si el tipo de comprobante es P y viceversa
 * - COMPPAG02: Si el complemento de pagos existe su version debe ser 1.0
 * - COMPPAG03: Si el tipo de comprobante es P su versión debe ser 3.3
 * - COMPPAG04: No debe existir el nodo impuestos del complemento de pagos (CRP237)
 */
export class ComplementoPagos extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        asserts.put('COMPPAG01', 'El complemento de pagos debe existir si el tipo de comprobante es P y viceversa');
        asserts.put('COMPPAG02', 'Si el complemento de pagos existe su version debe ser 1.0');
        asserts.put('COMPPAG03', 'Si el tipo de comprobante es P su versión debe ser 3.3');
        asserts.put('COMPPAG04', 'No debe existir el nodo impuestos del complemento de pagos (CRP237)');

        let pagosExists = true;
        let pagos10 = comprobante.searchNode('cfdi:Complemento', 'pago10:Pagos');
        if (!pagos10) {
            pagosExists = false;
            pagos10 = new CNode('pago10:Pagos'); // avoid accessing a null object
        }

        const isTipoPago = 'P' === comprobante.get('TipoDeComprobante');

        asserts.putStatus(
            'COMPPAG01',
            Status.when(!(isTipoPago ? !pagosExists : pagosExists)),
            `Tipo de comprobante: "${comprobante.get('TipoDeComprobante')}", Complemento: "${
                pagosExists ? 'existe' : 'no existe'
            }"`
        );

        if (pagosExists) {
            asserts.putStatus('COMPPAG02', Status.when('1.0' === pagos10.get('Version')));
        }
        if (isTipoPago) {
            asserts.putStatus('COMPPAG03', Status.when('3.3' === comprobante.get('Version')));
        }

        asserts.putStatus('COMPPAG04', Status.when(!pagos10.searchNode('pago10:Impuestos')));

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobantePagos();
    }
}
