import { XmlResolverPropertyTrait, XsltBuilderPropertyTrait } from '@nodecfdi/cfdiutils-core';
import { CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Mixin } from 'ts-mixer';
import { MultiValidator } from './multi-validator';
import { Asserts } from './asserts';
import { Hydrater } from './hydrater';

abstract class CfdiValidatorTrait extends Mixin(XsltBuilderPropertyTrait, XmlResolverPropertyTrait) {
    protected abstract createVersionedMultiValidator(): MultiValidator;

    /**
     * Validate and return the asserts from the validation process.
     * This method can use a xml string and a CNodeInterface,
     * is your responsability that the node is the representation of the content.
     *
     * @param xmlString -
     * @param node -
     */
    public async validate(xmlString: string, node: CNodeInterface): Promise<Asserts> {
        if ('' === xmlString) {
            throw new Error('The xml string to validate cannot be empty');
        }

        const validator = this.createVersionedMultiValidator();

        const hydrater = new Hydrater();
        hydrater.setXmlString(xmlString);
        hydrater.setXmlResolver(this.hasXmlResolver() ? this.getXmlResolver() : null);
        hydrater.setXsltBuilder(this.getXsltBuilder());
        validator.hydrate(hydrater);

        const asserts = new Asserts();
        await validator.validate(node, asserts);

        return asserts;
    }

    /**
     * Validate and return the asserts from the validation process based on a xml string
     *
     * @param xmlString -
     */
    public validateXml(xmlString: string): Promise<Asserts> {
        return this.validate(xmlString, XmlNodeUtils.nodeFromXmlString(xmlString));
    }

    /**
     * Validate and return the asserts from the validation process based on a node interface object
     *
     * @param node -
     */
    public validateNode(node: CNodeInterface): Promise<Asserts> {
        return this.validate(XmlNodeUtils.nodeToXmlString(node), node);
    }
}

export { CfdiValidatorTrait };
