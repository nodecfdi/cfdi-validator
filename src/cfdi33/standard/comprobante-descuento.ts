import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Status } from '../../status';

/**
 * ComprobanteDescuento
 *
 * Válida que:
 * - DESCUENTO01: Si existe el atributo descuento, entonces debe ser menor o igual que el subtotal
 *                 y mayor o igual que cero (CFDI33109)
 */
export class ComprobanteDescuento extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        asserts.put(
            'DESCUENTO01',
            [
                'Si existe el atributo descuento,',
                ' entonces debe ser menor o igual que el subtotal y mayor o igual que cero (CFDI33109)',
            ].join('')
        );
        if (comprobante.attributes().has('Descuento')) {
            const descuento = parseFloat(comprobante.attributes().get('Descuento') || '0');
            const subtotal = parseFloat(comprobante.attributes().get('SubTotal') || '0');
            asserts.putStatus(
                'DESCUENTO01',
                Status.when(
                    '' !== comprobante.attributes().get('Descuento') && descuento >= 0 && descuento <= subtotal
                ),
                `Descuento: "${comprobante.attributes().get('Descuento')}", SubTotal: "${comprobante
                    .attributes()
                    .get('SubTotal')}"`
            );
        }
        return Promise.resolve(undefined);
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobanteDescuento();
    }
}