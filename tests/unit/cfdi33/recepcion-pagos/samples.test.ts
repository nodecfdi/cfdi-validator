import { existsSync, readFileSync } from 'fs';
import { install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { useTestCase } from '../../../test-case';
import { CfdiValidator33 } from '~/cfdi-validator33';
import { Status } from '~/status';

describe('samples', () => {
    const { utilAsset } = useTestCase();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test.each([
        ['sample-factura123.xml'],
        ['sample-facturador01.xml'],
        ['sample-facturador02.xml'],
        ['sample-validacfd01.xml'],
        ['sample-validacfd02.xml'],
        ['sample-validacfd03.xml'],
        ['sample-validacfd04.xml'],
        ['sample-validacfd05.xml']
    ])(
        'samples files',
        async (sampleName) => {
            const sampleFile = utilAsset('pagos10/' + sampleName);
            expect(existsSync(sampleFile)).toBeTruthy();

            const validator = new CfdiValidator33();
            const asserts = await validator.validateXml(readFileSync(sampleFile, 'utf-8'));

            // remove this assertions because we are using manipulated cfdi
            asserts.removeByCode('SELLO08');
            const errors = asserts.errors();
            if (errors.size !== 0) {
                console.log(`source: ${sampleName}`);
                asserts.errors().forEach((error) => {
                    console.log(`*** ${error.toString()} => ${error.getExplanation()}`);
                });
            }
            expect(asserts.hasErrors()).toBeFalsy();
        },
        50000
    );

    test('samples with errors', async () => {
        const sampleFile = utilAsset('pagos10/sample-errors.xml');
        expect(existsSync(sampleFile)).toBeTruthy();

        const validator = new CfdiValidator33();
        const asserts = await validator.validateXml(readFileSync(sampleFile, 'utf-8'));

        // remove this tests! we are using manipulated cfdi
        asserts.removeByCode('SELLO08');
        asserts.removeByCode('EMISORRFC01');

        // check that these codes are in error state
        const expectedErrorCodes = [
            'PAGO09', // MontoBetweenIntervalSumOfDocuments
            'PAGO09-00',
            'PAGO17', // CuentaBeneficiariaProhibida
            'PAGO17-00',
            'PAGO18', // CuentaBeneficiariaPatron
            'PAGO18-00',
            'PAGO28', // ImporteSaldoInsolutoValor
            'PAGO28-00',
            'PAGO28-00-00'
        ];
        expectedErrorCodes.forEach((expectedErrorCode) => {
            expect(asserts.get(expectedErrorCode).getStatus().equalsTo(Status.error())).toBeTruthy();
            asserts.removeByCode(expectedErrorCode);
        });
        expect(asserts.hasErrors()).toBeFalsy();
    }, 50000);
});
