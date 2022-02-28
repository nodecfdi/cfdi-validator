import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO07: En un pago, el monto debe ser mayor a cero (CRP207)
 */
export class MontoGreaterThanZero extends AbstractPagoValidator {
    protected code = 'PAGO07';

    protected title = 'En un pago, el monto debe ser mayor a cero (CRP207)';

    public validatePago(pago: CNodeInterface): boolean {
        if (!this.isGreaterThan(parseFloat(pago.attributes().get('Monto') || '0'), 0)) {
            throw new ValidatePagoException(`Monto: "${pago.attributes().get('Monto')}"`);
        }

        return true;
    }
}
