import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO17: En un pago, cuando la forma de pago no sea 02, 03, 04, 05, 28, 29 o 99
 *         la cuenta beneficiaria no debe existir (CRP215)
 */
export class CuentaBeneficiariaProhibida extends AbstractPagoValidator {
    protected code = 'PAGO17';

    protected title = [
        'En un pago, cuando la forma de pago no sea 02, 03, 04, 05, 28, 29 o 99',
        ' la cuenta beneficiaria no debe existir (CRP215)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const payment = this.createPaymentType(pago.attributes().get('FormaDePagoP') || '');

        // si No es bancarizado y está establecida la cuenta beneficiaria
        if (!payment.allowReceiverAccount() && pago.attributes().has('CtaBeneficiario')) {
            throw new ValidatePagoException(
                `Forma de pago: "${pago.attributes().get('FormaDePagoP')}", Cuenta: "${pago
                    .attributes()
                    .get('CtaBeneficiario')}"`
            );
        }
        return true;
    }
}
