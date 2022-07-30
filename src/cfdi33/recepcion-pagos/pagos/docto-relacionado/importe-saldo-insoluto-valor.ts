import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Mixin } from 'ts-mixer';
import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CalculateDocumentAmountTrait } from '../../helpers/calculate-document-amount-trait';

/**
 * PAGO28: En un documento relacionado, el importe del saldo insoluto debe ser mayor o igual a cero
 *         e igual a la resta del importe del saldo anterior menos el importe pagado (CRP226)
 */
class ImporteSaldoInsolutoValor extends Mixin(AbstractDoctoRelacionadoValidator, CalculateDocumentAmountTrait) {
    protected override code = 'PAGO28';

    protected override title = [
        'En un documento relacionado, el importe del saldo insoluto debe ser mayor o igual a cero',
        ' e igual a la resta del importe del saldo anterior menos el importe pagado (CRP226)'
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const value = parseFloat(docto.get('ImpSaldoInsoluto') || '0');
        if (!this.isEqual(0, value) && !this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpSaldoInsoluto: ${docto.get('ImpSaldoInsoluto')}`);
        }

        const expected =
            parseFloat(docto.get('ImpSaldoAnt') || '0') - this.calculateDocumentAmount(docto, this.getPago());
        if (!this.isEqual(expected, value)) {
            throw this.exception(`ImpSaldoInsoluto: ${docto.get('ImpSaldoInsoluto')}, Esperado: ${expected}`);
        }

        return true;
    }
}

export { ImporteSaldoInsolutoValor };
