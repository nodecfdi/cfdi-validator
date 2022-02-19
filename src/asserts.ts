import { Assert } from './assert';
import { Status } from './status';

export class Asserts {
    private _assets: Map<string, Assert> = new Map();

    public get length(): number {
        return this._assets.size;
    }

    private _mustStop = false;

    /**
     * This will try to create a new assert or get and change assert with the same code
     * The new values are preserved, except if they are null
     *
     * @param code
     * @param title
     * @param status
     * @param explanation
     */
    public put(
        code: string,
        title: string | null = null,
        status: Status | null = null,
        explanation: string | null = null
    ): Assert {
        let assert: Assert;
        if (!this.exists(code)) {
            assert = new Assert(code, title ?? '', status, explanation ?? '');
            this.add(assert);
            return assert;
        }
        assert = this.get(code);
        if (title) {
            assert.setTitle(title);
        }
        if (status) {
            assert.setStatus(status);
        }
        if (explanation) {
            assert.setExplanation(explanation);
        }
        return assert;
    }

    /**
     * This will try to create a new assert or get and change assert with the same code
     * The new values are preserved, except if they are null
     *
     * @param code
     * @param status
     * @param explanation
     */
    public putStatus(code: string, status: Status | null = null, explanation: string | null = null): Assert {
        return this.put(code, null, status, explanation);
    }

    /**
     * Get and or set the flag that alerts about stop flow
     * Consider this flag as: "Something was found, you should not continue"
     *
     * @param newValue Value of the flag, if null then will not change the flag
     * @return the previous value of the flag
     */
    public mustStop(newValue: boolean | null = null): boolean {
        if (null == newValue) {
            return this._mustStop;
        }
        const previous = this._mustStop;
        this._mustStop = newValue;
        return previous;
    }

    public hasStatus(status: Status): boolean {
        return undefined !== this.getFirstStatus(status);
    }

    public hasErrors(): boolean {
        return this.hasStatus(Status.error());
    }

    public hasWarnings(): boolean {
        return this.hasStatus(Status.warn());
    }

    public getFirstStatus(status: Status): Assert | undefined {
        for (const [, assert] of this) {
            if (status.equalsTo(assert.getStatus())) {
                return assert;
            }
        }
        return undefined;
    }

    public byStatus(status: Status): Map<string, Assert> {
        return new Map([...this].filter(([, item]) => status.equalsTo(item.getStatus())));
    }

    public get(code: string): Assert {
        for (const [, assert] of this) {
            if (assert.getCode() === code) {
                return assert;
            }
        }
        throw new Error(`There is no assert with code ${code}`);
    }

    public exists(code: string): boolean {
        return this._assets.has(code);
    }

    public oks(): Map<string, Assert> {
        return this.byStatus(Status.ok());
    }

    public errors(): Map<string, Assert> {
        return this.byStatus(Status.error());
    }

    public warnings(): Map<string, Assert> {
        return this.byStatus(Status.warn());
    }

    public nones(): Map<string, Assert> {
        return this.byStatus(Status.none());
    }

    public add(assert: Assert): void {
        this._assets.set(assert.getCode(), assert);
    }

    private indexOf(assert: Assert): string {
        const index = [...this.values()].indexOf(assert);
        let indexKey = '';
        if (index !== -1) {
            indexKey = [...this.keys()][index];
        }
        return indexKey;
    }

    public remove(assert: Assert): void {
        const index = this.indexOf(assert);
        if (index !== '') {
            this._assets.delete(index);
        }
    }

    public removeByCode(code: string): void {
        this._assets.delete(code);
    }

    public removeAll(): void {
        this._assets.clear();
    }

    public import(asserts: Asserts): void {
        for (const [, assert] of asserts) {
            this.add(Object.assign(Object.create(Object.getPrototypeOf(assert)), assert));
        }
        this.mustStop(asserts.mustStop());
    }

    // Iterators of asserts
    public [Symbol.iterator](): IterableIterator<[string, Assert]> {
        return this._assets[Symbol.iterator]();
    }

    public entries(): IterableIterator<[string, Assert]> {
        return this._assets.entries();
    }

    public keys(): IterableIterator<string> {
        return this._assets.keys();
    }

    public values(): IterableIterator<Assert> {
        return this._assets.values();
    }
}
