import { MultiValidatorFactory } from '../../src/multi-validator-factory';
import { XmlFollowSchema } from '../../src/xml/xml-follow-schema';

describe('MultiValidatorFactory', () => {
    test('created33 contains at least xsd validator', async () => {
        const factory = new MultiValidatorFactory();
        const validator = await factory.newCreated33();

        expect(validator.canValidateCfdiVersion('3.2')).toBeFalsy();
        expect(validator.canValidateCfdiVersion('3.3')).toBeTruthy();

        let hasXmlFollowSchema = false;
        for (const child of validator) {
            if (child instanceof XmlFollowSchema) {
                hasXmlFollowSchema = true;
            }
        }

        expect(hasXmlFollowSchema).toBeTruthy();
    });

    test('received33 contains at least xsd validator', async () => {
        const factory = new MultiValidatorFactory();
        const validator = await factory.newReceived33();

        expect(validator.canValidateCfdiVersion('3.2')).toBeFalsy();
        expect(validator.canValidateCfdiVersion('3.3')).toBeTruthy();

        let hasXmlFollowSchema = false;
        for (const child of validator) {
            if (child instanceof XmlFollowSchema) {
                hasXmlFollowSchema = true;
            }
        }

        expect(hasXmlFollowSchema).toBeTruthy();
    });
});
