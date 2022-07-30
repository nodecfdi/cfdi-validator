import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO30: En un documento relacionado, el importe pagado es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP235)
 */
export class ImportePagadoRequerido extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO30';

    protected override title = [
        'En un documento relacionado, el importe pagado es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP235)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!docto.offsetExists('ImpPagado')) {
            const documentsCount = this.getPago().searchNodes('pago10:DoctoRelacionado').length;
            if (documentsCount > 1) {
                throw this.exception('No hay importe pagado y hay más de 1 documento en el pago');
            }
            if (docto.offsetExists('TipoCambioDR')) {
                throw this.exception('No hay importe pagado y existe el tipo de cambio del documento');
            }
        }

        return true;
    }
}
