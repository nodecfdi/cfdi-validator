/* eslint-disable jest/expect-expect */
import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { CfdiRelacionados } from '~/cfdi33/recepcion-pagos/cfdi-relacionados';
import { Status } from '~/status';

describe('CfdiRelacionados', () => {
    const { runValidate, assertStatusEqualsCode, getComprobante33, setValidator } =
        useValidateComplementoPagosTestCase();

    beforeEach(() => {
        setValidator(new CfdiRelacionados());
    });

    test('valid tipo relacion', async () => {
        const comprobante = getComprobante33();
        comprobante.addCfdiRelacionados({
            TipoRelacion: '04'
        });

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'PAGREL01');
    });

    test('invalid tipo relacion', async () => {
        const comprobante = getComprobante33();
        comprobante.addCfdiRelacionados({
            TipoRelacion: 'XX'
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'PAGREL01');
    });

    test('without cfdi relacionados', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'PAGREL01');
    });
});
