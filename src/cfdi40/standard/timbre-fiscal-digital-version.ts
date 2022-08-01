import { Mixin } from 'ts-mixer';
import { TimbreFiscalDigitalVersionValidatorTrait } from '../../common/timbre-fiscal-digital-version-validator-trait';
import { AbstractDiscoverableVersion40 } from '../abstracts/abstract-discoverable-version40';

/**
 * TimbreFiscalDigitalVersion
 *
 * Válida que:
 * - TFDVERSION01: Si existe el complemento timbre fiscal digital, entonces su versión debe ser 1.1
 */
class TimbreFiscalDigitalVersion extends Mixin(
    AbstractDiscoverableVersion40,
    TimbreFiscalDigitalVersionValidatorTrait
) {}

export { TimbreFiscalDigitalVersion };
