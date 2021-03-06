import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Rfc } from '@nodecfdi/rfc';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO10: En un pago, cuando el RFC del banco emisor de la cuenta ordenante existe
 *         debe ser válido y diferente de "XAXX010101000"
 */
export class BancoOrdenanteRfcCorrecto extends AbstractPagoValidator {
    protected override code = 'PAGO10';

    protected override title = [
        'En en pago, cuando el RFC del banco emisor de la cuenta ordenante existe',
        ' debe ser válido y diferente de "XAXX010101000"'
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (pago.offsetExists('RfcEmisorCtaOrd')) {
            try {
                Rfc.checkIsValid(pago.get('RfcEmisorCtaOrd'), Rfc.DISALLOW_GENERIC);
            } catch (e) {
                throw new ValidatePagoException((e as Error).message);
            }
        }

        return true;
    }
}
