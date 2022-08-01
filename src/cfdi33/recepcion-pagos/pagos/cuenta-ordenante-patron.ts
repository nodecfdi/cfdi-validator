import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO14: En un pago, cuando la cuenta ordenante existe debe cumplir con su patrón específico (CRP213)
 */
export class CuentaOrdenantePatron extends AbstractPagoValidator {
    protected override code = 'PAGO14';

    protected override title =
        'En un pago, cuando la cuenta ordenante existe debe cumplir con su patrón específico (CRP213)';

    public validatePago(pago: CNodeInterface): boolean {
        // Solo validar si está establecida la cuenta ordenante
        if (pago.offsetExists('CtaOrdenante')) {
            const payment = this.createPaymentType(pago.get('FormaDePagoP'));
            const pattern = payment.senderAccountPattern();
            if (!pago.get('CtaOrdenante').match(pattern)) {
                throw new ValidatePagoException(`Cuenta: "${pago.get('CtaOrdenante')}". Patrón "${pattern}"`);
            }
        }

        return true;
    }
}
