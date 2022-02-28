import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO23: En un documento relacionado, la moneda no puede ser "XXX" (CRP217)
 */
export class Moneda extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO23';

    protected title = 'En un documento relacionado, la moneda no puede ser "XXX" (CRP217)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if ('XXX' === docto.attributes().get('MonedaDR')) {
            throw this.exception(`MonedaDR: "${docto.attributes().get('MonedaDR')}"`);
        }

        return true;
    }
}
