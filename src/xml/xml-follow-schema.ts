import { ValidatorInterface } from '../contracts/validator-interface';
import { XmlResolverPropertyInterface, XmlResolverPropertyTrait } from '@nodecfdi/cfdiutils-core';
import { RequireXmlStringInterface } from '../contracts/require-xml-string-interface';
import { RequireXmlResolverInterface } from '../contracts/require-xml-resolver-interface';
import { use } from 'typescript-mix';
import { XmlStringPropertyTrait } from '../traits/xml-string-property-trait';
import { CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../asserts';
import { Schema, Schemas, SchemaValidator } from '@nodecfdi/xml-schema-validator';
import { existsSync } from 'fs';
import { Status } from '../status';

interface XmlFollowSchema extends XmlStringPropertyTrait, XmlResolverPropertyTrait {}

class XmlFollowSchema
    implements ValidatorInterface, XmlResolverPropertyInterface, RequireXmlStringInterface, RequireXmlResolverInterface
{
    @use(XmlStringPropertyTrait, XmlResolverPropertyTrait) protected this: unknown;

    public canValidateCfdiVersion(_version: string): boolean {
        return true;
    }

    public async validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('XSD01', 'El contenido XML sigue los esquemas XSD');

        // obtain content
        let content = this.getXmlString();
        if ('' === content) {
            content = XmlNodeUtils.nodeToXmlString(comprobante);
        }

        // create the schema validator object
        const schemaValidator = SchemaValidator.createFromString(content);

        // validate using resolver->retriever or using the simple method
        try {
            let schemas = schemaValidator.buildSchemas();
            if (this.hasXmlResolver() && this.getXmlResolver().hasLocalPath()) {
                schemas = await this.changeSchemasUsingRetriever(schemas);
            }
            schemaValidator.validateWithSchemas(schemas);
        } catch (e) {
            assert.setStatus(Status.error(), (e as Error).message);
            asserts.mustStop(true);
            return Promise.resolve();
        }

        // set final status
        assert.setStatus(Status.ok());

        return Promise.resolve();
    }

    private async changeSchemasUsingRetriever(schemas: Schemas): Promise<Schemas> {
        // obtain the retriever, throw its own exception if non set
        const retriever = this.getXmlResolver().newXsdRetriever();

        // replace the schemas locations with the retrieved local path
        for (const schema of schemas.values()) {
            const location = schema.getLocation();
            const localPath = retriever.buildPath(location);
            if (!existsSync(localPath)) {
                await retriever.retrieve(location);
            }
            // this call will change the value, not insert a new entry
            schemas.insert(new Schema(schema.getNamespace(), localPath));
        }
        return Promise.resolve(schemas);
    }
}

export { XmlFollowSchema };
