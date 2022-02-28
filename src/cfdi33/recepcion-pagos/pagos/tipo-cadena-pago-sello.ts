import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO22: En un pago, si existe el tipo de cadena de pago debe existir
 *         el sello del pago  y viceversa (CRP231 y CRP232)
 */
export class TipoCadenaPagoSello extends AbstractPagoValidator {
    protected code = 'PAGO22';

    protected title = [
        'En un pago, si existe el tipo de cadena de pago debe existir',
        ' el sello del pago  y viceversa (CRP231 y CRP232)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const notEmpty =
            '' !== pago.attributes().get('TipoCadPago')
                ? !('' !== pago.attributes().get('SelloPago'))
                : '' !== pago.attributes().get('SelloPago');
        if (
            notEmpty ||
            (pago.attributes().has('TipoCadPago')
                ? !pago.attributes().has('SelloPago')
                : pago.attributes().has('SelloPago'))
        ) {
            throw new ValidatePagoException(
                `Tipo cadena pago: "${pago.attributes().get('TipoCadPago')}", Sello: "${pago
                    .attributes()
                    .get('SelloPago')}"`
            );
        }

        return true;
    }
}
