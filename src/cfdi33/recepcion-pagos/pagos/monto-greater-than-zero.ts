import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO07: En un pago, el monto debe ser mayor a cero (CRP207)
 */
export class MontoGreaterThanZero extends AbstractPagoValidator {
    protected override code = 'PAGO07';

    protected override title = 'En un pago, el monto debe ser mayor a cero (CRP207)';

    public validatePago(pago: CNodeInterface): boolean {
        if (!this.isGreaterThan(parseFloat(pago.get('Monto') || '0'), 0)) {
            throw new ValidatePagoException(`Monto: "${pago.get('Monto')}"`);
        }

        return true;
    }
}
