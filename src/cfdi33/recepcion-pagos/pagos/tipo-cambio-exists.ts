import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO05: En un pago, cuando la moneda no es "MXN" no debe existir tipo de cambio,
 *         de lo contrario el tipo de cambio debe existir (CRP203, CRP204)
 */
export class TipoCambioExists extends AbstractPagoValidator {
    protected override code = 'PAGO05';

    protected override title = [
        'En un pago, cuando la moneda no es "MXN" no debe existir tipo de cambio,',
        ' de lo contrario el tipo de cambio debe existir (CRP203, CRP204)'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (!('MXN' === pago.get('MonedaP') ? '' === pago.get('TipoCambioP') : '' !== pago.get('TipoCambioP'))) {
            throw new ValidatePagoException(
                `Moneda "${pago.get('MonedaP')}", Tipo de cambio: "${pago.get('TipoCambioP')}"`
            );
        }

        return true;
    }
}
