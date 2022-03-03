import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export abstract class AbstractVersion40 implements ValidatorInterface {
    public abstract validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void>;

    public canValidateCfdiVersion(version: string): boolean {
        return '4.0' === version;
    }
}
