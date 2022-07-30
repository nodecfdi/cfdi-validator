import { Mixin } from 'ts-mixer';
import { RequireXmlResolverInterface } from '../../contracts/require-xml-resolver-interface';
import { RequireXsltBuilderInterface } from '../../contracts/require-xslt-builder-interface';
import { TimbreFiscalDigitalSelloValidatorTrait } from '../../common/timbre-fiscal-digital-sello-validator-trait';
import { AbstractDiscoverableVersion40 } from '../abstracts/abstract-discoverable-version40';

/**
 * TimbreFiscalDigitalSello
 *
 * Válida que:
 * - TFDSELLO01: El Sello SAT del Timbre Fiscal Digital corresponde al certificado SAT
 */
class TimbreFiscalDigitalSello
    extends Mixin(AbstractDiscoverableVersion40, TimbreFiscalDigitalSelloValidatorTrait)
    implements RequireXmlResolverInterface, RequireXsltBuilderInterface {}

export { TimbreFiscalDigitalSello };
