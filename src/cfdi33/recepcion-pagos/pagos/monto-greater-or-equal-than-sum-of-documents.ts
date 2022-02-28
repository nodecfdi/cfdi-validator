import { AbstractPagoValidator } from './abstract-pago-validator';
import { use } from 'typescript-mix';
import { CalculateDocumentAmountTrait } from '../helpers/calculate-document-amount-trait';
import { CNodeInterface, CurrencyDecimals } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

interface MontoGreaterOrEqualThanSumOfDocuments extends AbstractPagoValidator, CalculateDocumentAmountTrait {}

/**
 * PAGO30: En un pago, la suma de los valores registrados o predeterminados en el importe pagado
 *         de los documentos relacionados debe ser menor o igual que el monto del pago (CRP206)
 */
class MontoGreaterOrEqualThanSumOfDocuments extends AbstractPagoValidator {
    @use(CalculateDocumentAmountTrait) private this: unknown;

    protected code = 'PAGO30';

    protected title = [
        'En un pago, la suma de los valores registrados o predeterminados en el importe pagado',
        ' de los documentos relacionados debe ser menor o igual que el monto del pago (CRP206)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const currency = this.createCurrencyDecimals(pago.attributes().get('MonedaP') || '');
        const sumOfDocuments = this.calculateSumOfDocuments(pago, currency);
        const pagoAmount = parseFloat(pago.attributes().get('Monto') || '0');
        if (this.isGreaterThan(sumOfDocuments, pagoAmount)) {
            throw new ValidatePagoException(`Monto del pago: "${pagoAmount}", Suma de documentos: "${sumOfDocuments}"`);
        }

        return true;
    }

    public calculateSumOfDocuments(pago: CNodeInterface, currency: CurrencyDecimals): number {
        let sumOfDocuments = 0;
        const documents = pago.searchNodes('pago10:DoctoRelacionado');
        documents.forEach((document) => {
            let exchangeRate = parseFloat(document.attributes().get('TipoCambioDR') || '0');
            if (this.isEqual(exchangeRate, 0)) {
                exchangeRate = 1;
            }
            sumOfDocuments += currency.round(this.calculateDocumentAmount(document, pago) / exchangeRate);
        });
        return sumOfDocuments;
    }
}

export { MontoGreaterOrEqualThanSumOfDocuments };