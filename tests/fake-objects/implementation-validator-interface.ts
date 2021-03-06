import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '~/asserts';
import { ValidatorInterface } from '~/contracts/validator-interface';
export class ImplementationValidatorInterface implements ValidatorInterface {
    public version = '3.3';

    public onValidateSetMustStop = false;

    public enterValidateMethod = false;

    public assertsToImport: Asserts | null = null;

    public validate(_comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
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
