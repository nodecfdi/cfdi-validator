import { Asserts } from '../../src/asserts';
import { Assert } from '../../src/assert';
import { Status } from '../../src/status';

describe('Asserts', () => {
    test('constructor', () => {
        const asserts = new Asserts();

        expect(asserts).toHaveLength(0);
        expect(asserts.hasErrors()).toBeFalsy();
    });

    test('must stop', () => {
        const asserts = new Asserts();

        //initialized on false
        expect(asserts.mustStop()).toBeFalsy();
        // set to true return previous status false
        expect(asserts.mustStop(true)).toBeFalsy();
        // current status is true
        expect(asserts.mustStop()).toBeTruthy();
        // set true return current status true
        expect(asserts.mustStop(true)).toBeTruthy();
        // set false return current status true
        expect(asserts.mustStop(false)).toBeTruthy();
        // check again current status false
        expect(asserts.mustStop()).toBeFalsy();
    });

    test('add error', () => {
        const asserts = new Asserts();
        const first = new Assert('TEST', 'test', Status.error());
        asserts.add(first);

        expect(asserts).toHaveLength(1);
        expect(asserts.hasErrors()).toBeTruthy();
        expect(asserts.hasStatus(Status.error())).toBeTruthy();
        expect(JSON.stringify(asserts.getFirstStatus(Status.error()))).toEqual(JSON.stringify(first));

        const second = new Assert('TEST', 'test', Status.ok());

        // this will set the new object in the index TEST without change the previous status
        asserts.add(second);
        expect(asserts).toHaveLength(1);
        expect(asserts).toHaveLength(1);
        expect(first.getTitle()).toBe('test');
        expect(JSON.stringify(first.getStatus())).toEqual(JSON.stringify(Status.error()));
        expect(asserts.getFirstStatus(Status.error())).toBeUndefined();
        expect(JSON.stringify(asserts.getFirstStatus(Status.ok()))).toEqual(JSON.stringify(second));

        // this will not remove anything since this object will not be found
        asserts.remove(first);
        expect(asserts).toHaveLength(1);

        // but not it will remove it since the same object is in the collection
        asserts.remove(second);
        expect(asserts).toHaveLength(0);
    });

    test('put and put status', () => {
        const asserts = new Asserts();

        // test insert by put
        const first = asserts.put('X01');
        expect(asserts).toHaveLength(1);

        // test insert by put
        const second = asserts.put('X02');
        expect(asserts).toHaveLength(2);

        // test insert by put on an existing key
        const retrievedOnOverride = asserts.put('X01', 'title', Status.warn(), 'explanation');
        expect(asserts).toHaveLength(2);
        expect(JSON.stringify(retrievedOnOverride)).toEqual(JSON.stringify(first));
        expect(first.getTitle()).toBe('title');
        expect(first.getExplanation()).toBe('explanation');
        expect(JSON.stringify(first.getStatus())).toEqual(JSON.stringify(Status.warn()));
        expect(JSON.stringify(asserts.get('X01'))).toEqual(JSON.stringify(first));

        // test put status on an existing key
        asserts.putStatus('X02', Status.ok(), 'baz baz baz');
        expect(second.getExplanation()).toBe('baz baz baz');
        expect(JSON.stringify(second.getStatus())).toEqual(JSON.stringify(Status.ok()));
        expect(JSON.stringify(asserts.get('X02'))).toEqual(JSON.stringify(second));

        // test put status on a non-existing key
        const third = asserts.putStatus('X03', Status.error(), 'third element');
        expect(asserts).toHaveLength(3);
        expect(third.getTitle()).toBe('');
        expect(third.getExplanation()).toBe('third element');
        expect(JSON.stringify(third.getStatus())).toEqual(JSON.stringify(Status.error()));
        expect(JSON.stringify(asserts.get('X03'))).toEqual(JSON.stringify(third));
    });

    test('get with not existent status', () => {
        const asserts = new Asserts();

        expect.hasAssertions();
        try {
            asserts.get('X02');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e).toHaveProperty('message', 'There is no assert with code X02');
        }
    });

    test('get by status', () => {
        const oks = { OK01: Status.ok(), OK02: Status.ok() };
        const errors = { ERROR01: Status.error(), ERROR02: Status.error() };
        const warnings = { WARN01: Status.warn(), WARN02: Status.warn() };
        const nones = { NONE01: Status.none(), NONE02: Status.none() };
        const assertsContents = { ...oks, ...errors, ...warnings, ...nones };
        const asserts = new Asserts();
        Object.entries(assertsContents).forEach(([code, status]) => {
            asserts.putStatus(code, status);
        });

        expect(asserts).toHaveLength(8);
        expect([...asserts.byStatus(Status.ok()).keys()]).toEqual(Object.keys(oks));
        expect([...asserts.byStatus(Status.error()).keys()]).toEqual(Object.keys(errors));
        expect([...asserts.byStatus(Status.warn()).keys()]).toEqual(Object.keys(warnings));
        expect([...asserts.byStatus(Status.none()).keys()]).toEqual(Object.keys(nones));
        expect([...asserts.oks().keys()]).toEqual(Object.keys(oks));
        expect([...asserts.errors().keys()]).toEqual(Object.keys(errors));
        expect([...asserts.warnings().keys()]).toEqual(Object.keys(warnings));
        expect([...asserts.nones().keys()]).toEqual(Object.keys(nones));
    });

    test('remove by code', () => {
        const asserts = new Asserts();
        asserts.putStatus('XXX');

        expect(asserts).toHaveLength(1);

        asserts.removeByCode('FOO');
        expect(asserts).toHaveLength(1);

        asserts.removeByCode('XXX');
        expect(asserts).toHaveLength(0);
    });

    test('remove all', () => {
        const asserts = new Asserts();
        for (let i = 1; i <= 5; i++) {
            asserts.putStatus(`${i}`);
        }
        expect(asserts).toHaveLength(5);
        asserts.removeAll();
        expect(asserts).toHaveLength(0);
    });

    test('import', () => {
        const source = new Asserts();
        source.mustStop(true);
        for (let i = 1; i <= 5; i++) {
            source.putStatus(`${i}`);
        }

        const destination = new Asserts();
        destination.import(source);
        expect(destination).toHaveLength(5);

        // when importing assert objects are cloned (not the same but equal);
        const firstSource = source.get('1');
        const firstDestination = destination.get('1');

        expect(firstDestination).not.toBe(firstSource);
        expect(firstDestination).toEqual(firstSource);
        expect(destination.mustStop()).toBe(source.mustStop());

        // import again but with mustStop as false
        source.mustStop(false);
        destination.import(source);
        expect(destination).toHaveLength(5);
        expect(destination.mustStop()).toBe(source.mustStop());
    });

    test('traversable', () => {
        const asserts = new Asserts();
        const first = asserts.putStatus('first');
        const second = asserts.putStatus('second');
        const third = asserts.putStatus('third');

        const currentAsserts = [...asserts.values()];

        expect(currentAsserts[0]).toBe(first);
        expect(currentAsserts[1]).toBe(second);
        expect(currentAsserts[2]).toBe(third);
    });

    test('other implements', () => {
        const asserts = new Asserts();
        expect(asserts.length).toBe(0);

        asserts.putStatus('first');
        expect(asserts.length).toBe(1);

        expect(asserts.hasWarnings()).toBeFalsy();

        expect([...asserts.entries()]).toHaveLength(1);
    });
});
