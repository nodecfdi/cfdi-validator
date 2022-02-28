import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Rfc } from '@nodecfdi/rfc';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO11: En un pago, cuando el RFC del banco emisor sea "XEXX010101000" el nombre del banco es requerido (CRP211)
 */
export class BancoOrdenanteNombreRequerido extends AbstractPagoValidator {
    protected code = 'PAGO11';

    protected title = [
        'En un pago, cuando el RFC del banco emisor sea "XEXX010101000"',
        ' el nombre del banco es requerido (CRP211)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        if (
            Rfc.RFC_FOREIGN === pago.attributes().get('RfcEmisorCtaOrd') &&
            '' === pago.attributes().get('NomBancoOrdExt')
        ) {
            throw new ValidatePagoException(
                `Rfc: "${pago.attributes().get('RfcEmisorCtaOrd')}", Nombre "${pago
                    .attributes()
                    .get('NomBancoOrdExt')}"`
            );
        }
        return true;
    }
}
