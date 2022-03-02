import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { Status } from '../../status';
import { Rfc } from '@nodecfdi/rfc';

/**
 * ReceptorRfc
 *
 * Válida que:
 *  - RECRFC01: El RFC del receptor del comprobante debe ser válido
 */
export class ReceptorRfc extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('RECRFC01', 'El RFC del receptor del comprobante debe ser válido');

        const receptorRfc = comprobante.searchAttribute('cfdi:Receptor', 'Rfc');

        try {
            Rfc.checkIsValid(receptorRfc);
        } catch (e) {
            assert.setStatus(Status.error(), `Rfc: "${receptorRfc}". ${(e as Error).message}`);
            return Promise.resolve();
        }

        assert.setStatus(Status.ok());

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new ReceptorRfc();
    }
}
