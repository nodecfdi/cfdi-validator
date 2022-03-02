import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { SumasConceptos } from '@nodecfdi/cfdiutils-elements';
import { Status } from '../../status';

/**
 * SumasConceptosComprobanteImpuestos
 *
 * Esta clase genera la suma de subtotal, descuento, total e impuestos a partir de las sumas de los conceptos.
 * Con estas sumas válidas contra los valores del comprobante, los valores de impuestos
 * y la lista de impuestos trasladados y retenidos
 *
 * Válida que:
 * - SUMAS01: La suma de los importes de conceptos es igual al subtotal del comprobante
 * - SUMAS02: La suma de los descuentos es igual al descuento del comprobante
 * - SUMAS03: El cálculo del total es igual al total del comprobante
 *
 * - SUMAS04: El cálculo de impuestos trasladados es igual al total de impuestos trasladados
 * - SUMAS05: Todos los impuestos trasladados existen en el comprobante
 * - SUMAS06: Todos los valores de los impuestos trasladados conciden con el comprobante
 * - SUMAS07: No existen más nodos de impuestos trasladados en el comprobante de los que se han calculado
 *
 * - SUMAS08: El cálculo de impuestos retenidos es igual al total de impuestos retenidos
 * - SUMAS09: Todos los impuestos retenidos existen en el comprobante
 * - SUMAS10: Todos los valores de los impuestos retenidos conciden con el comprobante
 * - SUMAS11: No existen más nodos de impuestos trasladados en el comprobante de los que se han calculado
 *
 * - SUMAS12: El cálculo del descuento debe ser menor o igual al cálculo del subtotal
 *
 * - Adicionalmente, para SUMAS06 y SUMAS10 se generan: SUMASxx:yyy donde
 *      - xx puede ser 06 o 10
 *      - yyy es el consecutivo de la línea del impuesto
 *      - Se valida que El importe dek impuesto del Grupo X Impuesto X Tipo factor X Tasa o cuota X
 *                 es igual al importe del nodo
 */
export class SumasConceptosComprobanteImpuestos extends AbstractDiscoverableVersion33 {
    private _comprobante!: CNodeInterface;
    private _asserts!: Asserts;
    private _sumasConceptos!: SumasConceptos;

    private registerAsserts(): void {
        const asserts: Record<string, string> = {
            SUMAS01: 'La suma de los importes de conceptos es igual a el subtotal del comprobante',
            SUMAS02: 'La suma de los descuentos es igual a el descuento del comprobante',
            SUMAS03: 'El cálculo del total es igual a el total del comprobante',
            SUMAS04: 'El cálculo de impuestos trasladados es igual a el total de impuestos trasladados',
            SUMAS05: 'Todos los impuestos trasladados existen en el comprobante',
            SUMAS06: 'Todos los valores de los impuestos trasladados conciden con el comprobante',
            SUMAS07: 'No existen más nodos de impuestos trasladados en el comprobante de los que se han calculado',
            SUMAS08: 'El cálculo de impuestos retenidos es igual a el total de impuestos retenidos',
            SUMAS09: 'Todos los impuestos retenidos existen en el comprobante',
            SUMAS10: 'Todos los valores de los impuestos retenidos conciden con el comprobante',
            SUMAS11: 'No existen más nodos de impuestos trasladados en el comprobante de los que se han calculado',
            SUMAS12: 'El cálculo del descuento debe ser menor o igual al cálculo del subtotal',
        };
        Object.entries(asserts).forEach(([code, title]) => {
            this._asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this._asserts = asserts;
        this._comprobante = comprobante;
        this.registerAsserts();

        this._sumasConceptos = new SumasConceptos(comprobante);
        this.validateSubTotal();
        this.validateDescuento();
        this.validateTotal();
        this.validateImpuestosTrasladados();
        this.validateTrasladosMatch();
        this.validateImpuestosRetenidos();
        this.validateRetencionesMatch();
        this.validateDescuentoLessOrEqualThanSubTotal();

        return Promise.resolve(undefined);
    }

    private validateSubTotal(): void {
        this.validateValues(
            'SUMAS01',
            'Calculado',
            this._sumasConceptos.getSubTotal(),
            'Comprobante',
            parseFloat(this._comprobante.attributes().get('SubTotal') || '0')
        );
    }

    private validateDescuento(): void {
        this.validateValues(
            'SUMAS02',
            'Calculado',
            this._sumasConceptos.getDescuento(),
            'Comprobante',
            parseFloat(this._comprobante.attributes().get('Descuento') || '0')
        );
    }

    private validateDescuentoLessOrEqualThanSubTotal(): void {
        const subtotal = parseFloat(this._comprobante.attributes().get('SubTotal') || '0');
        const descuento = parseFloat(this._comprobante.attributes().get('Descuento') || '0');
        this._asserts.putStatus(
            'SUMAS12',
            Status.when(subtotal >= descuento),
            `Subtotal: ${this._comprobante.attributes().get('SubTotal')}, Descuento: ${this._comprobante
                .attributes()
                .get('Descuento')}`
        );
    }

    private validateTotal(): void {
        this.validateValues(
            'SUMAS03',
            'Calculado',
            this._sumasConceptos.getTotal(),
            'Comprobante',
            parseFloat(this._comprobante.attributes().get('Total') || '0')
        );
    }

    private validateImpuestosTrasladados(): void {
        this.validateValues(
            'SUMAS04',
            'Calculado',
            this._sumasConceptos.getImpuestosTrasladados(),
            'Comprobante',
            parseFloat(this._comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosTrasladados') || '0')
        );
    }

    private validateImpuestosRetenidos(): void {
        this.validateValues(
            'SUMAS08',
            'Calculado',
            this._sumasConceptos.getImpuestosRetenidos(),
            'Comprobante',
            parseFloat(this._comprobante.searchAttribute('cfdi:Impuestos', 'TotalImpuestosRetenidos') || '0')
        );
    }

    private validateTrasladosMatch(): void {
        this.validateImpuestosMatch(
            5,
            'traslado',
            this._sumasConceptos.getTraslados(),
            ['cfdi:Impuestos', 'cfdi:Traslados', 'cfdi:Traslado'],
            ['Impuesto', 'TipoFactor', 'TasaOCuota']
        );
    }

    private validateRetencionesMatch(): void {
        this.validateImpuestosMatch(
            9,
            'retención',
            this._sumasConceptos.getRetenciones(),
            ['cfdi:Impuestos', 'cfdi:Retenciones', 'cfdi:Retencion'],
            ['Impuesto']
        );
    }

    private validateImpuestosMatch(
        assertOffset: number,
        type: string,
        expectedItems: Record<string, Record<string, string | number>>,
        impuestosPath: string[],
        impuestosKeys: string[]
    ): void {
        const extractedItems: Record<string, Record<string, unknown>> = {};
        this._comprobante.searchNodes(...impuestosPath).forEach((extracted) => {
            const newTemp: Record<string, unknown> = {};
            impuestosKeys.forEach((impuestoKey) => {
                newTemp[impuestoKey] = extracted.attributes().get(impuestoKey);
            });
            newTemp['Importe'] = extracted.attributes().get('Importe');
            newTemp['Encontrado'] = false;
            const newKey = SumasConceptos.impuestoKey(
                extracted.attributes().get('Impuesto') || '',
                extracted.attributes().get('TipoFactor') || '',
                extracted.attributes().get('TasaOCuota') || ''
            );
            extractedItems[newKey] = newTemp;
        });

        // check that all elements are found and mark extracted item as found
        let allExpectedAreFound = true;
        let allValuesMatch = true;
        let expectedOffSet = 0;
        Object.entries(expectedItems).forEach(([expectedKey, expectedItem]) => {
            expectedOffSet = expectedOffSet + 1;
            let extractedItem: Record<string, unknown>;
            if (!extractedItems[expectedKey]) {
                allExpectedAreFound = false;
                extractedItem = { Importe: '' };
            } else {
                // set found flag
                extractedItems[expectedKey]['Encontrado'] = true;
                // check value match
                extractedItem = extractedItems[expectedKey];
            }
            const code = `SUMAS${(assertOffset + 1).toString().padStart(2, '0')}:${expectedOffSet
                .toString()
                .padStart(3, '0')}`;
            const thisValueMatch = this.validateImpuestoImporte(type, code, expectedItem, extractedItem);
            allValuesMatch = allValuesMatch && thisValueMatch;
        });
        const extractedWithoutMatch = Object.values(extractedItems).reduce((a, b) => a + (b['Encontrado'] ? 0 : 1), 0);

        this._asserts.putStatus(`SUMAS${assertOffset.toString().padStart(2, '0')}`, Status.when(allExpectedAreFound));
        this._asserts.putStatus(`SUMAS${(assertOffset + 1).toString().padStart(2, '0')}`, Status.when(allValuesMatch));
        this._asserts.putStatus(
            `SUMAS${(assertOffset + 2).toString().padStart(2, '0')}`,
            Status.when(0 === extractedWithoutMatch),
            `No encontrados: ${extractedWithoutMatch}`
        );
    }

    private validateImpuestoImporte(
        type: string,
        code: string,
        expected: Record<string, unknown>,
        extracted: Record<string, unknown>
    ): boolean {
        let label = `Grupo ${type} Impuesto ${extracted['Impuesto']}`;
        if (expected['TipoFactor']) {
            label = `${label} Tipo factor ${expected['TipoFactor']}`;
        }
        if (expected['TasaOCuota']) {
            label = `${label} Tasa o cuota ${expected['TasaOCuota']}`;
        }
        this._asserts.put(code, `El importe del impuesto ${label} es igual a el importe del nodo`);
        return this.validateValues(
            code,
            'Calculado',
            parseFloat(`${expected['Importe']}`),
            'Encontrado',
            parseFloat(`${extracted['Importe']}`)
        );
    }

    private validateValues(
        code: string,
        expectedLabel: string,
        expectedValue: number,
        compareLabel: string,
        compareValue: number,
        errorStatus: Status | null = null
    ): boolean {
        const condition = this.compareImportesAreEqual(expectedValue, compareValue);
        this._asserts.putStatus(
            code,
            Status.when(condition, errorStatus),
            `${expectedLabel}: ${expectedValue}, ${compareLabel}: ${compareValue}`
        );
        return condition;
    }

    protected compareImportesAreEqual(first: number, second: number, delta: number | null = null): boolean {
        if (null === delta) {
            delta = 0.000001;
        }
        return Math.abs(first - second) <= delta;
    }

    public static createDiscovered(): ValidatorInterface {
        return new SumasConceptosComprobanteImpuestos();
    }
}
