import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../asserts';

export interface ValidatorInterface {
    validate(comprobante: CNodeInterface, asserts: Asserts): void;

    canValidateCfdiVersion(version: string): boolean;
}
