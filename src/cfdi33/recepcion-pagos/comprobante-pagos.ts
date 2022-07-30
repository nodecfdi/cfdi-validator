import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ComprobantePagos - Válida los datos relacionados con el nodo Comprobante cuando es un CFDI de recepción de pagos
 *
 * - PAGCOMP01: Debe existir un solo nodo que represente el complemento de pagos
 * - PAGCOMP02: La forma de pago no debe existir (CRP104)
 * - PAGCOMP03: Las condiciones de pago no deben existir (CRP106)
 * - PAGCOMP04: El método de pago no deben existir (CRP105)
 * - PAGCOMP05: La moneda debe ser "XXX" (CRP103)
 * - PAGCOMP06: El tipo de cambio no debe existir (CRP108)
 * - PAGCOMP07: El descuento no debe existir (CRP107)
 * - PAGCOMP08: El subtotal del documento debe ser cero "0" (CRP102)
 * - PAGCOMP09: El total del documento debe ser cero "0" (CRP109)
 * - PAGCOMP10: No se debe registrar el apartado de Impuestos en el CFDI (CRP122)
 */
export class ComprobantePagos extends AbstractRecepcionPagos10 {
    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const pagos = comprobante.searchNodes('cfdi:Complemento', 'pago10:Pagos');
        asserts.put(
            'PAGCOMP01',
            'Debe existir un solo nodo que represente el complemento de pagos',
            Status.when(1 === pagos.length),
            `Encontrados: ${pagos.length}`
        );
        asserts.put(
            'PAGCOMP02',
            'La forma de pago no debe existir (CRP104)',
            Status.when(!comprobante.offsetExists('FormaPago'))
        );
        asserts.put(
            'PAGCOMP03',
            'Las condiciones de pago no deben existir (CRP106)',
            Status.when(!comprobante.offsetExists('CondicionesDePago'))
        );
        asserts.put(
            'PAGCOMP04',
            'El método de pago no debe existir (CRP105)',
            Status.when(!comprobante.offsetExists('MetodoPago'))
        );
        asserts.put(
            'PAGCOMP05',
            'La moneda debe ser "XXX" (CRP103)',
            Status.when('XXX' === comprobante.get('Moneda')),
            `Moneda: "${comprobante.get('Moneda')}"`
        );
        asserts.put(
            'PAGCOMP06',
            'El tipo de cambio no debe existir (CRP108)',
            Status.when(!comprobante.offsetExists('TipoCambio'))
        );
        asserts.put(
            'PAGCOMP07',
            'El descuento no debe existir (CRP107)',
            Status.when(!comprobante.offsetExists('Descuento'))
        );
        asserts.put(
            'PAGCOMP08',
            'El subtotal del documento debe ser cero "0" (CRP102)',
            Status.when('0' === comprobante.get('SubTotal')),
            `SubTotal: "${comprobante.get('SubTotal')}"`
        );
        asserts.put(
            'PAGCOMP09',
            'El total del documento debe ser cero "0" (CRP109)',
            Status.when('0' === comprobante.get('Total')),
            `Total: "${comprobante.get('Total')}"`
        );
        asserts.put(
            'PAGCOMP10',
            'No se debe registrar el apartado de Impuesto en el CFDI (CRP122)',
            Status.when(0 === comprobante.searchNodes('cfdi:Impuestos').length)
        );

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobantePagos();
    }
}
