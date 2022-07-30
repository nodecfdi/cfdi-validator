import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Rfc } from '@nodecfdi/rfc';
import { Status } from '../../status';

/**
 * EmisorRfc
 *
 * Válida que:
 *  - EMISORRFC01: El RFC del emisor del comprobante debe ser válido y diferente de XAXX010101000 y XEXX010101000
 */
export class EmisorRfc extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put(
            'EMISORRFC01',
            'El RFC del emisor del comprobante debe ser válido y diferente de XAXX010101000 y XEXX010101000'
        );

        const emisorRfc = comprobante.searchAttribute('cfdi:Emisor', 'Rfc');
        try {
            Rfc.checkIsValid(emisorRfc, Rfc.DISALLOW_FOREIGN | Rfc.DISALLOW_GENERIC);
        } catch (e) {
            assert.setStatus(Status.error(), `Rfc: "${emisorRfc}". ${(e as Error).message}`);

            return Promise.resolve();
        }
        assert.setStatus(Status.ok());

        return Promise.resolve();
    }
}
