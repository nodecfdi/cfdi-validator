import { XmlResolverPropertyInterface, XmlResolverPropertyTrait } from '@nodecfdi/cfdiutils-core';
import { Schema, Schemas, SchemaValidator } from '@nodecfdi/xml-schema-validator';
import { CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Mixin } from 'ts-mixer';
import { existsSync } from 'fs';
import { ValidatorInterface } from '../contracts/validator-interface';
import { RequireXmlStringInterface } from '../contracts/require-xml-string-interface';
import { RequireXmlResolverInterface } from '../contracts/require-xml-resolver-interface';
import { XmlStringPropertyTrait } from '../traits/xml-string-property-trait';
import { Asserts } from '../asserts';
import { Status } from '../status';

class XmlFollowSchema
    extends Mixin(XmlStringPropertyTrait, XmlResolverPropertyTrait)
    implements ValidatorInterface, XmlResolverPropertyInterface, RequireXmlStringInterface, RequireXmlResolverInterface
{
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
