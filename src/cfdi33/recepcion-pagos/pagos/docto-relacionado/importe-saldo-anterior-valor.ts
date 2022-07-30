import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';

/**
 * PAGO26: En un documento relacionado, el importe del saldo anterior debe ser mayor a cero (CRP221)
 */
export class ImporteSaldoAnteriorValor extends AbstractDoctoRelacionadoValidator {
    protected override code = 'PAGO26';

    protected override title =
        'En un documento relacionado, el importe del saldo anterior debe ser mayor a cero (CRP221)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const value = parseFloat(docto.get('ImpSaldoAnt') || '0');
        if (!this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpSaldoAnt: ${docto.get('ImpSaldoAnt')}`);
        }

        return true;
    }
}
