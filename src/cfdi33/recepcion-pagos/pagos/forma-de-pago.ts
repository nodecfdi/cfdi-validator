import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO03: En un pago, la forma de pago debe existir y no puede ser "99" (CRP201)
 */
export class FormaDePago extends AbstractPagoValidator {
    protected override code = 'PAGO03';

    protected override title = 'En un pago, la forma de pago debe existir y no puede ser "99" (CRP201)';

    public validatePago(pago: CNodeInterface): boolean {
        try {
            const paymentType = this.createPaymentType(pago.get('FormaDePagoP'));
            if ('99' === paymentType.key()) {
                throw new ValidatePagoException('Cannot be 99');
            }
        } catch (e) {
            throw new ValidatePagoException(
                `FormaDePagoP: "${pago.get('FormaDePagoP')}" ${(e as ValidatePagoException).message}`
            );
        }

        return true;
    }
}
