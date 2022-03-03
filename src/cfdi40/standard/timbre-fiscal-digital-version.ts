import { ValidatorInterface } from '../../contracts/validator-interface';
import { use } from 'typescript-mix';
import { TimbreFiscalDigitalVersionValidatorTrait } from '../../common/timbre-fiscal-digital-version-validator-trait';
import { AbstractDiscoverableVersion40 } from '../abstracts/abstract-discoverable-version40';

interface TimbreFiscalDigitalVersion extends TimbreFiscalDigitalVersionValidatorTrait {}

/**
 * TimbreFiscalDigitalVersion
 *
 * Válida que:
 * - TFDVERSION01: Si existe el complemento timbre fiscal digital, entonces su versión debe ser 1.1
 */
class TimbreFiscalDigitalVersion extends AbstractDiscoverableVersion40 {
    @use(TimbreFiscalDigitalVersionValidatorTrait) protected this: unknown;

    public static createDiscovered(): ValidatorInterface {
        return new TimbreFiscalDigitalVersion();
    }
}

export { TimbreFiscalDigitalVersion };
