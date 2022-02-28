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
        if ('' === pago.attributes().get('FormaDePagoP')) {
            throw new ValidatePagoException('No está establecida la forma de pago');
        }
        const payment = this.createPaymentType(pago.attributes().get('FormaDePagoP') || '');

        // si NO es bancarizado y está establecido el RFC del Emisor de la cuenta ordenante
        if (!payment.allowSenderRfc() && pago.attributes().has('RfcEmisorCtaOrd')) {
            throw new ValidatePagoException(`Bancarizado: Si, Rfc: "${pago.attributes().get('RfcEmisorCtaOrd')}"`);
        }

        return true;
    }
}
