import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO31: En un documento relacionado, el número de parcialidad es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP234)
 */
export class NumeroParcialidadRequerido extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO31';

    protected override title = [
        'En un documento relacionado, el número de parcialidad es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP233)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!docto.offsetExists('NumParcialidad') && 'PPD' === docto.get('MetodoDePagoDR')) {
            throw this.exception('No hay número de parcialidad y el método de pago es PPD');
        }

        return true;
    }
}
