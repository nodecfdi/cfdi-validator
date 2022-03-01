import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { CNodeInterface, CurrencyDecimals } from '@nodecfdi/cfdiutils-common';
import { Assert } from '../../assert';
import { Status } from '../../status';

/**
 * ComprobanteDecimalesMoneda
 *
 * Válida que:
 * - MONDEC01: El subtotal del comprobante no contiene más de los decimales de la moneda (CFDI33106)
 * - MONDEC02: El descuento del comprobante no contiene más de los decimales de la moneda (CFDI33111)
 * - MONDEC03: El total del comprobante no contiene más de los decimales de la moneda
 * - MONDEC04: El total de impuestos trasladados no contiene más de los decimales de la moneda (CFDI33182)
 * - MONDEC05: El total de impuestos retenidos no contiene más de los decimales de la moneda (CFDI33180)
 */
export class ComprobanteDecimalesMoneda extends AbstractDiscoverableVersion33 {
    private _asserts!: Asserts;
    private _currency!: CurrencyDecimals;

    private registerAsserts(): void {
        const asserts: Record<string, string> = {
            MONDEC01: 'El subtotal del comprobante no contiene más de los decimales de la moneda (CFDI33106)',
            MONDEC02: 'El descuento del comprobante no contiene más de los decimales de la moneda (CFDI33111)',
            MONDEC03: 'El total del comprobante no contiene más de los decimales de la moneda',
            MONDEC04: 'El total de impuestos trasladados no contiene más de los decimales de la moneda (CFDI33182)',
            MONDEC05: 'El total de impuestos retenidos no contiene más de los decimales de la moneda (CFDI33180)',
        };
        Object.entries(asserts).forEach(([code, title]) => {
            this._asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this._asserts = asserts;
        this.registerAsserts();

        try {
            this._currency = CurrencyDecimals.newFromKnownCurrencies(comprobante.attributes().get('Moneda') || '');
        } catch (e) {
            this._asserts.get('MONDEC01').setExplanation((e as Error).message);
            return Promise.resolve();
        }

        // SubTotal, Descuento, Total
        this.validateValue('MONDEC01', comprobante, 'SubTotal', true);
        this.validateValue('MONDEC02', comprobante, 'Descuento');
        this.validateValue('MONDEC03', comprobante, 'Total', true);

        const impuestos = comprobante.searchNode('cfdi:Impuestos');
        if (impuestos) {
            this.validateValue('MONDEC04', impuestos, 'TotalImpuestosTrasladados');
            this.validateValue('MONDEC05', impuestos, 'TotalImpuestosRetenidos');
        }
        return Promise.resolve();
    }

    private validateValue(code: string, node: CNodeInterface, attribute: string, required = false): Assert {
        return this._asserts.putStatus(
            code,
            Status.when(this.checkValue(node, attribute, required)),
            `Valor: "${node
                .attributes()
                .get(attribute)}", Moneda: "${this._currency.currency()}" - ${this._currency.decimals()} decimales`
        );
    }

    private checkValue(node: CNodeInterface, attribute: string, required: boolean): boolean {
        if (required && !node.attributes().has(attribute)) {
            return false;
        }
        return this._currency.doesNotExceedDecimals(node.attributes().get(attribute) || '');
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobanteDecimalesMoneda();
    }
}