import { Status } from '../../src/status';
import { CNode, CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Tfd11 } from '@nodecfdi/cfdiutils-elements';

const useSelloDigitalCertificadoWithCfdiRegistroFiscalTrait = (
    runValidate: () => Promise<void>,
    assertStatusEqualsCode: (expected: Status, code: string) => void,
    getComprobante: () => CNodeInterface
): void => {
    test('fail when has not cfdi registro fiscal and certificados do not match', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SELLO03');
        assertStatusEqualsCode(Status.error(), 'SELLO04');
    });

    test('fail when has not cfdi registro fiscal and certificados match', async () => {
        getComprobante().addChild(
            new CNode('cfdi:Complemento', {}, [
                new Tfd11.TimbreFiscalDigital({
                    NoCertificadoSAT: '00001000000403258748',
                }),
            ])
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SELLO03');
        assertStatusEqualsCode(Status.error(), 'SELLO04');
    });

    test('fail when has cfdi registro fiscal and certificados do not match', async () => {
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [new CNode('registrofiscal:CFDIRegistroFiscal')]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SELLO03');
        assertStatusEqualsCode(Status.error(), 'SELLO04');
    });

    test('pass when has cfdi registro fiscal and cerficados match', async () => {
        getComprobante().addChild(
            new CNode('cfdi:Complemento', {}, [
                new CNode('registrofiscal:CFDIRegistroFiscal'),
                new Tfd11.TimbreFiscalDigital({
                    NoCertificadoSAT: '00001000000403258748',
                }),
            ])
        );

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'SELLO03');
        assertStatusEqualsCode(Status.none(), 'SELLO04');
    });
};

export { useSelloDigitalCertificadoWithCfdiRegistroFiscalTrait };
