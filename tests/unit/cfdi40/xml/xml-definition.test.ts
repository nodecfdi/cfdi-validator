import { useValidate40TestCase } from '../validate40-test-case';
import { XmlDefinition } from '../../../../src/cfdi40/xml/xml-definition';
import { Status } from '../../../../src/status';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('XmlDefinition', () => {
    const { setValidator, runValidate, assertStatusEqualsCode, getComprobante, setComprobante } =
        useValidate40TestCase();
    beforeEach(() => {
        setValidator(new XmlDefinition());
    });

    test('correct definition', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'XML01');
        assertStatusEqualsCode(Status.ok(), 'XML02');
        assertStatusEqualsCode(Status.ok(), 'XML03');
    }, 30000);

    test('incorrect definition namespace prefix', async () => {
        getComprobante().addAttributes({
            'xmlns:cfdi': null,
            'xmls:cfdi4': 'http://www.sat.gob.mx/cfd/4',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML01');
    });

    test('incorrect definition namespace value', async () => {
        getComprobante().addAttributes({
            'xmlns:cfdi': 'http://www.sat.gob.mx/cfd/40',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML01');
    });

    test('incorrect definition root prefix', async () => {
        setComprobante(new CNode('cfdi4:Comprobante'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML02');
    });

    test('incorrect definition root name', async () => {
        setComprobante(new CNode('cfdi:Cfdi'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML02');
    });

    test('incorrect definition version name', async () => {
        getComprobante().addAttributes({
            Version: null,
            version: '4.0',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML03');
    });

    test('incorrect definition version value', async () => {
        getComprobante().addAttributes({
            Version: '4.1',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'XML03');
    });
});
