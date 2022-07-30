import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Mixin } from 'ts-mixer';

import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CalculateDocumentAmountTrait } from '../../helpers/calculate-document-amount-trait';

/**
 * PAGO27: En un documento relacionado, el importe pagado debes ser mayor a cero (CRP223)
 */
class ImportePagadoValor extends Mixin(AbstractDoctoRelacionadoValidator, CalculateDocumentAmountTrait) {
    protected override code = 'PAGO27';

    protected override title = 'En un documento relacionado, el importe pagado debe ser mayor a cero (CRP223)';

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        let value: number;
        if (docto.offsetExists('ImpPagado')) {
            value = parseFloat(docto.attributes().get('ImpPagado') || '0');
        } else {
            value = this.calculateDocumentAmount(docto, this.getPago());
        }
        if (!this.isGreaterThan(value, 0)) {
            throw this.exception(`ImpPagado: ${docto.get('ImpPagado')}, valor: ${value}`);
        }

        return true;
    }
}

export { ImportePagadoValor };
