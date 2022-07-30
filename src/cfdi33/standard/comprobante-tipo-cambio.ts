import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ComprobanteTipoCambio
 *
 * Válida que:
 * - TIPOCAMBIO01: La moneda exista y no tenga un valor vacío
 * - TIPOCAMBIO02: Si la moneda es "MXN", entonces el tipo de cambio debe tener el valor "1"
 *                 o no debe existir (CFDI33113)
 * - TIPOCAMBIO03: Si la moneda es "XXX", entonces el tipo de cambio no debe existir (CFDI33115)
 * - TIPOCAMBIO04: Si la moneda no es "MXN" ni "XXX", entonces el tipo de cambio entonces
 *                 el tipo de cambio debe seguir el patrón [0-9]\{1,18\}(.[0-9]\{1,6\})? (CFDI33114, CFDI33117)
 */
export class ComprobanteTipoCambio extends AbstractDiscoverableVersion33 {
    private registerAssets(asserts: Asserts): void {
        const assertDescriptions: Record<string, string> = {
            TIPOCAMBIO01: 'La moneda exista y no tenga un valor vacío',
            TIPOCAMBIO02: [
                'Si la moneda es "MXN", entonces el tipo de cambio debe tener el valor "1"',
                ' o no debe existir (CFDI33113)'
            ].join(''),
            TIPOCAMBIO03: 'Si la moneda es "XXX", entonces el tipo de cambio no debe existir (CFDI33115)',
            TIPOCAMBIO04: [
                'Si la moneda no es "MXN" ni "XXX", entonces el tipo de cambio',
                ' debe seguir el patrón [0-9]{1,18}(.[0-9]{1,6}?) (CFDI33114, CFDI33117)'
            ].join('')
        };
        Object.entries(assertDescriptions).forEach(([code, title]) => {
            asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this.registerAssets(asserts);

        const existsTipoCambio = comprobante.offsetExists('TipoCambio');
        const tipoCambio = comprobante.get('TipoCambio');
        const moneda = comprobante.get('Moneda');

        asserts.putStatus('TIPOCAMBIO01', Status.when('' !== moneda));
        if ('' === moneda) {
            return Promise.resolve();
        }

        if ('MXN' === moneda) {
            asserts.putStatus(
                'TIPOCAMBIO02',
                Status.when(!existsTipoCambio || Math.abs(parseFloat(tipoCambio || '0') - 1) < 0.0000001)
            );
        }

        if ('XXX' === moneda) {
            asserts.putStatus('TIPOCAMBIO03', Status.when(!existsTipoCambio));
        }

        if ('MXN' !== moneda && 'XXX' !== moneda) {
            const pattern = /^\d{1,18}(\.\d{1,6})?$/;
            asserts.putStatus('TIPOCAMBIO04', Status.when(!!tipoCambio.match(pattern)));
        }

        return Promise.resolve();
    }
}
