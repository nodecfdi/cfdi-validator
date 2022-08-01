import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO13: En un pago, cuando la forma de pago no sea bancarizada la cuenta ordenante no debe existir (CRP212)
 */
export class CuentaOrdenanteProhibida extends AbstractPagoValidator {
    protected override code = 'PAGO13';

    protected override title = [
        'En un pago, cuando la forma de pago no sea bancarizada',
        ' la cuenta ordenante no debe existir (CRP212)'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const payment = this.createPaymentType(pago.get('FormaDePagoP'));

        // si NO es bancarizado y está establecida la cuenta ordenante existe
        if (!payment.allowSenderAccount() && pago.offsetExists('CtaOrdenante')) {
            throw new ValidatePagoException(`Bancarizado: Si, Cuenta: "${pago.get('CtaOrdenante')}"`);
        }

        return true;
    }
}
