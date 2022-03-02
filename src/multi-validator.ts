import { ValidatorInterface } from './contracts/validator-interface';
import { Asserts } from './asserts';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Hydrater } from './hydrater';

export class MultiValidator implements ValidatorInterface {
    private _validators: ValidatorInterface[] = [];
    private readonly _version: string;

    public get length(): number {
        return this._validators.length;
    }

    constructor(version: string) {
        this._version = version;
    }

    public getVersion(): string {
        return this._version;
    }

    public async validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        for (const validator of this._validators) {
            if (!validator.canValidateCfdiVersion(this.getVersion())) {
                continue;
            }
            const localAsserts = new Asserts();
            await validator.validate(comprobante, localAsserts);
            asserts.import(localAsserts);
            if (localAsserts.mustStop()) {
                break;
            }
        }
        return Promise.resolve();
    }

    public canValidateCfdiVersion(version: string): boolean {
        return this._version === version;
    }

    public hydrate(hydrater: Hydrater): void {
        this._validators.forEach((validator) => {
            hydrater.hydrate(validator);
        });
    }

    /**
     * Collection methods
     */

    public add(validator: ValidatorInterface): void {
        this._validators.push(validator);
    }

    public addMulti(...validators: ValidatorInterface[]): void {
        validators.forEach((validator) => {
            this.add(validator);
        });
    }

    public exists(validator: ValidatorInterface): boolean {
        return this.indexOf(validator) >= 0;
    }

    private indexOf(validator: ValidatorInterface): number {
        return this._validators.indexOf(validator);
    }

    public remove(validator: ValidatorInterface): void {
        const index = this.indexOf(validator);
        if (index >= 0) {
            this._validators.splice(index, 1);
        }
    }

    public removeAll(): void {
        this._validators = [];
    }

    // Iterators of MultiValidator
    public [Symbol.iterator](): IterableIterator<ValidatorInterface> {
        return this._validators[Symbol.iterator]();
    }

    public entries(): IterableIterator<[number, ValidatorInterface]> {
        return this._validators.entries();
    }

    public keys(): IterableIterator<number> {
        return this._validators.keys();
    }

    public values(): IterableIterator<ValidatorInterface> {
        return this._validators.values();
    }
}
