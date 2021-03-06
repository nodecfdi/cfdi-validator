import { FormaPagoEntry, FormaPagoEntryInterface } from './forma-pago-entry';

export class FormaPagoCatalog {
    public obtain(key: string): FormaPagoEntry {
        const map: FormaPagoEntryInterface[] = [
            {
                key: '01',
                description: 'Efectivo',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '02',
                description: 'Cheque nominativo',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{11}|\d{18})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                allowPaymentSignature: false
            },
            {
                key: '03',
                description: 'Transferencia electrónica de fondos',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{10}|\d{16}|\d{18})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10}|\d{18})$/,
                allowPaymentSignature: true
            },
            {
                key: '04',
                description: 'Tarjeta de crédito',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{16})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                allowPaymentSignature: false
            },
            {
                key: '05',
                description: 'Monedero electrónico',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                allowPaymentSignature: false
            },
            {
                key: '06',
                description: 'Dinero electrónico',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{10})$/,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '08',
                description: 'Vales de despensa',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '12',
                description: 'Dación en pago',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '13',
                description: 'Pago por subrogación',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '14',
                description: 'Pago por consignación',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '15',
                description: 'Condonación',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '17',
                description: 'Compensación',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '23',
                description: 'Novación',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '24',
                description: 'Confusión',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '25',
                description: 'Remisión de deuda',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '26',
                description: 'Prescripción o caducidad',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '27',
                description: 'A satisfacción del acreedor',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '28',
                description: 'Tarjeta de débito',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{16})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                allowPaymentSignature: false
            },
            {
                key: '29',
                description: 'Tarjeta de servicios',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^(\d{15,16})$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^(\d{10,11}|\d{15,16}|\d{18}|[A-Z0-9_]{10,50})$/,
                allowPaymentSignature: false
            },
            {
                key: '30',
                description: 'Aplicación de anticipos',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '31',
                description: 'Intermediario pagos',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false
            },
            {
                key: '99',
                description: 'Por definir',
                useSenderRfc: true,
                useSenderAccount: true,
                useSenderAccountRegExp: /^S*$/,
                useReceiverRfc: true,
                useReceiverAccount: true,
                useReceiverAccountRegExp: /^S*$/,
                allowPaymentSignature: true
            }
        ];

        const keys = map.map((entry) => entry.key);
        const index = keys.findIndex((keyEntry) => keyEntry === key);
        if (index === -1) {
            throw new RangeError(`Key '${key}' was not found in the catalog`);
        }

        return new FormaPagoEntry(map[index]);
    }
}
