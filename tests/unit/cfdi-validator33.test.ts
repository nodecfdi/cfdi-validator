import { CNode, install, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { readFileSync } from 'fs';
import { CfdiValidator33 } from '~/cfdi-validator33';
import { Asserts } from '~/asserts';
import { useTestCase } from '../test-case';

describe('CfdiValidator33', () => {
    const { newResolver, utilAsset } = useTestCase();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

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

        const t = (): Promise<Asserts> => validator.validate('', new CNode('root'));

        await expect(t).rejects.toBeInstanceOf(Error);
        await expect(t).rejects.toThrow('empty');
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
