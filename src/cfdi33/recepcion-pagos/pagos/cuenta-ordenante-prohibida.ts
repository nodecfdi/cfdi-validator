import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO13: En un pago, cuando la forma de pago no sea bancarizada la cuenta ordenante no debe existir (CRP212)
 */
export class CuentaOrdenanteProhibida extends AbstractPagoValidator {
    protected code = 'PAGO13';

    protected title = [
        'En un pago, cuando la forma de pago no sea bancarizada',
        ' la cuenta ordenante no debe existir (CRP212)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const payment = this.createPaymentType(pago.attributes().get('FormaDePagoP') || '');

        // si NO es bancarizado y está establecida la cuenta ordenante existe
        if (!payment.allowSenderAccount() && pago.attributes().has('CtaOrdenante')) {
            throw new ValidatePagoException(`Bancarizado: Si, Cuenta: "${pago.attributes().get('CtaOrdenante')}"`);
        }
        return true;
    }
}
