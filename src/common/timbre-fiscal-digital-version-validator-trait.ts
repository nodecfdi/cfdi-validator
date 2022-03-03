import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../asserts';
import { Status } from '../status';

export abstract class TimbreFiscalDigitalVersionValidatorTrait {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        asserts.put('TFDVERSION01', 'Si existe el complemento timbre fiscal digital, entonces su versión debe ser 1.1');

        const tfdVersion = comprobante.searchNode('cfdi:Complemento', 'tfd:TimbreFiscalDigital');
        if (tfdVersion) {
            asserts.putStatus('TFDVERSION01', Status.when('1.1' === tfdVersion.get('Version')));
        }

        return Promise.resolve(undefined);
    }
}
