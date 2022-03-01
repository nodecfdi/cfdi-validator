import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';

export abstract class AbstractVersion33 implements ValidatorInterface {
    public abstract validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void>;

    public canValidateCfdiVersion(version: string): boolean {
        return '3.3' === version;
    }
}
