import { Status } from '../../src';
import { CNode, CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Tfd11 } from '@nodecfdi/cfdiutils-elements';

const useTimbreFiscalDigital11VersionTestTrait = (
    runValidate: () => Promise<void>,
    assertStatusEqualsCode: (expected: Status, code: string) => void,
    getComprobante: () => CNodeInterface
): void => {
    test('valid case', async () => {
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [new Tfd11.TimbreFiscalDigital()]));

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TFDVERSION01');
    });

    test.each([['1.0'], ['1.2'], ['0.1'], ['1.10'], ['ASD'], [''], ['0'], [null]])(
        'invalid case',
        async (version: string | null) => {
            const tfd = new Tfd11.TimbreFiscalDigital();
            tfd.addAttributes({
                Version: version, // override version
            });
            getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'TFDVERSION01');
        }
    );

    test('nonde case', async () => {
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, []));

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'TFDVERSION01');
    });
};

export { useTimbreFiscalDigital11VersionTestTrait };
