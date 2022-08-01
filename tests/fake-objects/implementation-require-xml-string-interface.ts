import { Mixin } from 'ts-mixer';
import { RequireXmlStringInterface } from '~/contracts/require-xml-string-interface';
import { XmlStringPropertyTrait } from '~/traits/xml-string-property-trait';
import { ImplementationValidatorInterface } from './implementation-validator-interface';

class ImplementationRequireXmlStringInterface
    extends Mixin(ImplementationValidatorInterface, XmlStringPropertyTrait)
    implements RequireXmlStringInterface {}

export { ImplementationRequireXmlStringInterface };
