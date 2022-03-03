import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO16: En un pago, cuando la forma de pago no sea 02, 03, 04, 05, 28, 29 o 99
 *         el RFC del banco de la cuenta beneficiaria no debe existir (CRP214)
 */
export class BancoBeneficiarioRfcProhibido extends AbstractPagoValidator {
    protected code = 'PAGO16';

    protected title = [
        'En un pago, cuando la forma de pago no sea 02, 03, 04, 05, 28, 29 o 99',
        ' el RFC del banco de la cuenta beneficiaria no debe existir (CRP214)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const payment = this.createPaymentType(pago.get('FormaDePagoP'));

        if (!payment.allowReceiverRfc() && pago.offsetExists('RfcEmisorCtaBen')) {
            throw new ValidatePagoException(
                `FormaDePago: "${pago.get('FormaDePagoP')}", Rfc: "${pago.get('RfcEmisorCtaBen')}"`
            );
        }

        return true;
    }
}
