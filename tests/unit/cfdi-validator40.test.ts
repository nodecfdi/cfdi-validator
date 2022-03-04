import { useTestCase } from '../test-case';
import { CfdiValidator40 } from '../../src';
import { CNode, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { readFileSync } from 'fs';

describe('CfdiValidator40', () => {
    const { newResolver, utilAsset, installCertificate } = useTestCase();

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

        expect.hasAssertions();
        try {
            await validator.validate('', new CNode('root'));
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain('empty');
        }
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
