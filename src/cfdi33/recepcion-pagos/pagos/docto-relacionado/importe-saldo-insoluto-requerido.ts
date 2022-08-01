import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO33: En un documento relacionado, el saldo insoluto es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP234)
 */
export class ImporteSaldoInsolutoRequerido extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO33';

    protected override title = [
        'En un documento relacionado, el saldo insoluto es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP233)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!docto.offsetExists('ImpSaldoInsoluto') && 'PPD' === docto.get('MetodoDePagoDR')) {
            throw this.exception('No hay saldo insoluto y el método de pago es PPD');
        }

        return true;
    }
}
