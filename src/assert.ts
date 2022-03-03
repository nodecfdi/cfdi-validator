import { Status } from './status';

export class Assert {
    private _title: string;
    private _status!: Status;
    private _explanation: string;
    private readonly _code: string;

    /**
     * Assert constructor
     *
     * @param code
     * @param title
     * @param status If null the status will be NONE
     * @param explanation
     */
    constructor(code: string, title = '', status: Status | null = null, explanation = '') {
        if ('' == code) {
            throw new SyntaxError('Code cannot be an empty string');
        }
        this._code = code;
        this._title = title;
        this.setStatus(status || Status.none());
        this._explanation = explanation;
    }

    public getTitle(): string {
        return this._title;
    }

    public getStatus(): Status {
        return this._status;
    }

    public getExplanation(): string {
        return this._explanation;
    }

    public getCode(): string {
        return this._code;
    }

    public setTitle(title: string): void {
        this._title = title;
    }

    public setStatus(status: Status, explanation?: string): void {
        this._status = status;
        if (explanation) {
            this.setExplanation(explanation);
        }
    }

    public setExplanation(explanation: string): void {
        this._explanation = explanation;
    }

    public toString = (): string => {
        return `${this._status}: ${this._code} - ${this._title}`;
    };
}
