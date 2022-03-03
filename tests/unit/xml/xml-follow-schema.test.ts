import { useValidate33TestCase } from '../cfdi33/validate33-test-case';
import { XmlFollowSchema } from '../../../src/xml/xml-follow-schema';
import { readFileSync } from 'fs';
import { XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../../src/status';

describe('XmlFollowSchema', () => {
    const { setValidator, newResolver, utilAsset, setComprobante, runValidate, assertStatusEqualsCode, getAsserts } =
        useValidate33TestCase();

    let validator: XmlFollowSchema;
    beforeEach(() => {
        validator = new XmlFollowSchema();
        validator.setXmlResolver(newResolver());
        setValidator(validator);
    });

    test('using real cfdi33', async () => {
        const xmlContent = readFileSync(utilAsset('cfdi33-real.xml'), 'binary');
        setComprobante(XmlNodeUtils.nodeFromXmlString(xmlContent));

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'XSD01');
    }, 30000);

    test('with missing element', async () => {
        const xmlContent = readFileSync(utilAsset('cfdi33-real.xml'), 'binary');
        const comprobante = XmlNodeUtils.nodeFromXmlString(xmlContent);
        const emisor = comprobante.children().firstNodeWithName('cfdi:Emisor');
        if (!emisor) {
            throw new Error('CFDI33 (real) does not contains an cfdi:Emisor node!');
        }
        comprobante.children().remove(emisor);
        setComprobante(comprobante);

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XSD01');
        expect(getAsserts().get('XSD01').getExplanation()).toContain('Emisor');
    }, 30000);

    test('with xsd uri not found', async () => {
        let xmlContent = readFileSync(utilAsset('cfdi33-real.xml'), 'binary');
        xmlContent = xmlContent.replace(
            'http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd',
            'http://www.sat.gob.mx/sitio_internet/not-found/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd'
        );
        setComprobante(XmlNodeUtils.nodeFromXmlString(xmlContent));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XSD01');
    }, 30000);
});
