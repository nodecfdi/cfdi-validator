import { AbstractPagoValidator } from './abstract-pago-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

/**
 * PAGO20: En un pago, si existe el tipo de cadena de pago debe existir
 *         el certificado del pago y viceversa (CRP227 y CRP228)
 */
export class TipoCadenaPagoCertificado extends AbstractPagoValidator {
    protected code = 'PAGO20';

    protected title = [
        'En un pago, si existe el tipo de cadena de pago debe existir',
        ' el certificado del pago y viceversa (CRP227 y CRP228)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const notEmpty =
            '' !== pago.attributes().get('TipoCadPago')
                ? !('' !== pago.attributes().get('CertPago'))
                : '' !== pago.attributes().get('CertPago');
        if (
            notEmpty ||
            (pago.attributes().has('TipoCadPago')
                ? !pago.attributes().has('CertPago')
                : pago.attributes().has('CertPago'))
        ) {
            throw new ValidatePagoException(
                `Tipo cadena pago: "${pago.attributes().get('TipoCadPago')}", Certificado: "${pago
                    .attributes()
                    .get('CertPago')}"`
            );
        }

        return true;
    }
}
