import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO26: En un documento relacionado, el importe del saldo anterior debe ser mayor a cero (CRP221)
 */
export class ImporteSaldoAnteriorValor extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO26';

    protected title = 'En un documento relacionado, el importe del saldo anterior debe ser mayor a cero (CRP221)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const value = parseFloat(docto.attributes().get('ImpSaldoAnt') || '0');
        if (!this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpSaldoAnt: ${docto.attributes().get('ImpSaldoAnt')}`);
        }

        return true;
    }
}
