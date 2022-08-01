import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO32: En un documento relacionado, el saldo anterior es requerido cuando
 *         el tipo de cambio existe o existe más de un documento relacionado (CRP234)
 */
export class ImporteSaldoAnteriorRequerido extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO32';

    protected override title = [
        'En un documento relacionado, el saldo anterior es requerido cuando',
        ' el tipo de cambio existe o existe más de un documento relacionado (CRP234)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        if (!docto.offsetExists('ImpSaldoAnt') && 'PPD' === docto.get('MetodoDePagoDR')) {
            throw this.exception('No hay saldo anterior y el método de pago es PPD');
        }

        return true;
    }
}
