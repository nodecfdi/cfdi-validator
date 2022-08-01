import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Rfc } from '@nodecfdi/rfc';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO15: En un pago, cuando el RFC del banco emisor de la cuenta beneficiaria existe
 *         debe ser válido y diferente de "XAXX010101000"
 */
export class BancoBeneficiarioRfcCorrecto extends AbstractPagoValidator {
    protected override code = 'PAGO15';

    protected override title = [
        'En un pago, cuando el RFC del banco emisor de la cuenta beneficiaria existe',
        ' debe ser válido y diferente de "XAXX010101000"'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (pago.offsetExists('RfcEmisorCtaBen')) {
            try {
                Rfc.checkIsValid(pago.get('RfcEmisorCtaBen'), Rfc.DISALLOW_GENERIC);
            } catch (e) {
                throw new ValidatePagoException((e as Error).message);
            }
        }

        return true;
    }
}
