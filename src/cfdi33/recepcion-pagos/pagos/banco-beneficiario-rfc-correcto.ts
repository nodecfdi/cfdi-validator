import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';
import { Rfc } from '@nodecfdi/rfc';

/**
 * PAGO15: En un pago, cuando el RFC del banco emisor de la cuenta beneficiaria existe
 *         debe ser válido y diferente de "XAXX010101000"
 */
export class BancoBeneficiarioRfcCorrecto extends AbstractPagoValidator {
    protected code = 'PAGO15';

    protected title = [
        'En un pago, cuando el RFC del banco emisor de la cuenta beneficiaria existe',
        ' debe ser válido y diferente de "XAXX010101000"',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (pago.attributes().has('RfcEmisorCtaBen')) {
            try {
                Rfc.checkIsValid(pago.attributes().get('RfcEmisorCtaBen') || '', Rfc.DISALLOW_GENERIC);
            } catch (e) {
                throw new ValidatePagoException((e as Error).message);
            }
        }
        return true;
    }
}
