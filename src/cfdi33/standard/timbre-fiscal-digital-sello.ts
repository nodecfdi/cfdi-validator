import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { RequireXmlResolverInterface } from '../../contracts/require-xml-resolver-interface';
import { RequireXsltBuilderInterface } from '../../contracts/require-xslt-builder-interface';
import { use } from 'typescript-mix';
import { TimbreFiscalDigitalSelloValidatorTrait } from '../../common/timbre-fiscal-digital-sello-validator-trait';
import { ValidatorInterface } from '../../contracts/validator-interface';

interface TimbreFiscalDigitalSello extends TimbreFiscalDigitalSelloValidatorTrait {}

/**
 * TimbreFiscalDigitalSello
 *
 * Válida que:
 * - TFDSELLO01: El Sello SAT del Timbre Fiscal Digital corresponde al certificado SAT
 */
class TimbreFiscalDigitalSello
    extends AbstractDiscoverableVersion33
    implements RequireXmlResolverInterface, RequireXsltBuilderInterface
{
    @use(TimbreFiscalDigitalSelloValidatorTrait) protected this: unknown;

    public static createDiscovered(): ValidatorInterface {
        return new TimbreFiscalDigitalSello();
    }
}

export { TimbreFiscalDigitalSello };
