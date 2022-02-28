import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO21: En un pago, si existe el tipo de cadena de pago debe existir
 *         la cadena del pago y viceversa (CRP229 y CRP230)
 */
export class TipoCadenaPagoCadena extends AbstractPagoValidator {
    protected code = 'PAGO21';

    protected title = [
        'En un pago, si existe el tipo de cadena de pago debe existir',
        ' la cadena del pago y viceversa (CRP229 y CRP230)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const notEmpty =
            '' !== pago.attributes().get('TipoCadPago')
                ? !('' !== pago.attributes().get('CadPago'))
                : '' !== pago.attributes().get('CadPago');
        if (
            notEmpty ||
            (pago.attributes().has('TipoCadPago')
                ? !pago.attributes().has('CadPago')
                : pago.attributes().has('CadPago'))
        ) {
            throw new ValidatePagoException(
                `Tipo cadena pago: "${pago.attributes().get('TipoCadPago')}", Cadena: "${pago
                    .attributes()
                    .get('CadPago')}"`
            );
        }

        return true;
    }
}
