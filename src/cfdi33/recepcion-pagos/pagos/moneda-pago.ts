import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO04: En un pago, la moneda debe existir y no puede ser "XXX" (CRP202)
 */
export class MonedaPago extends AbstractPagoValidator {
    protected code = 'PAGO04';

    protected title = 'En un pago, la moneda debe existir y no puede ser "XXX" (CRP202)';

    public validatePago(pago: CNodeInterface): boolean {
        if ('' === pago.attributes().get('MonedaP') || 'XXX' === pago.attributes().get('MonedaP')) {
            throw new ValidatePagoException(`Moneda: "${pago.attributes().get('MonedaP')}"`);
        }

        return true;
    }
}
