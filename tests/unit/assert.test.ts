import { Status, StatusLvl, Assert } from '../../src';

describe('Assert', () => {
    test('constructor', () => {
        const assert = new Assert('X');

        expect(assert.getCode()).toBe('X');
        expect(assert.getTitle()).toBe('');
        expect(JSON.stringify(assert.getStatus())).toEqual(JSON.stringify(Status.none()));
        expect(assert.getExplanation()).toBe('');
    });

    test('constructor with values', () => {
        const assert = new Assert('CODE', 'Title', Status.ok(), 'Explanation');

        expect(assert.getCode()).toBe('CODE');
        expect(assert.getTitle()).toBe('Title');
        expect(JSON.stringify(assert.getStatus())).toEqual(JSON.stringify(Status.ok()));
        expect(assert.getExplanation()).toBe('Explanation');
    });

    test('constructor with empty status throw exception', () => {
        expect.hasAssertions();
        try {
            new Assert('');
        } catch (e) {
            expect(e).toBeInstanceOf(SyntaxError);
            expect(e).toHaveProperty('message', 'Code cannot be an empty string');
        }
    });

    test('set title', () => {
        const assert = new Assert('X');
        expect(assert.getTitle()).toBe('');

        assert.setTitle('Title');
        expect(assert.getTitle()).toBe('Title');
    });

    test('set status without explanation', () => {
        const assert = new Assert('X');
        assert.setExplanation('Explanation');
        const expectedStatus = Status.ok();

        assert.setStatus(Status.ok());
        expect(JSON.stringify(assert.getStatus())).toEqual(JSON.stringify(expectedStatus));
        expect(assert.getExplanation()).toBe('Explanation');
    });

    test('set status with explanation', () => {
        const assert = new Assert('X');
        assert.setExplanation('Explanation');
        const expectedStatus = Status.ok();
        expect(assert.getExplanation()).toBe('Explanation');

        assert.setStatus(Status.ok(), 'Changed explanation');
        expect(JSON.stringify(assert.getStatus())).toEqual(JSON.stringify(expectedStatus));
        expect(assert.getExplanation()).toBe('Changed explanation');
    });

    test('set explanation', () => {
        const assert = new Assert('X');
        assert.setExplanation('Explanation');
        expect(assert.getExplanation()).toBe('Explanation');
    });

    test('to string', () => {
        const assert = new Assert('CODE', 'Title', Status.ok());
        const value = '' + assert;

        expect(value.includes('CODE')).toBeTruthy();
        expect(value.includes('Title')).toBeTruthy();
        expect(value.includes(StatusLvl.OK)).toBeTruthy();
    });
});
