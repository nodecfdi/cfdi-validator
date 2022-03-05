import { useValidate33TestCase } from '../validate33-test-case';
import { ComplementoPagos } from '../../../../src/cfdi33/recepcion-pagos/complemento-pagos';
import { Pagos10 } from '@nodecfdi/cfdiutils-elements';
import { Status } from '../../../../src';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('ComplementoPagos', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    const setUpComplemento = (): Pagos10.Pagos => {
        const comprobante = getComprobante33();
        comprobante.attributes().set('TipoDeComprobante', 'P');

        const pagos = new Pagos10.Pagos();
        comprobante.addComplemento(pagos);

        return pagos;
    };

    beforeEach(() => {
        setValidator(new ComplementoPagos());
    });

    test('valid case with complemento', async () => {
        setUpComplemento();

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPPAG01');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG02');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG03');
    });

    test('valid case without complemento', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPPAG01');
        assertStatusEqualsCode(Status.none(), 'COMPPAG02');
        assertStatusEqualsCode(Status.none(), 'COMPPAG03');
    });

    test('without complemento', async () => {
        const comprobante = getComprobante33();
        comprobante.attributes().set('TipoDeComprobante', 'P');

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPPAG01');
        assertStatusEqualsCode(Status.none(), 'COMPPAG02');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG03');
    });

    test('without tipo de comprobante', async () => {
        const comprobante = getComprobante33();
        comprobante.addComplemento(new Pagos10.Pagos());

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPPAG01');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG02');
        assertStatusEqualsCode(Status.none(), 'COMPPAG03');
    });

    test('with invalid comprobante version', async () => {
        setUpComplemento();

        getComprobante33().attributes().set('Version', '3.2');

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPPAG01');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG02');
        assertStatusEqualsCode(Status.error(), 'COMPPAG03');
    });

    test('with invalid complemento version', async () => {
        const complemento = setUpComplemento();
        complemento.attributes().set('Version', '0.9');

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPPAG01');
        assertStatusEqualsCode(Status.error(), 'COMPPAG02');
        assertStatusEqualsCode(Status.ok(), 'COMPPAG03');
    });

    test('impuestos must not exists', async () => {
        setUpComplemento();

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'COMPPAG04');
    });

    test('impuestos must not exists but exists', async () => {
        const pagos = setUpComplemento();
        pagos.addChild(new CNode('pago10:Impuestos'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'COMPPAG04');
    });
});
