import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export abstract class CalculateDocumentAmountTrait {
    public calculateDocumentAmount(doctoRelacionado: CNodeInterface, pago: CNodeInterface): number {
        // el importe pagado es el que está en el documento
        if (doctoRelacionado.attributes().has('ImpPagado')) {
            return Number.parseFloat(doctoRelacionado.attributes().get('ImpPagado') || '');
        }

        // el importe pagado es el que está en el pago
        const doctosCount = pago.searchNodes('pago10:DoctoRelacionado').length;
        if (1 === doctosCount && !doctoRelacionado.attributes().has('TipoCambioDR')) {
            return Number.parseFloat(pago.attributes().get('Monto') || '');
        }

        // no hay importe pagado
        return 0.0;
    }
}
