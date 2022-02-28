import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Rfc } from '@nodecfdi/rfc';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO10: En un pago, cuando el RFC del banco emisor de la cuenta ordenante existe
 *         debe ser válido y diferente de "XAXX010101000"
 */
export class BancoOrdenanteRfcCorrecto extends AbstractPagoValidator {
    protected code = 'PAGO10';

    protected title = [
        'En en pago, cuando el RFC del banco emisor de la cuenta ordenante existe',
        ' debe ser válido y diferente de "XAXX010101000"',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (pago.attributes().has('RfcEmisorCtaOrd')) {
            try {
                Rfc.checkIsValid(pago.attributes().get('RfcEmisorCtaOrd') || '', Rfc.DISALLOW_GENERIC);
            } catch (e) {
                throw new ValidatePagoException((e as Error).message);
            }
        }
        return true;
    }
}
