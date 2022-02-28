import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO31: En un documento relacionado, el número de parcialidad es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP234)
 */
export class NumeroParcialidadRequerido extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO31';

    protected title = [
        'En un documento relacionado, el número de parcialidad es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP233)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!docto.attributes().has('NumParcialidad') && 'PPD' === docto.attributes().get('MetodoDePagoDR')) {
            throw this.exception('No hay número de parcialidad y el método de pago es PPD');
        }
        return true;
    }
}
