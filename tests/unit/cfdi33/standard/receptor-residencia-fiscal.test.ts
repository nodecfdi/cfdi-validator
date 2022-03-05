import { useValidate33TestCase } from '../validate33-test-case';
import { ReceptorResidenciaFiscal } from '../../../../src/cfdi33/standard/receptor-residencia-fiscal';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../../../src';

describe('ReceptorResidenciaFiscal', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode, getAsserts } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ReceptorResidenciaFiscal());
    });

    test.each([
        // RESFISC01: Si el RFC no es XEXX010101000 entonces la residencia fiscal no debe existir
        [null, null, null, false, 'RESFISC01'],
        ['', null, null, false, 'RESFISC01'],
        ['XXXXXXXXXXXX', null, null, false, 'RESFISC01'],
        // RESFISC02: Si el RFC sí es XEXX010101000 y existe el complemento de comercio exterior
        // entonces la residencia fiscal debe establecerse y no puede ser "MEX"
        ['XEXX010101000', 'XXX', null, true, 'RESFISC02'],
        // RESFISC03: Si el RFC sí es XEXX010101000 y se registró el número de registro de identificación fiscal
        // entonces la residencia fiscal debe establecerse y no puede ser "MEX"
        ['XEXX010101000', 'XXX', '1234', false, 'RESFISC03'],
    ])(
        'valid case',
        async (
            receptorRfc: string | null,
            residenciaFiscal: string | null,
            numRegIdTrib: string | null,
            putComercioExterior: boolean,
            ok: string
        ) => {
            getComprobante33().addChild(
                new CNode('cfdi:Receptor', {
                    Rfc: receptorRfc,
                    ResidenciaFiscal: residenciaFiscal,
                    NumRegIdTrib: numRegIdTrib,
                })
            );
            if (putComercioExterior) {
                getComprobante33().addChild(new CNode('cfdi:Complemento', {}, [new CNode('cce11:ComercioExterior')]));
            }

            await runValidate();

            expect(getAsserts().hasErrors()).toBeFalsy();
            assertStatusEqualsCode(Status.ok(), ok);
        },
        5000
    );

    test.each([
        // RESFISC01: Si el RFC no es XEXX010101000 entonces la residencia fiscal no debe existir
        [null, '', null, false, 'RESFISC01'],
        ['', '', null, false, 'RESFISC01'],
        ['XXXXXXXXXXXX', '', null, false, 'RESFISC01'],
        [null, 'GER', null, false, 'RESFISC01'],
        ['', 'GER', null, false, 'RESFISC01'],
        ['XXXXXXXXXXXX', 'GER', null, false, 'RESFISC01'],
        // RESFISC02: Si el RFC sí es XEXX010101000 y existe el complemento de comercio exterior
        // entonces la residencia fiscal debe establecerse y no puede ser "MEX"
        ['XEXX010101000', null, null, true, 'RESFISC02'],
        ['XEXX010101000', '', null, true, 'RESFISC02'],
        ['XEXX010101000', 'MEX', null, true, 'RESFISC02'],
        // RESFISC03: Si el RFC sí es XEXX010101000 y se registró el número de registro de identificación fiscal
        // entonces la residencia fiscal debe establecerse y no puede ser "MEX"
        ['XEXX010101000', null, '1234', false, 'RESFISC03'],
        ['XEXX010101000', '', '1234', false, 'RESFISC03'],
        ['XEXX010101000', 'MEX', '1234', false, 'RESFISC03'],
    ])(
        'invalid case',
        async (
            receptorRfc: string | null,
            residenciaFiscal: string | null,
            numRegIdTrib: string | null,
            putComercioExterior: boolean,
            error: string
        ) => {
            getComprobante33().addChild(
                new CNode('cfdi:Receptor', {
                    Rfc: receptorRfc,
                    ResidenciaFiscal: residenciaFiscal,
                    NumRegIdTrib: numRegIdTrib,
                })
            );
            if (putComercioExterior) {
                getComprobante33().addChild(new CNode('cfdi:Complemento', {}, [new CNode('cce11:ComercioExterior')]));
            }

            await runValidate();

            assertStatusEqualsCode(Status.error(), error);
        },
        5000
    );

    test('valid case without receptor node', async () => {
        await runValidate();

        expect(getAsserts().hasErrors()).toBeFalsy();
    }, 5000);
});
