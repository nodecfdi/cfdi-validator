import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO24: En un documento relacionado, el tipo de cambio debe existir cuando la moneda del pago
 *         es diferente a la moneda del documento y viceversa (CRP218, CRP219)
 */
export class TipoCambioRequerido extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO24';

    protected title = [
        'En un documento relacionado, el tipo de cambio debe existir cuando la moneda del pago',
        ' es diferente a la moneda del documento y viceversa (CRP218, CRP219)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const pago = this.getPago();
        const currencyIsEqual = pago.attributes().get('MonedaP') === docto.attributes().get('MonedaDR');
        if (!(currencyIsEqual ? !docto.attributes().has('TipoCambioDR') : docto.attributes().has('TipoCambioDR'))) {
            throw this.exception(
                `Moneda pago: "${pago.attributes().get('MonedaP')}", Moneda documento: "${docto
                    .attributes()
                    .get('MonedaDR')}", Tipo cambio docto: "${docto.attributes().get('TipoCambioDR')}"`
            );
        }
        return true;
    }
}
