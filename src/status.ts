export enum StatusLvl {
    ERROR = 'ERROR',
    WARNING = 'WARN',
    NONE = 'NONE',
    OK = 'OK'
}

export class Status {
    private readonly _status: StatusLvl;

    constructor(value: string) {
        if (
            value !== StatusLvl.ERROR &&
            value !== StatusLvl.WARNING &&
            value !== StatusLvl.OK &&
            value !== StatusLvl.NONE
        ) {
            throw new SyntaxError('The status is not one of the defined valid constants enum');
        }
        this._status = value;
    }

    public static ok(): Status {
        return new Status(StatusLvl.OK);
    }

    public static error(): Status {
        return new Status(StatusLvl.ERROR);
    }

    public static warn(): Status {
        return new Status(StatusLvl.WARNING);
    }

    public static none(): Status {
        return new Status(StatusLvl.NONE);
    }

    public isError(): boolean {
        return StatusLvl.ERROR === this._status;
    }

    public isWarning(): boolean {
        return StatusLvl.WARNING === this._status;
    }

    public isOk(): boolean {
        return StatusLvl.OK === this._status;
    }

    public isNone(): boolean {
        return StatusLvl.NONE === this._status;
    }

    public static when(condition: boolean, errorStatus: Status | null = null): Status {
        return condition ? Status.ok() : errorStatus || Status.error();
    }

    public equalsTo(status: Status): boolean {
        return status._status === this._status;
    }

    public compareTo(status: Status): number {
        return Math.sign(Status.comparableValue(this) - Status.comparableValue(status));
    }

    public static comparableValue(status: Status): number {
        return Object.values(StatusLvl).indexOf(status._status) + 1;
    }

    public toString = (): string => {
        return this._status;
    };
}
