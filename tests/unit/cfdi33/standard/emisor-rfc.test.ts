import { useValidate33TestCase } from '../validate33-test-case';
import { EmisorRfc } from '../../../../src/cfdi33/standard/emisor-rfc';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../../../src';
import { Rfc } from '@nodecfdi/rfc';

describe('Emisor Rfc', () => {
    const { setValidator, runValidate, getComprobante33, getAsserts, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new EmisorRfc());
    });

    test.each([
        ['person', 'COSC8001137NA'],
        ['moral', 'DIM8701081LA'],
    ])('valid cases %s', async (name: string, rfc: string) => {
        getComprobante33().addChild(
            new CNode('cfdi:Emisor', {
                Rfc: rfc,
            })
        );

        await runValidate();

        expect(getAsserts().hasErrors()).toBeFalsy();
        assertStatusEqualsCode(Status.ok(), 'EMISORRFC01');
    });

    test.each([
        ['none', null],
        ['empty', ''],
        ['wrong', 'COSC8099137NA'],
        ['generic', Rfc.RFC_GENERIC],
        ['foreign', Rfc.RFC_FOREIGN],
    ])('valid cases %s', async (name: string, rfc: string | null) => {
        getComprobante33().addChild(
            new CNode('cfdi:Emisor', {
                Rfc: rfc,
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'EMISORRFC01');
    });
});
