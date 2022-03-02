import { useTestCase } from '../test-case';
import { MultiValidator } from '../../src/multi-validator';
import { ImplementationValidatorInterface } from '../fake-objects/implementation-validator-interface';
import { Asserts } from '../../src/asserts';
import { Status } from '../../src/status';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { Hydrater } from '../../src/hydrater';
import { ImplementationRequireXmlResolverInterface } from '../fake-objects/implementation-require-xml-resolver-interface';
import { ImplementationRequireXmlStringInterface } from '../fake-objects/implementation-require-xml-string-interface';
import { ValidatorInterface } from '../../src/contracts/validator-interface';

describe('MultiValidator', () => {
    const { newResolver } = useTestCase();

    test('construct', () => {
        const validator = new MultiValidator('3.2');

        expect(validator.canValidateCfdiVersion('3.2')).toBeTruthy();
        expect(validator.canValidateCfdiVersion('3.3')).toBeFalsy();
        expect(validator).toHaveLength(0);
    });

    test('validate', async () => {
        const validator = new MultiValidator('3.3');
        const first = new ImplementationValidatorInterface();
        first.assertsToImport = new Asserts();
        first.assertsToImport.putStatus('FIRST', Status.ok());

        const last = new ImplementationValidatorInterface();
        last.assertsToImport = new Asserts();
        last.assertsToImport.putStatus('LAST', Status.error());

        validator.addMulti(...[first, last]);

        const asserts = new Asserts();
        await validator.validate(new CNode('sample'), asserts);

        // test that all children has been executed
        for (const child of validator) {
            expect((child as ImplementationValidatorInterface).enterValidateMethod).toBeTruthy();
        }

        expect(asserts).toHaveLength(2);
        expect(asserts.exists('FIRST')).toBeTruthy();
        expect(asserts.exists('LAST')).toBeTruthy();
        expect(asserts.mustStop()).toBeFalsy();
    });

    test('validate changes must stop flag', async () => {
        const first = new ImplementationValidatorInterface();
        first.onValidateSetMustStop = true;
        const last = new ImplementationValidatorInterface();
        const asserts = new Asserts();

        const multiValidator = new MultiValidator('3.3');
        multiValidator.add(first);
        multiValidator.add(last);
        await multiValidator.validate(new CNode('sample'), asserts);

        // test that only first element was executed
        expect(asserts.mustStop()).toBeTruthy();
        expect(last.enterValidateMethod).toBeFalsy();
    });

    test('validate skips other versions', async () => {
        const first = new ImplementationValidatorInterface();
        const last = new ImplementationValidatorInterface();
        last.version = '3.2';
        const asserts = new Asserts();

        const multiValidator = new MultiValidator('3.3');
        multiValidator.add(first);
        multiValidator.add(last);
        await multiValidator.validate(new CNode('sample'), asserts);

        // test that only first element was executed
        expect(last.enterValidateMethod).toBeFalsy();
    });

    test('hydrate', () => {
        const hydrater = new Hydrater();
        const xmlString = '<root />';
        const xmlResolver = newResolver();
        hydrater.setXmlString(xmlString);
        hydrater.setXmlResolver(xmlResolver);

        const requireXmlResolver = new ImplementationRequireXmlResolverInterface();
        const requireXmlString = new ImplementationRequireXmlStringInterface();
        const multiValidator = new MultiValidator('3.3');
        multiValidator.addMulti(requireXmlResolver, requireXmlString);

        multiValidator.hydrate(hydrater);

        expect(xmlResolver).toBe(requireXmlResolver.getXmlResolver());
        expect(xmlString).toBe(requireXmlString.getXmlString());
    });

    /**
     * Collection tests
     */
    test('add and add multi', () => {
        const validator = new MultiValidator('3.3');
        const first = new ImplementationValidatorInterface();
        validator.add(first);
        expect(validator).toHaveLength(1);

        validator.addMulti(
            ...[
                new ImplementationValidatorInterface(),
                new ImplementationValidatorInterface(),
                new ImplementationValidatorInterface(),
            ]
        );
        expect(validator).toHaveLength(4);
    });

    test('exists', () => {
        const child = new ImplementationValidatorInterface();
        const validator = new MultiValidator('3.3');
        validator.add(child);
        expect(validator.exists(child)).toBeTruthy();
        expect(validator.exists(new ImplementationValidatorInterface())).toBeFalsy();
    });

    test('remove', () => {
        const child = new ImplementationValidatorInterface();
        const validator = new MultiValidator('3.3');
        validator.add(child);
        expect(validator.exists(child)).toBeTruthy();

        validator.remove(child);
        expect(validator.exists(child)).toBeFalsy();
        expect(validator).toHaveLength(0);
    });

    test('remove all', () => {
        const validator = new MultiValidator('3.3');
        validator.addMulti(
            ...[
                new ImplementationValidatorInterface(),
                new ImplementationValidatorInterface(),
                new ImplementationValidatorInterface(),
            ]
        );
        expect(validator).toHaveLength(3);

        validator.removeAll();
        expect(validator).toHaveLength(0);
    });

    test('traversable', () => {
        const validator = new MultiValidator('3.3');
        const first = new ImplementationValidatorInterface();
        const second = new ImplementationValidatorInterface();
        const third = new ImplementationValidatorInterface();
        validator.addMulti(...[first, second, third]);

        const current: ValidatorInterface[] = [];
        for (const item of validator) {
            current.push(item);
        }

        const expected = [first, second, third];
        expected.forEach((value, i) => {
            expect(current[i]).toBe(value);
        });
    });
});
