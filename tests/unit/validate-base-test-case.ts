import { ValidatorInterface } from '../../src/contracts/validator-interface';
import { CNode, CNodeInterface, XmlNodeUtils } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../src/asserts';
import { Assert } from '../../src/assert';
import { Status } from '../../src/status';
import { useTestCase } from '../test-case';
import { SaxonbCliBuilder, XmlResolver } from '@nodecfdi/cfdiutils-core';
import { Hydrater } from '../../src/hydrater';
import { readFileSync } from 'fs';

const useValidateBaseTestCase = (): {
    runValidate: () => Promise<void>;
    assertStatusEqualsCode: (expected: Status, code: string) => void;
    assertStatusEqualsAssert: (expected: Status, assert: Assert) => void;
    assertStatusEqualsStatus: (expected: Status, current: Status) => void;
    setValidator: (validator: ValidatorInterface) => void;
    setAsserts: (asserts: Asserts) => void;
    setComprobante: (comprobante: CNodeInterface) => void;
    getComprobante: () => CNodeInterface;
    getAsserts: () => Asserts;
    getAssertByCodeOrFail: (code: string) => Assert;
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
    setupCfdiFile(cfdiFile: string): void;
} => {
    const { utilAsset, newResolver } = useTestCase();

    let _validator: ValidatorInterface;
    let _comprobante: CNodeInterface;
    let _asserts: Asserts;
    let _hidrater: Hydrater;

    beforeEach(() => {
        _comprobante = new CNode('root');
        _asserts = new Asserts();
        _hidrater = new Hydrater();
        _hidrater.setXmlResolver(newResolver());
        _hidrater.setXsltBuilder(new SaxonbCliBuilder('/usr/bin/saxonb-xslt'));
    });

    const setupCfdiFile = (cfdiFile: string): void => {
        // setup hydrate and re-hydrate the validator
        const content = readFileSync(utilAsset(cfdiFile), 'binary');
        _hidrater.setXmlString(content);
        _hidrater.hydrate(_validator);

        // setup comprobante
        _comprobante = XmlNodeUtils.nodeFromXmlString(content);
    };

    const setValidator = (validator: ValidatorInterface): void => {
        _validator = validator;
    };

    const setComprobante = (comprobante: CNodeInterface): void => {
        _comprobante = comprobante;
    };

    const setAsserts = (asserts: Asserts): void => {
        _asserts = asserts;
    };

    const getComprobante = (): CNodeInterface => {
        return _comprobante;
    };

    const getAsserts = (): Asserts => {
        return _asserts;
    };

    const runValidate = (): Promise<void> => {
        return _validator.validate(_comprobante, _asserts);
    };

    const getAssertByCodeOrFail = (code: string): Assert => {
        if (!_asserts.exists(code)) {
            throw new Error(`Did not receive actual status for code '${code}', it may not exists`);
        }
        return _asserts.get(code);
    };

    const assertStatusEqualsAssert = (expected: Status, assert: Assert): void => {
        const actual = assert.getStatus();
        expect(expected.equalsTo(actual)).toBeTruthy();
    };

    const assertStatusEqualsStatus = (expected: Status, current: Status): void => {
        expect(current).toStrictEqual(current);
    };

    const assertStatusEqualsCode = (expected: Status, code: string): void => {
        const actualAssert = getAssertByCodeOrFail(code);
        assertStatusEqualsAssert(expected, actualAssert);
    };

    return {
        setAsserts,
        setComprobante,
        setValidator,
        getComprobante,
        getAsserts,
        runValidate,
        assertStatusEqualsCode,
        assertStatusEqualsAssert,
        assertStatusEqualsStatus,
        getAssertByCodeOrFail,
        utilAsset,
        newResolver,
        setupCfdiFile,
    };
};
export { useValidateBaseTestCase };
