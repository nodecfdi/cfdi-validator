import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * EmisorRegimenFiscal
 *
 * Válida que:
 *  - REGFIS01: El régimen fiscal contenga un valor apropiado según el tipo de RFC emisor (CFDI33130 y CFDI33131)
 *
 * Nota: No válida que el RFC sea válido, esa responsabilidad no es de este validador.
 */
export class EmisorRegimenFiscal extends AbstractDiscoverableVersion33 {
    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const regimenFiscal = comprobante.searchAttribute('cfdi:Emisor', 'RegimenFiscal');
        const emisorRfc = comprobante.searchAttribute('cfdi:Emisor', 'Rfc');

        const length = emisorRfc.length;
        let validCodes: string[];

        if (12 === length) {
            validCodes = ['601', '603', '609', '620', '623', '624', '628', '607', '610', '622', '626'];
        } else if (13 === length) {
            validCodes = [
                '605',
                '606',
                '608',
                '611',
                '612',
                '614',
                '616',
                '621',
                '629',
                '630',
                '615',
                '610',
                '622',
                '626',
            ];
        } else {
            validCodes = [];
        }

        asserts.put(
            'REGFIS01',
            'El régimen fiscal contenga un valor apropiado según el tipo de RFC emisor (CFDI33130 y CFDI33131)',
            Status.when(validCodes.includes(regimenFiscal.trim())),
            `Rfc: "${emisorRfc}", Regimen Fiscal: "${regimenFiscal}"`
        );

        return Promise.resolve(undefined);
    }

    public static createDiscovered(): ValidatorInterface {
        return new EmisorRegimenFiscal();
    }
}
