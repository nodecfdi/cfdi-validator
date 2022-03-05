import { ImplementationValidatorInterface } from './implementation-validator-interface';
import { RequireXmlResolverInterface } from '../../src';
import { use } from 'typescript-mix';
import { XmlResolverPropertyTrait } from '@nodecfdi/cfdiutils-core';

interface ImplementationRequireXmlResolverInterface
    extends XmlResolverPropertyTrait,
        ImplementationValidatorInterface {}

class ImplementationRequireXmlResolverInterface
    extends ImplementationValidatorInterface
    implements RequireXmlResolverInterface
{
    @use(XmlResolverPropertyTrait) protected this: unknown;
}

export { ImplementationRequireXmlResolverInterface };
