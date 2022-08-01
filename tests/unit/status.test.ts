import { Status, StatusLvl } from '~/status';

describe('Status', () => {
    test('construct with invalid code', () => {
        const t = (): Status => new Status('foo');

        expect(t).toThrow(SyntaxError);
        expect(t).toThrow('The status is not one of the defined valid constants enum');
    });

    test('ok', () => {
        const statusOne = new Status(StatusLvl.OK);
        const statusTwo = Status.ok();

        expect(JSON.stringify(statusOne)).toEqual(JSON.stringify(statusTwo));
        expect(statusOne.isOk()).toBeTruthy();
        expect(statusOne.equalsTo(statusTwo)).toBeTruthy();
        expect(statusOne.equalsTo(Status.none())).toBeFalsy();
    });

    test('error', () => {
        const statusOne = new Status(StatusLvl.ERROR);
        const statusTwo = Status.error();

        expect(JSON.stringify(statusOne)).toEqual(JSON.stringify(statusTwo));
        expect(statusOne.isError()).toBeTruthy();
        expect(statusOne.equalsTo(statusTwo)).toBeTruthy();
        expect(statusOne.equalsTo(Status.none())).toBeFalsy();
    });

    test('warning', () => {
        const statusOne = new Status(StatusLvl.WARNING);
        const statusTwo = Status.warn();

        expect(JSON.stringify(statusOne)).toEqual(JSON.stringify(statusTwo));
        expect(statusOne.isWarning()).toBeTruthy();
        expect(statusOne.equalsTo(statusTwo)).toBeTruthy();
        expect(statusOne.equalsTo(Status.none())).toBeFalsy();
    });

    test('none', () => {
        const statusOne = new Status(StatusLvl.NONE);
        const statusTwo = Status.none();

        expect(JSON.stringify(statusOne)).toEqual(JSON.stringify(statusTwo));
        expect(statusOne.isNone()).toBeTruthy();
        expect(statusOne.equalsTo(statusTwo)).toBeTruthy();
        expect(statusOne.equalsTo(Status.ok())).toBeFalsy();
    });

    test('to string', () => {
        const status = Status.none();
        expect('' + status).toBe(StatusLvl.NONE);
    });

    test('conditional creation', () => {
        expect(JSON.stringify(Status.when(true))).toEqual(JSON.stringify(Status.ok()));
        expect(JSON.stringify(Status.when(false))).not.toEqual(JSON.stringify(Status.ok()));
        expect(JSON.stringify(Status.when(false))).toEqual(JSON.stringify(Status.error()));
        expect(JSON.stringify(Status.when(false, Status.warn()))).toEqual(JSON.stringify(Status.warn()));
    });

    test('comparable value', () => {
        expect(Status.ok().compareTo(Status.none())).toBeGreaterThan(0);
        expect(Status.none().compareTo(Status.warn())).toBeGreaterThan(0);
        expect(Status.warn().compareTo(Status.error())).toBeGreaterThan(0);
    });
});
