import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO14: En un pago, cuando la cuenta ordenante existe debe cumplir con su patrón específico (CRP213)
 */
export class CuentaOrdenantePatron extends AbstractPagoValidator {
    protected code = 'PAGO14';

    protected title = 'En un pago, cuando la cuenta ordenante existe debe cumplir con su patrón específico (CRP213)';

    public validatePago(pago: CNodeInterface): boolean {
        // Solo validar si está establecida la cuenta ordenante
        if (pago.attributes().has('CtaOrdenante')) {
            const payment = this.createPaymentType(pago.attributes().get('FormaDePagoP') || '');
            const pattern = payment.senderAccountPattern();
            if (!pago.attributes().get('CtaOrdenante')?.match(pattern)) {
                throw new ValidatePagoException(
                    `Cuenta: "${pago.attributes().get('CtaOrdenante')}". Patrón "${pattern}"`
                );
            }
        }
        return true;
    }
}
