import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from '../abstract-pago-validator';
import { ValidateDoctoException } from './validate-docto-exception';

export abstract class AbstractDoctoRelacionadoValidator extends AbstractPagoValidator {
    private _pago!: CNodeInterface;

    private _index!: number;

    public abstract validateDoctoRelacionado(docto: CNodeInterface): boolean;

    public exception(message: string): ValidateDoctoException {
        const exception = new ValidateDoctoException(message);
        exception.setIndex(this.getIndex());
        exception.setValidatorCode(this.getCode());

        return exception;
    }

    public validatePago(_pago: CNodeInterface): boolean {
        throw new Error('This method must not be called');
    }

    public getPago(): CNodeInterface {
        return this._pago;
    }

    public setPago(pago: CNodeInterface): void {
        this._pago = pago;
    }

    public getIndex(): number {
        return this._index;
    }

    public setIndex(index: number): void {
        this._index = index;
    }
}
