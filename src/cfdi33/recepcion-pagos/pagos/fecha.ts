import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';
import { AssertFechaFormat } from '../../utils/assert-fecha-format';

/**
 * PAGO02: En un pago, la fecha debe cumplir con el formato específico
 */
export class Fecha extends AbstractPagoValidator {
    protected override code = 'PAGO02';

    protected override title = 'En un pago la fecha debe cumplir con el formato específico';

    public validatePago(pago: CNodeInterface): boolean {
        if (!AssertFechaFormat.hasFormat(pago.get('FechaPago'))) {
            throw new ValidatePagoException(`FechaPago: "${pago.get('FechaPago')}"`);
        }

        return true;
    }
}
