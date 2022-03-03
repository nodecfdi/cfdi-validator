import { AbstractPagoValidator } from './abstract-pago-validator';
import { use } from 'typescript-mix';
import { CalculateDocumentAmountTrait } from '../helpers/calculate-document-amount-trait';
import { CNodeInterface, CurrencyDecimals } from '@nodecfdi/cfdiutils-common';
import { ValidatePagoException } from './validate-pago-exception';

interface MontoBetweenIntervalSumOfDocuments extends AbstractPagoValidator, CalculateDocumentAmountTrait {}

/**
 * PAGO09: En un pago, el monto del pago debe encontrarse entre límites mínimo y máximo de la suma
 *         de los valores registrados en el importe pagado de los documentos relacionados (Guía llenado)
 */
class MontoBetweenIntervalSumOfDocuments extends AbstractPagoValidator {
    @use(CalculateDocumentAmountTrait) private this: unknown;

    protected code = 'PAGO09';

    protected title = [
        'En un pago, el monto del pago debe encontrarse entre límites mínimo y máximo de la suma',
        ' de los valores registrados en el importe pagado de los documentos relacionados (Guía llenado)',
    ].join('');

    public validatePago(pago: CNodeInterface): boolean {
        const pagoAmount = parseFloat(pago.get('Monto') || '0');
        const bounds = this.calculateDocumentsAmountBounds(pago);
        const currencyDecimals = CurrencyDecimals.newFromKnownCurrencies(pago.get('MonedaP'), 2);
        const lower = currencyDecimals.round(bounds['lower']);
        const upper = currencyDecimals.round(bounds['upper']);
        if (pagoAmount < lower || pagoAmount > upper) {
            throw new ValidatePagoException(
                `Monto del pago: "${pagoAmount}", Suma mínima: "${lower}", Suma máxima: "${upper}"`
            );
        }

        return true;
    }

    public calculateDocumentsAmountBounds(pago: CNodeInterface): Record<string, number> {
        const documents = pago.searchNodes('pago10:DoctoRelacionado');
        const values = documents.map((document) => this.calculateDocumentAmountBounds(document, pago));
        return {
            lower: values.reduce((a, b) => a + (b['lower'] || 0), 0),
            upper: values.reduce((a, b) => a + (b['upper'] || 0), 0),
        };
    }

    public calculateDocumentAmountBounds(
        doctoRelacionado: CNodeInterface,
        pago: CNodeInterface
    ): Record<string, number> {
        const amount = this.calculateDocumentAmount(doctoRelacionado, pago);
        const impPagado = doctoRelacionado.get('ImpPagado') || amount;
        const tipoCambioDR = doctoRelacionado.get('TipoCambioDR');
        let exchangeRate = 1;
        if ('' !== tipoCambioDR && pago.get('MonedaP') !== pago.get('MonedaDR')) {
            exchangeRate = parseFloat(tipoCambioDR || '0');
        }
        const numDecimalsAmount = this.getNumDecimals(`${impPagado}`);
        const numDecimalsExchangeRate = this.getNumDecimals(`${tipoCambioDR}`);

        if (0 === numDecimalsExchangeRate) {
            return {
                lower: amount / exchangeRate,
                upper: amount / exchangeRate,
            };
        }

        const almostTwo = 2 - 10 ** -10;

        const lowerAmount = amount - 10 ** -numDecimalsAmount / 2;
        const lowerExchangeRate = exchangeRate + 10 ** -numDecimalsExchangeRate / almostTwo;

        const upperAmount = amount + 10 ** -numDecimalsAmount / almostTwo;
        const upperExchangeRate = exchangeRate - 10 ** -numDecimalsExchangeRate / 2;
        return {
            lower: lowerAmount / lowerExchangeRate,
            upper: upperAmount / upperExchangeRate,
        };
    }

    public getNumDecimals(numeric: string): number {
        if (isNaN(Number(numeric)) || isNaN(parseFloat(numeric))) {
            return 0;
        }
        const pointPosition = numeric.indexOf('.');
        if (pointPosition === -1) {
            return 0;
        }

        return numeric.length - 1 - pointPosition;
    }
}

export { MontoBetweenIntervalSumOfDocuments };
