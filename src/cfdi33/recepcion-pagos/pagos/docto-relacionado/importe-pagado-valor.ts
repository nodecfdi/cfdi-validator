import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { use } from 'typescript-mix';
import { CalculateDocumentAmountTrait } from '../../helpers/calculate-document-amount-trait';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

interface ImportePagadoValor extends AbstractDoctoRelacionadoValidator, CalculateDocumentAmountTrait {}

/**
 * PAGO27: En un documento relacionado, el importe pagado debes ser mayor a cero (CRP223)
 */
class ImportePagadoValor extends AbstractDoctoRelacionadoValidator {
    @use(CalculateDocumentAmountTrait) private this: unknown;

    protected code = 'PAGO27';

    protected title = 'En un documento relacionado, el importe pagado debe ser mayor a cero (CRP223)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        let value: number;
        if (docto.attributes().has('ImpPagado')) {
            value = parseFloat(docto.attributes().get('ImpPagado') || '');
        } else {
            value = this.calculateDocumentAmount(docto, this.getPago());
        }
        if (!this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpPagado: ${docto.attributes().get('ImpPagado')}, valor: ${value}`);
        }
        return true;
    }
}

export { ImportePagadoValor };
