import { Status } from '../../../status';

export class ValidatePagoException extends Error {
    private _status?: Status;

    public getStatus(): Status {
        return this._status || Status.error();
    }

    public setStatus(status: Status): ValidatePagoException {
        this._status = status;
        return this;
    }
}
