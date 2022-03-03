import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO12: En un pago, cuando la forma de pago no sea bancarizada el RFC del banco emisor no debe existir (CRP238)
 */
export class BancoOrdenanteRfcProhibido extends AbstractPagoValidator {
    protected code = 'PAGO12';

    protected title = [
        'En un pago, cuando la forma de pago no sea bancarizada',
        ' el RFC del banco emisor no debe existir (CRP238)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if ('' === pago.get('FormaDePagoP')) {
            throw new ValidatePagoException('No está establecida la forma de pago');
        }
        const payment = this.createPaymentType(pago.get('FormaDePagoP'));

        // si NO es bancarizado y está establecido el RFC del Emisor de la cuenta ordenante
        if (!payment.allowSenderRfc() && pago.offsetExists('RfcEmisorCtaOrd')) {
            throw new ValidatePagoException(`Bancarizado: Si, Rfc: "${pago.get('RfcEmisorCtaOrd')}"`);
        }

        return true;
    }
}
