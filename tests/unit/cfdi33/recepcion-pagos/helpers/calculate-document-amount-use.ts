import { use } from 'typescript-mix';
import { CalculateDocumentAmountTrait } from '../../../../../src/cfdi33/recepcion-pagos/helpers/calculate-document-amount-trait';

interface CalculateDocumentAmountUse extends CalculateDocumentAmountTrait {}

class CalculateDocumentAmountUse {
    @use(CalculateDocumentAmountTrait) private this: unknown;
}

export { CalculateDocumentAmountUse };
