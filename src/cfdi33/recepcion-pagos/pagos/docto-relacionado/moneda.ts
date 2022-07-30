import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO23: En un documento relacionado, la moneda no puede ser "XXX" (CRP217)
 */
export class Moneda extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO23';

    protected override title = 'En un documento relacionado, la moneda no puede ser "XXX" (CRP217)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if ('XXX' === docto.get('MonedaDR')) {
            throw this.exception(`MonedaDR: "${docto.get('MonedaDR')}"`);
        }

        return true;
    }
}
