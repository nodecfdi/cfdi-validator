import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO25: En un documento relacionado, el tipo de cambio debe tener el valor "1"
 *         cuando la moneda del documento es MXN y diferente de la moneda del pago (CRP220)
 */
export class TipoCambioValor extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO25';

    protected title = [
        'En un documento relacionado, el tipo de cambio debe tener el valor "1"',
        ' cuando la moneda del documento es MXN y diferente de la moneda del pago (CRP220)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const pago = this.getPago();

        if (
            'MXN' === docto.attributes().get('MonedaDR') &&
            pago.attributes().get('MonedaP') !== docto.attributes().get('MonedaDR') &&
            '1' !== docto.attributes().get('TipoCambioDR')
        ) {
            throw this.exception(
                `Moneda pago: "${pago.attributes().get('MonedaP')}", Moneda documento: "${docto
                    .attributes()
                    .get('MonedaDR')}", Tipo cambio docto: "${docto.attributes().get('TipoCambioDR')}"`
            );
        }
        return true;
    }
}
