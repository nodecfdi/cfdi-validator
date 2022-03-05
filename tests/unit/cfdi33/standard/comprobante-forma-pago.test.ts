import { useValidate33TestCase } from '../validate33-test-case';
import { ComprobanteFormaPago } from '../../../../src/cfdi33/standard/comprobante-forma-pago';
import { Status } from '../../../../src';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('ComprobanteFormaPago', () => {
    const { setValidator, runValidate, assertStatusEqualsCode, getComprobante33 } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new ComprobanteFormaPago());
    });

    test('validate nothing when not forma pago and not complemento pago', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'FORMAPAGO01');
    });

    test('validate nothing when forma pago and not not complemento pago', async () => {
        getComprobante33().attributes().set('FormaPago', '01'); // efectivo

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'FORMAPAGO01');
    });

    test('validate ok when not forma pago and complemento pago', async () => {
        getComprobante33().addChild(new CNode('cfdi:Complemento')).addChild(new CNode('pago10:Pagos'));

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'FORMAPAGO01');
    });

    test('validate error when forma pago and complemento pago', async () => {
        getComprobante33().attributes().set('FormaPago', '01'); // efectivo
        getComprobante33().addChild(new CNode('cfdi:Complemento')).addChild(new CNode('pago10:Pagos'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'FORMAPAGO01');
    });
});
