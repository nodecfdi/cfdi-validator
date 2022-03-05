import { useValidateComplementoPagosTestCase } from './validate-complemento-pagos-test-case';
import { Cfdi33 } from '@nodecfdi/cfdiutils-elements';
import { Conceptos } from '../../../../src/cfdi33/recepcion-pagos/conceptos';
import { Status } from '../../../../src';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('Conceptos', () => {
    const {
        getComprobante33,
        setValidator,
        runValidate,
        assertStatusEqualsCode,
        getAssertByCodeOrFail,
        assertStatusEqualsAssert,
    } = useValidateComplementoPagosTestCase();
    let concepto: Cfdi33.Concepto;

    beforeEach(() => {
        setValidator(new Conceptos());

        // set up a valid case an in the test change to make it fail
        const comprobante = getComprobante33();
        concepto = comprobante.addConcepto({
            ClaveProdServ: Conceptos.REQUIRED_CLAVEPRODSERV,
            ClaveUnidad: Conceptos.REQUIRED_CLAVEUNIDAD,
            Descripcion: Conceptos.REQUIRED_DESCRIPCION,
            Cantidad: Conceptos.REQUIRED_CANTIDAD,
            ValorUnitario: Conceptos.REQUIRED_VALORUNITARIO,
            Importe: Conceptos.REQUIRED_IMPORTE,
        });
    });

    test('valid case', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'PAGCON01');
    });

    test('conceptos not exists', async () => {
        const comprobante = getComprobante33();
        comprobante.children().remove(comprobante.getConceptos());

        await runValidate();

        const assert = getAssertByCodeOrFail('PAGCON01');
        assertStatusEqualsAssert(Status.error(), assert);
        expect(assert.getExplanation()).toContain('No se encontró el nodo Conceptos');
    });

    test('conceptos zero children', async () => {
        const comprobante = getComprobante33();
        comprobante.getConceptos().children().removeAll();

        await runValidate();

        const assert = getAssertByCodeOrFail('PAGCON01');
        assertStatusEqualsAssert(Status.error(), assert);
        expect(assert.getExplanation()).toContain('Se esperaba encontrar un solo hijo de conceptos');
    });

    test('conceptos children more than one', async () => {
        const comprobante = getComprobante33();
        comprobante.addConcepto();

        await runValidate();

        const assert = getAssertByCodeOrFail('PAGCON01');
        assertStatusEqualsAssert(Status.error(), assert);
        expect(assert.getExplanation()).toContain('Se esperaba encontrar un solo hijo de conceptos');
    });

    test('conceptos child is not concepto', async () => {
        const comprobante = getComprobante33();
        const conceptos = comprobante.getConceptos();
        conceptos.children().removeAll();
        conceptos.addChild(new CNode('cfd:foo'));

        await runValidate();

        const assert = getAssertByCodeOrFail('PAGCON01');
        assertStatusEqualsAssert(Status.error(), assert);
        expect(assert.getExplanation()).toContain('No se encontró el nodo Concepto');
    });

    test('concepto with children', async () => {
        concepto.addChild(new CNode('cfdi:foo'));

        await runValidate();

        const assert = getAssertByCodeOrFail('PAGCON01');
        assertStatusEqualsAssert(Status.error(), assert);
        expect(assert.getExplanation()).toContain('Se esperaba encontrar ningún hijo de concepto');
    });

    const providerConceptoInvalidData = (): (string | null)[][] => {
        const first = ['ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Descripcion', 'ValorUnitario', 'Importe'];
        const second = [null, '', '_'];
        const result: (string | null)[][] = [];
        first.forEach((attribute) => {
            second.forEach((value: string | null) => {
                result.push([attribute, value]);
            });
        });
        return result;
    };

    test.each(providerConceptoInvalidData())(
        'concepto invalid data %s',
        async (attribute: string | null, value: string | null) => {
            concepto.attributes().set(attribute || '', value);

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'PAGCON01');
        }
    );

    test.each([['NoIdentificacion'], ['Unidad'], ['Descuento']])(
        'concepto invalid data must not exists %s',
        async (attribute) => {
            concepto.attributes().set(attribute, '');

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'PAGCON01');
        }
    );
});
