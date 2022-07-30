import { Mixin } from 'ts-mixer';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { RequireXmlResolverInterface } from '../../contracts/require-xml-resolver-interface';
import { RequireXsltBuilderInterface } from '../../contracts/require-xslt-builder-interface';
import { TimbreFiscalDigitalSelloValidatorTrait } from '../../common/timbre-fiscal-digital-sello-validator-trait';
import { ValidatorInterface } from '../../contracts/validator-interface';

/**
 * TimbreFiscalDigitalSello
 *
 * Válida que:
 * - TFDSELLO01: El Sello SAT del Timbre Fiscal Digital corresponde al certificado SAT
 */
class TimbreFiscalDigitalSello
    extends Mixin(AbstractDiscoverableVersion33, TimbreFiscalDigitalSelloValidatorTrait)
    implements RequireXmlResolverInterface, RequireXsltBuilderInterface
{
    public static createDiscovered(): ValidatorInterface {
        return new TimbreFiscalDigitalSello();
    }
}

export { TimbreFiscalDigitalSello };
