import {
    SaxonbCliBuilder,
    XmlResolver,
    XmlResolverPropertyInterface,
    XsltBuilderInterface,
    XsltBuilderPropertyInterface,
} from '@nodecfdi/cfdiutils-core';
import { use } from 'typescript-mix';
import { CfdiValidatorTrait } from './cfdi-validator-trait';
import { MultiValidator } from './multi-validator';
import { MultiValidatorFactory } from './multi-validator-factory';

interface CfdiValidator33 extends CfdiValidatorTrait {}

class CfdiValidator33 implements XmlResolverPropertyInterface, XsltBuilderPropertyInterface {
    @use(CfdiValidatorTrait) protected this: unknown;

    /**
     * This class uses a default XmlResolver if not provided or null.
     * If you really want to remove the XmlResolver then use the method setXmlResolver after construction.
     *
     * @param xmlResolver
     * @param xsltBuilder
     */
    constructor(xmlResolver: XmlResolver | null = null, xsltBuilder: XsltBuilderInterface | null = null) {
        this.setXmlResolver(xmlResolver || new XmlResolver());
        this.setXsltBuilder(xsltBuilder || new SaxonbCliBuilder('/usr/bin/saxonb-xslt'));
    }

    protected createVersionedMultiValidator(): Promise<MultiValidator> {
        const factory = new MultiValidatorFactory();
        return factory.newReceived33();
    }
}

export { CfdiValidator33 };
