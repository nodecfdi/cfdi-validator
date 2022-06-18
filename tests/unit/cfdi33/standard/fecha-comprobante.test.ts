import { useValidate33TestCase } from '../validate33-test-case';
import { FechaComprobante } from '../../../../src/cfdi33/standard/fecha-comprobante';
import { DateTime } from 'luxon';
import { Status } from '../../../../src';

describe('FechaComprobante', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode, getAsserts } = useValidate33TestCase();
    let validator: FechaComprobante;

    beforeEach(() => {
        validator = new FechaComprobante();
        setValidator(validator);
    });

    test('construct without arguments', () => {
        const expectedTolerance = 300;
        const expectedMaxTime = Date.now() + expectedTolerance;

        const validator = new FechaComprobante();

        expect(validator.canValidateCfdiVersion('3.3')).toBeTruthy();
        expect(validator.getMaximumDate() - expectedMaxTime <= 2).toBeTruthy();
        expect(validator.getTolerance()).toBe(expectedTolerance);
    });

    test('set maximum date', () => {
        const validator = new FechaComprobante();
        validator.setMaximumDate(0);
        expect(validator.getMaximumDate()).toBe(0);
    });

    test('set tolerance', () => {
        const validator = new FechaComprobante();
        validator.setTolerance(1000);
        expect(validator.getTolerance()).toBe(1000);
    });

    test('validate ok current date', async () => {
        const timestamp = Date.now();
        getComprobante33().addAttributes({
            Fecha: DateTime.fromMillis(timestamp).toFormat("yyyy-LL-dd'T'HH:mm:ss"),
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FECHA01');
        assertStatusEqualsCode(Status.ok(), 'FECHA02');
        expect(getAsserts().hasErrors()).toBeFalsy();
    });

    test('validate ok minimum date', async () => {
        const now = validator.getMinimumDate();
        getComprobante33().addAttributes({
            Fecha: DateTime.fromMillis(now).toFormat("yyyy-LL-dd'T'HH:mm:ss"),
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FECHA01');
        assertStatusEqualsCode(Status.ok(), 'FECHA02');
        expect(getAsserts().hasErrors()).toBeFalsy();
    });

    test('validate ok maximum date', async () => {
        const nowMax = validator.getMaximumDate();
        getComprobante33().addAttributes({
            Fecha: DateTime.fromMillis(nowMax).toFormat("yyyy-LL-dd'T'HH:mm:ss"),
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FECHA01');
        assertStatusEqualsCode(Status.ok(), 'FECHA02');
        expect(getAsserts().hasErrors()).toBeFalsy();
    });

    test('validate without fecha', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.error(), 'FECHA01');
        assertStatusEqualsCode(Status.none(), 'FECHA02');
    });

    test('validate empty fecha', async () => {
        getComprobante33().addAttributes({
            Fecha: '',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'FECHA01');
        assertStatusEqualsCode(Status.none(), 'FECHA02');
    });

    test('validate malformed fecha', async () => {
        getComprobante33().addAttributes({
            Fecha: 'YYYY-MM-DD hh:mm:ss',
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'FECHA01');
        assertStatusEqualsCode(Status.none(), 'FECHA02');
    });

    test('validate older fecha', async () => {
        getComprobante33().addAttributes({
            Fecha: '2017-06-30T23:59:59',
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FECHA01');
        assertStatusEqualsCode(Status.error(), 'FECHA02');
    });

    test('validate future fecha', async () => {
        getComprobante33().addAttributes({
            Fecha: DateTime.fromMillis(validator.getMaximumDate() + 1000).toFormat("yyyy-LL-dd'T'HH:mm:ss"),
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FECHA01');
        assertStatusEqualsCode(Status.error(), 'FECHA02');
    });
});
