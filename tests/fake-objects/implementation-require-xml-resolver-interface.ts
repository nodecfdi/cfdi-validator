import { XmlResolverPropertyTrait } from '@nodecfdi/cfdiutils-core';
import { Mixin } from 'ts-mixer';
import { ImplementationValidatorInterface } from './implementation-validator-interface';
import { RequireXmlResolverInterface } from '~/contracts/require-xml-resolver-interface';

class ImplementationRequireXmlResolverInterface
    extends Mixin(ImplementationValidatorInterface, XmlResolverPropertyTrait)
    implements RequireXmlResolverInterface {}

export { ImplementationRequireXmlResolverInterface };
