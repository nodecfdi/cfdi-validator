import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO05: En un pago, cuando la moneda no es "MXN" no debe existir tipo de cambio,
 *         de lo contrario el tipo de cambio debe existir (CRP203, CRP204)
 */
export class TipoCambioExists extends AbstractPagoValidator {
    protected code = 'PAGO05';

    protected title = [
        'En un pago, cuando la moneda no es "MXN" no debe existir tipo de cambio,',
        ' de lo contrario el tipo de cambio debe existir (CRP203, CRP204)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (
            !('MXN' === pago.attributes().get('MonedaP')
                ? !('' !== pago.attributes().get('TipoCambioP'))
                : '' !== pago.attributes().get('TipoCambioP'))
        ) {
            throw new ValidatePagoException(
                `Moneda "${pago.attributes().get('MonedaP')}", Tipo de cambio: "${pago
                    .attributes()
                    .get('TipoCambioP')}"`
            );
        }

        return true;
    }
}
