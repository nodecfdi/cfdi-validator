export interface FormaPagoEntryInterface {
    key: string;
    description: string;
    useSenderRfc: boolean;
    useSenderAccount: boolean;
    useSenderAccountRegExp?: RegExp;
    useReceiverRfc: boolean;
    useReceiverAccount: boolean;
    useReceiverAccountRegExp?: RegExp;
    allowPaymentSignature: boolean;
}

export class FormaPagoEntry {
    private readonly _key: string;
    private readonly _description: string;
    private readonly _allowSenderRfc: boolean;
    private readonly _allowSenderAccount: boolean;
    private readonly _senderAccountPattern: RegExp;
    private readonly _allowReceiverRfc: boolean;
    private readonly _allowReceiverAccount: boolean;
    private readonly _receiverAccountPattern: RegExp;
    private readonly _allowPaymentSignature: boolean;

    constructor(entry: FormaPagoEntryInterface) {
        if ('' === entry.key) {
            throw new Error('The FormaPago key cannot be empty');
        }
        if ('' === entry.description) {
            throw new Error('The FormaPago description cannot be empty');
        }
        this._key = entry.key;
        this._description = entry.description;
        this._allowSenderRfc = entry.useSenderRfc;
        this._allowSenderAccount = entry.useSenderAccount;
        this._senderAccountPattern = this.pattern(entry.useSenderAccount, entry.useSenderAccountRegExp);
        this._allowReceiverRfc = entry.useReceiverRfc;
        this._allowReceiverAccount = entry.useReceiverAccount;
        this._receiverAccountPattern = this.pattern(entry.useReceiverAccount, entry.useReceiverAccountRegExp);
        this._allowPaymentSignature = entry.allowPaymentSignature;
    }

    protected pattern(allowed: boolean, pattern?: RegExp): RegExp {
        if (!allowed || !pattern) {
            return /^$/;
        }
        return pattern;
    }

    public key(): string {
        return this._key;
    }

    public description(): string {
        return this._description;
    }

    public allowSenderRfc(): boolean {
        return this._allowSenderRfc;
    }

    public allowSenderAccount(): boolean {
        return this._allowSenderAccount;
    }

    public senderAccountPattern(): RegExp {
        return this._senderAccountPattern;
    }

    public allowReceiverRfc(): boolean {
        return this._allowReceiverRfc;
    }

    public allowReceiverAccount(): boolean {
        return this._allowReceiverAccount;
    }

    public receiverAccountPattern(): RegExp {
        return this._receiverAccountPattern;
    }

    public allowPaymentSignature(): boolean {
        return this._allowPaymentSignature;
    }
}
