import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ComprobanteTotal
 *
 * Válida que:
 * - TOTAL01: El atributo Total existe, no está vacío y cumple con el patrón [0-9]+(.[0-9]+)?
 */
export class ComprobanteTotal extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const pattern = /^\d+(\.\d+)?$/;
        asserts.put(
            'TOTAL01',
            'El atributo Total existe, no está vacío y cumple con el patrón [0-9]+(.[0-9]+)?',
            Status.when('' !== comprobante.get('Total') && !!comprobante.get('Total').match(pattern))
        );

        return Promise.resolve();
    }
}
