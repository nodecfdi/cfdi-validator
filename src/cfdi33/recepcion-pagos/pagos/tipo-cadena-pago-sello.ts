import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO22: En un pago, si existe el tipo de cadena de pago debe existir
 *         el sello del pago  y viceversa (CRP231 y CRP232)
 */
export class TipoCadenaPagoSello extends AbstractPagoValidator {
    protected override code = 'PAGO22';

    protected override title = [
        'En un pago, si existe el tipo de cadena de pago debe existir',
        ' el sello del pago  y viceversa (CRP231 y CRP232)'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const notEmpty = '' !== pago.get('TipoCadPago') ? '' === pago.get('SelloPago') : '' !== pago.get('SelloPago');
        if (
            notEmpty ||
            (pago.offsetExists('TipoCadPago') ? !pago.offsetExists('SelloPago') : pago.offsetExists('SelloPago'))
        ) {
            throw new ValidatePagoException(
                `Tipo cadena pago: "${pago.get('TipoCadPago')}", Sello: "${pago.get('SelloPago')}"`
            );
        }

        return true;
    }
}
