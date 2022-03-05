import { useValidate33TestCase } from '../validate33-test-case';
import { ConceptoImpuestos } from '../../../../src/cfdi33/standard/concepto-impuestos';
import { Cfdi33 } from '@nodecfdi/cfdiutils-elements';
import { Status } from '../../../../src';

describe('ConceptoImpuestos', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode, getAsserts } = useValidate33TestCase();
    const validComprobante = (): Cfdi33.Comprobante => {
        const comprobante = getComprobante33();
        comprobante.addConcepto();
        comprobante
            .addConcepto()
            .multiTraslado(
                {
                    TipoFactor: 'Exento',
                    Base: '123.45',
                },
                {
                    Base: '123.45',
                    TipoFactor: 'Tasa',
                    TasaOCuota: '0.160000',
                    Importe: '19.75',
                }
            )
            .multiRetencion(
                {
                    Base: '0.000001',
                    TipoFactor: 'Tasa',
                    TasaOCuota: '0.02',
                    Importe: '1.23',
                },
                {
                    Base: '123.45',
                    TipoFactor: 'Cuota',
                }
            );
        return comprobante;
    };

    beforeEach(() => {
        setValidator(new ConceptoImpuestos());
    });

    test('invalid case no retencion or traslado', async () => {
        const comprobante = validComprobante();
        comprobante.addConcepto().getImpuestos();

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'CONCEPIMPC01');
    });

    test.each([['0'], ['0.0000001'], ['-1'], ['foo'], ['0.0.0.0']])(
        'traslado has base greater than zero invalid case',
        async (base) => {
            const comprobante = validComprobante();
            comprobante.addConcepto().addTraslado({ Base: base });

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'CONCEPIMPC02');
        }
    );

    test.each([
        ['1', '1'],
        [null, '1'],
        ['1', null],
    ])('traslado tipo factor exento invalid case', async (tasaOCuota: string | null, importe: string | null) => {
        const comprobante = validComprobante();
        comprobante.addConcepto().addTraslado({
            TipoFactor: 'Exento',
            TasaOCuota: tasaOCuota,
            Importe: importe,
        });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'CONCEPIMPC03');
    });

    const providerTrasladosTipoFactorTasaOCuotaInvalidCase = (): (string | null)[][] => {
        const tipoFactor = ['Tasa', 'Cuota'];
        const tasaOCuota = ['1', '', null];
        const importe = ['', null];
        const provider: (string | null)[][] = [];
        tipoFactor.forEach((tF) => {
            tasaOCuota.forEach((tOC) => {
                importe.forEach((imp) => {
                    provider.push([tF, tOC, imp]);
                });
            });
        });
        return provider;
    };

    test.each(providerTrasladosTipoFactorTasaOCuotaInvalidCase())(
        'traslados tipo factor tasa o cuota invalid case',
        async (tipoFactor, tasaOCuota, importe) => {
            const comprobante = validComprobante();
            comprobante.addConcepto().addTraslado({
                TipoFactor: tipoFactor,
                TasaOCuota: tasaOCuota,
                Importe: importe,
            });

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'CONCEPIMPC04');
        }
    );

    test.each([['0'], ['0.0000001'], ['-1'], ['foo'], ['0.0.0.0']])(
        'retenciones has base greater than zero invalid case',
        async (base) => {
            const comprobante = validComprobante();
            comprobante.addConcepto().addRetencion({ Base: base });

            await runValidate();

            assertStatusEqualsCode(Status.error(), 'CONCEPIMPC05');
        }
    );

    test('invalid case retencion tipo factor exento', async () => {
        const comprobante = validComprobante();
        comprobante.addConcepto().addRetencion({ TipoFactor: 'Exento' });

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'CONCEPIMPC06');
    });

    test('valid comprobante', async () => {
        validComprobante();

        await runValidate();

        expect(getAsserts().hasErrors()).toBeFalsy();
    });
});
