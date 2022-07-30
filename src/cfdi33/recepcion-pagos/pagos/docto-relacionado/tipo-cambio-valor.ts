import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO25: En un documento relacionado, el tipo de cambio debe tener el valor "1"
 *         cuando la moneda del documento es MXN y diferente de la moneda del pago (CRP220)
 */
export class TipoCambioValor extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO25';

    protected override title = [
        'En un documento relacionado, el tipo de cambio debe tener el valor "1"',
        ' cuando la moneda del documento es MXN y diferente de la moneda del pago (CRP220)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const pago = this.getPago();

        if (
            'MXN' === docto.get('MonedaDR') &&
            pago.get('MonedaP') !== docto.get('MonedaDR') &&
            '1' !== docto.get('TipoCambioDR')
        ) {
            throw this.exception(
                `Moneda pago: "${pago.get('MonedaP')}", Moneda documento: "${docto.get(
                    'MonedaDR'
                )}", Tipo cambio docto: "${docto.get('TipoCambioDR')}"`
            );
        }

        return true;
    }
}
