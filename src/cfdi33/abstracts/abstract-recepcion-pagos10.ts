import { AbstractVersion33 } from './abstract-version33';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';

export abstract class AbstractRecepcionPagos10 extends AbstractVersion33 {
    public abstract validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void>;

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        // do not run anything if not found
        const pagos10 = comprobante.searchNode('cfdi:Complemento', 'pago10:Pagos');
        if (
            '3.3' !== comprobante.attributes().get('Version') ||
            'P' !== comprobante.attributes().get('TipoDeComprobante') ||
            !pagos10 ||
            '1.0' !== pagos10.attributes().get('Version')
        ) {
            return Promise.resolve();
        }
        return this.validateRecepcionPagos(comprobante, asserts);
    }
}
