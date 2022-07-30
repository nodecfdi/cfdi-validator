import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO08: En un pago, el monto debe tener hasta la cantidad de decimales que soporte la moneda (CRP208)
 */
export class MontoDecimals extends AbstractPagoValidator {
    protected override code = 'PAGO08';

    protected override title =
        'En un pago, el monto debe tener hasta la cantidad de decimales que soporte la moneda (CRP208)';

    public validatePago(pago: CNodeInterface): boolean {
        const currency = this.createCurrencyDecimals(pago.get('MonedaP'));
        if (!currency.doesNotExceedDecimals(pago.get('Monto'))) {
            throw new ValidatePagoException(`Monto: "${pago.get('Monto')}", MaxDecimals: "${currency.decimals()}"`);
        }

        return true;
    }
}
