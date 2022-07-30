import { CNodeInterface, CurrencyDecimals } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO06: En un pago, el tipo de cambio debe ser numérico, no debe exceder 6 decimales y debe ser mayor a "0.000001"
 */
export class TipoCambioValue extends AbstractPagoValidator {
    protected override code = 'PAGO06';

    protected override title = [
        'En un pago, el tipo de cambio debe ser numérico,',
        ' no debe exceder 6 decimales y debe ser mayor a "0.000001"'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (!pago.offsetExists('TipoCambioP')) {
            return true;
        }
        let reason = '';
        if (isNaN(Number(pago.get('TipoCambioP')))) {
            reason = 'No es numérico';
        } else if (CurrencyDecimals.decimalsCount(pago.get('TipoCambioP')) > 6) {
            reason = 'Tiene más de 6 decimales';
        } else if (!this.isGreaterThan(parseFloat(pago.get('TipoCambioP') || '0'), 0.000001)) {
            reason = 'No es mayor a "0.000001"';
        }
        if ('' !== reason) {
            throw new ValidatePagoException(`TipoCambioP: ${pago.get('TipoCambioP')}, ${reason}`);
        }

        return true;
    }
}
