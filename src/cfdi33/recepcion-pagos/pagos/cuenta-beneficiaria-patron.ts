import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO18: En un pago, cuando la cuenta beneficiaria existe debe cumplir con su patrón específico (CRP239)
 */
export class CuentaBeneficiariaPatron extends AbstractPagoValidator {
    protected override code = 'PAGO18';

    protected override title = [
        'En un pago, cuando la cuenta beneficiaria existe',
        ' debe cumplir con su patrón específico (CRP213)'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        // solo validar si está establecida la cuenta ordenante
        if (pago.offsetExists('CtaBeneficiario')) {
            const payment = this.createPaymentType(pago.get('FormaDePagoP'));
            const pattern = payment.receiverAccountPattern();
            if (!pago.get('CtaBeneficiario').match(pattern)) {
                throw new ValidatePagoException(`Cuenta: "${pago.get('CtaOrdenante')}". Patrón: "${pattern}"`);
            }
        }

        return true;
    }
}
