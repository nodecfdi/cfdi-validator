import {
    XmlResolverPropertyInterface,
    XmlResolverPropertyTrait,
    XsltBuilderPropertyInterface,
    XsltBuilderPropertyTrait
} from '@nodecfdi/cfdiutils-core';
import { Mixin } from 'ts-mixer';
import { XmlStringPropertyTrait } from './traits/xml-string-property-trait';
import { ValidatorInterface } from './contracts/validator-interface';
import { RequireXmlStringInterface } from './contracts/require-xml-string-interface';
import { RequireXmlResolverInterface } from './contracts/require-xml-resolver-interface';
import { RequireXsltBuilderInterface } from './contracts/require-xslt-builder-interface';

class Hydrater
    extends Mixin(XmlResolverPropertyTrait, XmlStringPropertyTrait, XsltBuilderPropertyTrait)
    implements XmlResolverPropertyInterface, XsltBuilderPropertyInterface
{
    public hydrate(validator: ValidatorInterface): void {
        if (this.isRequireXmlStringInterface(validator)) {
            validator.setXmlString(this.getXmlString());
        }
        if (this.hasXmlResolver() && this.isRequireXmlResolverInterface(validator)) {
            validator.setXmlResolver(this.getXmlResolver());
        }
        if (this.isRequireXsltBuilderInterface(validator)) {
            validator.setXsltBuilder(this.getXsltBuilder());
        }
    }

    protected isRequireXmlStringInterface(object: unknown): object is RequireXmlStringInterface {
        const instance = object as RequireXmlStringInterface;

        return instance.setXmlString !== undefined && instance.getXmlString !== undefined;
    }

    protected isRequireXmlResolverInterface(object: unknown): object is RequireXmlResolverInterface {
        const instance = object as RequireXmlResolverInterface;

        return (
            instance.hasXmlResolver !== undefined &&
            instance.getXmlResolver !== undefined &&
            instance.setXmlResolver !== undefined
        );
    }

    protected isRequireXsltBuilderInterface(object: unknown): object is RequireXsltBuilderInterface {
        const instance = object as RequireXsltBuilderInterface;

        return (
            instance.hasXsltBuilder !== undefined &&
            instance.getXsltBuilder !== undefined &&
            instance.setXsltBuilder !== undefined
        );
    }
}

export { Hydrater };
