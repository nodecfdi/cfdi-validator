import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO33: En un documento relacionado, el saldo insoluto es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP234)
 */
export class ImporteSaldoInsolutoRequerido extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO33';

    protected title = [
        'En un documento relacionado, el saldo insoluto es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP233)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!(docto.attributes().has('ImpSaldoInsoluto') && 'PPD' === docto.attributes().get('MetodoDePagoDR'))) {
            throw this.exception('No hay saldo insoluto y el método de pago es PPD');
        }
        return true;
    }
}
