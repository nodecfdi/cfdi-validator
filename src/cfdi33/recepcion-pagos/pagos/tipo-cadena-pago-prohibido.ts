import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO19: En un pago, cuando la forma de pago no sea 03 o 99 el tipo de cadena de pago no debe existir (CRP216)
 */
export class TipoCadenaPagoProhibido extends AbstractPagoValidator {
    protected code = 'PAGO19';

    protected title = [
        'En un pago, cuando la forma de pago no sea 03 o 99',
        ' el tipo de cadena de pago no debe existir (CRP216)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const payment = this.createPaymentType(pago.get('FormaDePagoP'));

        // si NO es bancarizado y está establecida la cuenta ordenante existe
        if (!payment.allowPaymentSignature() && pago.offsetExists('TipoCadPago')) {
            throw new ValidatePagoException(
                `Forma de pago: "${pago.get('FormaDePagoP')}", Tipo cadena pago: "${pago.get('TipoCadPago')}"`
            );
        }

        return true;
    }
}
