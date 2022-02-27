import { ValidatePagoException } from '../validate-pago-exception';

export class ValidateDoctoException extends ValidatePagoException {
    private _index!: number;
    private _validatorCode!: string;

    public setIndex(index: number): ValidateDoctoException {
        this._index = index;
        return this;
    }

    public setValidatorCode(validatorCode: string): ValidateDoctoException {
        this._validatorCode = validatorCode;
        return this;
    }

    public getIndex(): number {
        return this._index;
    }

    public getValidatorCode(): string {
        return this._validatorCode;
    }
}
