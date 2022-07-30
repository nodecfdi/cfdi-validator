import {
    SaxonbCliBuilder,
    XmlResolver,
    XmlResolverPropertyInterface,
    XsltBuilderInterface,
    XsltBuilderPropertyInterface
} from '@nodecfdi/cfdiutils-core';
import { CfdiValidatorTrait } from './cfdi-validator-trait';
import { MultiValidator } from './multi-validator';
import { MultiValidatorFactory } from './multi-validator-factory';

class CfdiValidator40 extends CfdiValidatorTrait implements XmlResolverPropertyInterface, XsltBuilderPropertyInterface {
    /**
     * This class uses a default XmlResolver if not provided or null.
     * If you really want to remove the XmlResolver then use the method setXmlResolver after construction.
     *
     * @param xmlResolver -
     * @param xsltBuilder -
     */
    constructor(xmlResolver: XmlResolver | null = null, xsltBuilder: XsltBuilderInterface | null = null) {
        super();
        this.setXmlResolver(xmlResolver || new XmlResolver());
        this.setXsltBuilder(xsltBuilder || new SaxonbCliBuilder('/usr/bin/saxonb-xslt'));
    }

    protected createVersionedMultiValidator(): MultiValidator {
        const factory = new MultiValidatorFactory();

        return factory.newReceived40();
    }
}

export { CfdiValidator40 };
