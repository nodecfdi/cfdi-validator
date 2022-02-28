import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO18: En un pago, cuando la cuenta beneficiaria existe debe cumplir con su patrón específico (CRP239)
 */
export class CuentaBeneficiariaPatron extends AbstractPagoValidator {
    protected code = 'PAGO18';

    protected title = [
        'En un pago, cuando la cuenta beneficiaria existe',
        ' debe cumplir con su patrón específico (CRP213)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        // solo validar si está establecida la cuenta ordenante
        if (pago.attributes().has('CtaBeneficiario')) {
            const payment = this.createPaymentType(pago.attributes().get('FormaDePagoP') || '');
            const pattern = payment.receiverAccountPattern();
            if (!pago.attributes().get('CtaBeneficiario')?.match(pattern)) {
                throw new ValidatePagoException(
                    `Cuenta: "${pago.attributes().get('CtaOrdenante')}". Patrón: "${pattern}"`
                );
            }
        }
        return true;
    }
}
