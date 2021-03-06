/* eslint-disable jest/expect-expect */
import { Rfc } from '@nodecfdi/rfc';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { useValidate33TestCase } from '../validate33-test-case';
import { ReceptorRfc } from '~/cfdi33/standard/receptor-rfc';
import { Status } from '~/status';

describe('ReceptorRfc', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode, getAsserts } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ReceptorRfc());
    });

    test.each([
        ['generic', Rfc.RFC_GENERIC],
        ['foreign', Rfc.RFC_FOREIGN],
        ['person', 'COSC8001137NA'],
        ['moral', 'DIM8701081LA']
    ])('valid cases %s', async (_name, rfc) => {
        getComprobante33().addChild(
            new CNode('cfdi:Receptor', {
                Rfc: rfc
            })
        );

        await runValidate();

        expect(getAsserts().hasErrors()).toBeFalsy();
        assertStatusEqualsCode(Status.ok(), 'RECRFC01');
    });

    test.each([
        ['none', null],
        ['empty', ''],
        ['wrong', 'COSC8099137NA']
    ])('invalid cases %s', async (_name: string, rfc: string | null) => {
        getComprobante33().addChild(
            new CNode('cfdi:Receptor', {
                Rfc: rfc
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'RECRFC01');
    });
});
