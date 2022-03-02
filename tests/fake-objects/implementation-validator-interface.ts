import { ValidatorInterface } from '../../src/contracts/validator-interface';
import { Asserts } from '../../src/asserts';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

export class ImplementationValidatorInterface implements ValidatorInterface {
    public version = '3.3';
    public onValidateSetMustStop = false;
    public enterValidateMethod = false;
    public assertsToImport: Asserts | null = null;

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        if (this.assertsToImport instanceof Asserts) {
            asserts.import(this.assertsToImport);
        }
        this.enterValidateMethod = true;
        asserts.mustStop(this.onValidateSetMustStop);
        return Promise.resolve();
    }

    public canValidateCfdiVersion(version: string): boolean {
        return version === this.version;
    }
}
