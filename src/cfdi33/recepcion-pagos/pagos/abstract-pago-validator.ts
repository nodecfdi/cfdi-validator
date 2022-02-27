import { Asserts } from '../../../asserts';
import { Status } from '../../../status';
import { CNodeInterface, CurrencyDecimals } from '@nodecfdi/cfdiutils-common';
import { FormaPagoEntry } from '../helpers/forma-pago-entry';
import { FormaPagoCatalog } from '../helpers/forma-pago-catalog';
import { ValidatePagoException } from './validate-pago-exception';

export abstract class AbstractPagoValidator {
    protected code = '';
    protected title = '';

    public getCode(): string {
        return this.code;
    }

    public getTitle(): string {
        return this.title;
    }

    public registerInAssets(asserts: Asserts): void {
        asserts.put(this.getCode(), this.getTitle(), Status.ok());
    }

    /**
     * In this method is where all validations must occur
     *
     * @param pago
     * @throws {ValidatePagoException} Then validation fails
     * @throws {Error} In the implementer if it does not return TRUE
     */
    public abstract validatePago(pago: CNodeInterface): boolean;

    protected isGreaterThan(value: number, compare: number): boolean {
        return value - compare > 0.0000001;
    }

    protected isEqual(expected: number, value: number): boolean {
        return Math.abs(expected - value) < 0.0000001;
    }

    protected createCurrencyDecimals(currency: string): CurrencyDecimals {
        try {
            return CurrencyDecimals.newFromKnownCurrencies(currency);
        } catch (e) {
            return new CurrencyDecimals(currency || 'XXX', 0);
        }
    }

    protected createPaymentType(paymentType: string): FormaPagoEntry {
        try {
            return new FormaPagoCatalog().obtain(paymentType);
        } catch (e) {
            throw new ValidatePagoException(`La forma de pago "${paymentType}" no esta definida`);
        }
    }
}
