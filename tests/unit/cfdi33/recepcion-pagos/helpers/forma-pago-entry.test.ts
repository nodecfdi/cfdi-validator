import {
    FormaPagoEntry,
    FormaPagoEntryInterface,
} from '../../../../../src/cfdi33/recepcion-pagos/helpers/forma-pago-entry';

describe('FormaPagoEntry', () => {
    const createEntry = (
        key: string,
        description: string,
        useSenderRfc: boolean,
        useSenderAccount: boolean,
        useSenderAccountRegExp: RegExp | undefined,
        useReceiverRfc: boolean,
        useReceiverAccount: boolean,
        useReceiverAccountRegExp: RegExp | undefined,
        allowPaymentSignature: boolean
    ): FormaPagoEntryInterface => {
        return {
            key,
            description,
            useSenderRfc,
            useSenderAccount,
            useSenderAccountRegExp,
            useReceiverRfc,
            useReceiverAccount,
            useReceiverAccountRegExp,
            allowPaymentSignature,
        };
    };

    test.each([
        [createEntry('foo', 'bar', false, false, undefined, false, false, undefined, false)],
        [createEntry('foo', 'bar', true, false, undefined, false, false, undefined, false)],
        [createEntry('foo', 'bar', false, true, undefined, false, false, undefined, false)],
        [createEntry('foo', 'bar', false, true, /[0-9]+/, false, false, undefined, false)],
        [createEntry('foo', 'bar', false, false, /[0-9]+/, false, false, undefined, false)],
        [createEntry('foo', 'bar', false, false, undefined, true, false, undefined, false)],
        [createEntry('foo', 'bar', false, false, undefined, false, true, undefined, false)],
        [createEntry('foo', 'bar', false, false, undefined, false, true, /[0-9]+/, false)],
        [createEntry('foo', 'bar', false, false, undefined, false, false, /[0-9]+/, false)],
        [createEntry('foo', 'bar', false, false, undefined, false, false, undefined, true)],
    ])('construct valid object', (entry: FormaPagoEntryInterface) => {
        const paymentType = new FormaPagoEntry(entry);
        let expectedSenderAccountPattern = /^$/;
        if (entry.useSenderAccount && entry.useSenderAccountRegExp) {
            expectedSenderAccountPattern = entry.useSenderAccountRegExp;
        }
        let expectedReceiverAccountPattern = /^$/;
        if (entry.useReceiverAccount && entry.useReceiverAccountRegExp) {
            expectedReceiverAccountPattern = entry.useReceiverAccountRegExp;
        }

        expect(paymentType.key()).toBe(entry.key);
        expect(paymentType.description()).toBe(entry.description);
        expect(paymentType.allowSenderRfc()).toBe(entry.useSenderRfc);
        expect(paymentType.allowSenderAccount()).toBe(entry.useSenderAccount);
        expect(paymentType.senderAccountPattern()).toStrictEqual(expectedSenderAccountPattern);
        expect(paymentType.allowReceiverRfc()).toBe(entry.useReceiverRfc);
        expect(paymentType.allowReceiverAccount()).toBe(entry.useReceiverAccount);
        expect(paymentType.receiverAccountPattern()).toStrictEqual(expectedReceiverAccountPattern);
        expect(paymentType.allowPaymentSignature()).toBe(entry.allowPaymentSignature);
    });

    test('construct without key', () => {
        expect.hasAssertions();
        try {
            new FormaPagoEntry({
                key: '',
                description: 'bar',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false,
            });
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain(' key ');
        }
    });

    test('construct without description', () => {
        expect.hasAssertions();
        try {
            new FormaPagoEntry({
                key: 'foo',
                description: '',
                useSenderRfc: false,
                useSenderAccount: false,
                useSenderAccountRegExp: undefined,
                useReceiverRfc: false,
                useReceiverAccount: false,
                useReceiverAccountRegExp: undefined,
                allowPaymentSignature: false,
            });
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect((e as Error).message).toContain(' description ');
        }
    });
});
