import { CNode, install, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { DOMImplementation, DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { readFileSync } from 'fs';
import { useTestCase } from '../test-case';
import { Asserts, CfdiValidator40 } from '~/index';

describe('CfdiValidator40', () => {
    const { newResolver, utilAsset, installCertificate } = useTestCase();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('construct without arguments', () => {
        const validator = new CfdiValidator40();
        expect(validator.hasXmlResolver()).toBeTruthy();
    });

    test('construct with resolver', () => {
        const xmlResolver = newResolver();
        const validator = new CfdiValidator40(xmlResolver);

        expect(validator.getXmlResolver()).toBe(xmlResolver);
    });

    test('validate with incorrect xml string', async () => {
        const validator = new CfdiValidator40();
        const asserts = await validator.validateXml('<not-a-cfdi/>');

        expect(asserts.hasErrors()).toBeTruthy();
    });

    test('validate with incorrect node', async () => {
        const validator = new CfdiValidator40();
        const asserts = await validator.validateNode(new CNode('not-a-cfdi'));

        expect(asserts.hasErrors()).toBeTruthy();
    });

    test('validate with correct data', async () => {
        const cfdiFile = utilAsset('cfdi40-valid.xml');
        const sourceRaw = readFileSync(cfdiFile, 'binary');
        const cfdi = XmlNodeUtils.nodeFromXmlString(sourceRaw);

        // install PAC testing certificate
        installCertificate(utilAsset('certs/30001000000400002495.cer'));

        const validator = new CfdiValidator40();
        const asserts = await validator.validate(sourceRaw, cfdi);
        expect(asserts.hasErrors()).toBeFalsy();
    }, 30000);

    test('validate throws exception if empty content', async () => {
        const validator = new CfdiValidator40();

        const t = (): Promise<Asserts> => validator.validate('', new CNode('root'));

        await expect(t).rejects.toBeInstanceOf(Error);
        await expect(t).rejects.toThrow('empty');
    });

    test('validate cfdi40 real', async () => {
        const cfdiFile = utilAsset('cfdi40-real.xml');
        const sourceRaw = readFileSync(cfdiFile, 'binary');
        const cfdi = XmlNodeUtils.nodeFromXmlString(sourceRaw);

        // install PAC certificate, prevent if SAT service is down
        installCertificate(utilAsset('00001000000504465028.cer'));

        const validator = new CfdiValidator40(newResolver());
        const asserts = await validator.validate(sourceRaw, cfdi);
        expect(asserts.hasErrors()).toBeFalsy();
    }, 30000);
});
