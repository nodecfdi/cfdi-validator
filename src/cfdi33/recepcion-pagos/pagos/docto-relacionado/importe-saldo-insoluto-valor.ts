import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { use } from 'typescript-mix';
import { CalculateDocumentAmountTrait } from '../../helpers/calculate-document-amount-trait';

interface ImporteSaldoInsolutoValor extends AbstractDoctoRelacionadoValidator, CalculateDocumentAmountTrait {}

/**
 * PAGO28: En un documento relacionado, el importe del saldo insoluto debe ser mayor o igual a cero
 *         e igual a la resta del importe del saldo anterior menos el importe pagado (CRP226)
 */
class ImporteSaldoInsolutoValor extends AbstractDoctoRelacionadoValidator {
    @use(CalculateDocumentAmountTrait) private this: unknown;

    protected code = 'PAGO28';

    protected title = [
        'En un documento relacionado, el importe del saldo insoluto debe ser mayor o igual a cero',
        ' e igual a la resta del importe del saldo anterior menos el importe pagado (CRP226)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const value = parseFloat(docto.attributes().get('ImpSaldoInsoluto') || '0');
        if (!this.isEqual(0, value) && !this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpSaldoInsoluto: ${docto.attributes().get('ImpSaldoInsoluto')}`);
        }

        const expected =
            parseFloat(docto.attributes().get('ImpSaldoAnt') || '0') -
            this.calculateDocumentAmount(docto, this.getPago());
        if (!this.isEqual(value, expected)) {
            throw this.exception(
                `ImpSaldoInsoluto: ${docto.attributes().get('ImpSaldoInsoluto')}, Esperado: ${expected}`
            );
        }
        return true;
    }
}

export { ImporteSaldoInsolutoValor };
