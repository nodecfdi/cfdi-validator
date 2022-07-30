import { Mixin } from 'ts-mixer';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { TimbreFiscalDigitalVersionValidatorTrait } from '../../common/timbre-fiscal-digital-version-validator-trait';

/**
 * TimbreFiscalDigitalVersion
 *
 * Válida que:
 * - TFDVERSION01: Si existe el complemento timbre fiscal digital, entonces su versión debe ser 1.1
 */
class TimbreFiscalDigitalVersion extends Mixin(
    AbstractDiscoverableVersion33,
    TimbreFiscalDigitalVersionValidatorTrait
) {
    public static createDiscovered(): ValidatorInterface {
        return new TimbreFiscalDigitalVersion();
    }
}

export { TimbreFiscalDigitalVersion };
