import { CfdiValidator33 } from '../../src';
import { useTestCase } from '../test-case';
import { CNode, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { readFileSync } from 'fs';

describe('CfdiValidator33', () => {
    const { newResolver, utilAsset } = useTestCase();

    test('construct without arguments', () => {
        const validator = new CfdiValidator33();

        expect(validator.hasXmlResolver()).toBeTruthy();
    });

    test('construct with resolver', () => {
        const xmlResolver = newResolver();
        const validator = new CfdiValidator33(xmlResolver);

        expect(validator.getXmlResolver()).toBe(xmlResolver);
    });

    test('validate with incorrect xml string', async () => {
        const validator = new CfdiValidator33();
        const asserts = await validator.validateXml('<not-a-cfdi/>');

        expect(asserts.hasErrors()).toBeTruthy();
    }, 30000);

    test('validate with incorrect node', async () => {
        const validator = new CfdiValidator33();
        const asserts = await validator.validateNode(new CNode('not-a-cfdi'));

        expect(asserts.hasErrors()).toBeTruthy();
    }, 30000);

    test('validate with correct data', async () => {
        const cfdiFile = utilAsset('cfdi33-valid.xml');
        const sourceRaw = readFileSync(cfdiFile, 'binary');
        const cfdi = XmlNodeUtils.nodeFromXmlString(sourceRaw);

        const validator = new CfdiValidator33();
        const asserts = await validator.validate(sourceRaw, cfdi);
        // Is already known than TFDSELLO01 is failing
        // We are not creating the SelloSAT for cfdi33-valid.xml file
        asserts.removeByCode('TFDSELLO01');
        expect(asserts.hasErrors()).toBeFalsy();
    }, 30000);

    test('validate throws error if empty content', async () => {
        const validator = new CfdiValidator33();

        expect.hasAssertions();
        try {
            await validator.validate('', new CNode('root'));
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('empty');
        }
    }, 30000);

    test('validate cfdi33 real', async () => {
        const cfdiFile = utilAsset('cfdi33-real.xml');
        const sourceRaw = readFileSync(cfdiFile, 'binary');
        const cfdi = XmlNodeUtils.nodeFromXmlString(sourceRaw);

        const validator = new CfdiValidator33(newResolver());
        const asserts = await validator.validate(sourceRaw, cfdi);

        expect(asserts.hasErrors()).toBeFalsy();
    }, 30000);
});
