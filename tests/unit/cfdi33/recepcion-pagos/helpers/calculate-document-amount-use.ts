import { Mixin } from 'ts-mixer';
import { CalculateDocumentAmountTrait } from '~/cfdi33/recepcion-pagos/helpers/calculate-document-amount-trait';

class CalculateDocumentAmountUse extends Mixin(CalculateDocumentAmountTrait) {}

export { CalculateDocumentAmountUse };
