import { RequireXmlStringInterface, XmlStringPropertyTrait } from '../../src';
import { use } from 'typescript-mix';
import { ImplementationValidatorInterface } from './implementation-validator-interface';

interface ImplementationRequireXmlStringInterface extends XmlStringPropertyTrait, ImplementationValidatorInterface {}

class ImplementationRequireXmlStringInterface
    extends ImplementationValidatorInterface
    implements RequireXmlStringInterface
{
    @use(XmlStringPropertyTrait) protected this: unknown;
}

export { ImplementationRequireXmlStringInterface };
