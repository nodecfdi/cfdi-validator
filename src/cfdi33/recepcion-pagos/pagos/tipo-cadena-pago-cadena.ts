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
        const notEmpty = '' !== pago.get('TipoCadPago') ? !('' !== pago.get('CadPago')) : '' !== pago.get('CadPago');
        if (
            notEmpty ||
            (pago.offsetExists('TipoCadPago') ? !pago.offsetExists('CadPago') : pago.offsetExists('CadPago'))
        ) {
            throw new ValidatePagoException(
                `Tipo cadena pago: "${pago.get('TipoCadPago')}", Cadena: "${pago.get('CadPago')}"`
            );
        }

        return true;
    }
}
