import { RequireXmlStringInterface } from '../../src/contracts/require-xml-string-interface';
import { use } from 'typescript-mix';
import { XmlStringPropertyTrait } from '../../src/traits/xml-string-property-trait';
import { ImplementationValidatorInterface } from './implementation-validator-interface';

interface ImplementationRequireXmlStringInterface extends XmlStringPropertyTrait, ImplementationValidatorInterface {}

class ImplementationRequireXmlStringInterface
    extends ImplementationValidatorInterface
    implements RequireXmlStringInterface
{
    @use(XmlStringPropertyTrait) protected this: unknown;
}

export { ImplementationRequireXmlStringInterface };
