import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ComprobanteTipoDeComprobante
 *
 * Válida que:
 * - TIPOCOMP01: Si el tipo de comprobante es T, P ó N, entonces no debe existir las condiciones de pago
 * - TIPOCOMP02: Si el tipo de comprobante es T, P ó N, entonces no debe existir la definición de impuestos (CFDI33179)
 * - TIPOCOMP03: Si el tipo de comprobante es T ó P, entonces no debe existir la forma de pago
 * - TIPOCOMP04: Si el tipo de comprobante es T ó P, entonces no debe existir el método de pago (CFDI33123)
 * - TIPOCOMP05: Si el tipo de comprobante es T ó P, entonces no debe existir el descuento del comprobante (CFDI33110)
 * - TIPOCOMP06: Si el tipo de comprobante es T ó P, entonces no debe existir el descuento de los conceptos (CFDI33179)
 * - TIPOCOMP07: Si el tipo de comprobante es T ó P, entonces el subtotal debe ser cero (CFDI33108)
 * - TIPOCOMP08: Si el tipo de comprobante es T ó P, entonces el total debe ser cero
 * - TIPOCOMP09: Si el tipo de comprobante es I, E ó N, entonces el valor unitario de todos los conceptos
 *               debe ser mayor que cero
 * - TIPOCOMP010: Si el tipo de comprobante es N, entonces la moneda debe ser MXN
 */
export class ComprobanteTipoDeComprobante extends AbstractDiscoverableVersion33 {
    private registerAsserts(asserts: Asserts): void {
        const assertsDescriptions: Record<string, string> = {
            TIPOCOMP01: [
                'Si el tipo de comprobante es T, P ó N,',
                ' entonces no debe existir las condiciones de pago'
            ].join(''),
            TIPOCOMP02: [
                'Si el tipo de comprobante es T, P ó N,',
                ' entonces no debe existir la definición de impuestos (CFDI33179)'
            ].join(''),
            TIPOCOMP03: 'Si el tipo de comprobante es T ó P, entonces no debe existir la forma de pago',

            TIPOCOMP04: [
                'Si el tipo de comprobante es T ó P,',
                ' entonces no debe existir el método de pago (CFDI33123)'
            ].join(''),
            TIPOCOMP05: [
                'Si el tipo de comprobante es T ó P,',
                ' entonces no debe existir el descuento del comprobante (CFDI33110)'
            ].join(''),
            TIPOCOMP06: [
                'Si el tipo de comprobante es T ó P,',
                ' entonces no debe existir el descuento de los conceptos (CFDI33179)'
            ].join(''),
            TIPOCOMP07: 'Si el tipo de comprobante es T ó P, entonces el subtotal debe ser cero (CFDI33108)',
            TIPOCOMP08: 'Si el tipo de comprobante es T ó P entonces el total debe ser cero',

            TIPOCOMP09: [
                'Si el tipo de comprobante es I, E ó N,',
                ' entonces el valor unitario de todos los conceptos debe ser mayor que cero'
            ].join(''),

            TIPOCOMP10: 'Si el tipo de comprobante es N entonces, la moneda debe ser MXN'
        };
        Object.entries(assertsDescriptions).forEach(([code, title]) => {
            asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this.registerAsserts(asserts);

        const tipoComprobante = comprobante.get('TipoDeComprobante');

        if ('T' === tipoComprobante || 'P' === tipoComprobante || 'N' === tipoComprobante) {
            asserts.putStatus('TIPOCOMP01', Status.when(!comprobante.offsetExists('CondicionesDePago')));
            asserts.putStatus('TIPOCOMP02', Status.when(!comprobante.searchNode('cfdi:Impuestos')));
        }

        if ('T' === tipoComprobante || 'P' === tipoComprobante) {
            asserts.putStatus('TIPOCOMP03', Status.when(!comprobante.offsetExists('FormaPago')));
            asserts.putStatus('TIPOCOMP04', Status.when(!comprobante.offsetExists('MetodoPago')));
            asserts.putStatus('TIPOCOMP05', Status.when(!comprobante.offsetExists('Descuento')));
            asserts.putStatus('TIPOCOMP06', Status.when(this.checkConceptosDoesNotHaveDescuento(comprobante)));
            asserts.putStatus('TIPOCOMP07', Status.when(this.isZero(comprobante.get('SubTotal'))));
            asserts.putStatus('TIPOCOMP08', Status.when(this.isZero(comprobante.get('Total'))));
        }

        if ('I' === tipoComprobante || 'E' === tipoComprobante || 'N' === tipoComprobante) {
            asserts.putStatus(
                'TIPOCOMP09',
                Status.when(this.checkConceptosValorUnitarioIsGreaterThanZero(comprobante))
            );
        }

        if ('N' === tipoComprobante) {
            asserts.putStatus('TIPOCOMP10', Status.when('MXN' === comprobante.get('Moneda')));
        }

        return Promise.resolve();
    }

    protected checkConceptosDoesNotHaveDescuento(comprobante: CNodeInterface): boolean {
        for (const concepto of comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto')) {
            if (concepto.offsetExists('Descuento')) {
                return false;
            }
        }

        return true;
    }

    protected checkConceptosValorUnitarioIsGreaterThanZero(comprobante: CNodeInterface): boolean {
        for (const concepto of comprobante.searchNodes('cfdi:Conceptos', 'cfdi:Concepto')) {
            if (!this.isGreaterThanZero(concepto.get('ValorUnitario'))) {
                return false;
            }
        }

        return true;
    }

    protected isZero(value = ''): boolean {
        if ('' === value || isNaN(Number(value))) {
            return false;
        }

        return Math.abs(parseFloat(value)) < 0.0000001;
    }

    protected isGreaterThanZero(value = ''): boolean {
        if ('' === value || isNaN(Number(value))) {
            return false;
        }

        return Math.abs(parseFloat(value)) > 0.0000001;
    }

    public static createDiscovered(): ValidatorInterface {
        return new ComprobanteTipoDeComprobante();
    }
}
