import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNode, CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * ReceptorResidenciaFiscal
 *
 * Válida que:
 * - RESFISC01: Si el RFC no es XEXX010101000, entonces la residencia fiscal no debe existir (CFDI33134)
 * - RESFISC02: Si el RFC sí es XEXX010101000 y existe el complemento de comercio exterior,
 *              entonces la residencia fiscal debe establecerse y no puede ser "MEX" (CFDI33135 y CFDI33136)
 * - RESFISC03: Si el RFC sí es XEXX010101000 y se registró el número de registro de identificación fiscal,
 *              entonces la residencia fiscal debe establecerse y no puede ser "MEX" (CFDI33135 y CFDI33136)
 */
export class ReceptorResidenciaFiscal extends AbstractDiscoverableVersion33 {
    private registerAsserts(asserts: Asserts): void {
        const assertsDescriptions: Record<string, string> = {
            RESFISC01: 'Si el RFC no es XEXX010101000, entonces la residencia fiscal no debe existir (CFDI33134)',
            RESFISC02: [
                'Si el RFC sí es XEXX010101000 y existe el complemento de comercio exterior,',
                ' entonces la residencia fiscal debe establecerse y no puede ser "MEX" (CFDI33135 y CFDI33136)',
            ].join(''),
            RESFISC03: [
                'Si el RFC sí es XEXX010101000 y se registró el número de registro de identificación fiscal,',
                ' entonces la residencia fiscal debe establecerse y no puede ser "MEX" (CFDI33135 y CFDI33136)',
            ].join(''),
        };
        Object.entries(assertsDescriptions).forEach(([code, title]) => {
            asserts.put(code, title);
        });
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this.registerAsserts(asserts);

        let receptor = comprobante.searchNode('cfdi:Receptor');
        if (!receptor) {
            receptor = new CNode('cfdi:Receptor');
        }

        if ('XEXX010101000' !== receptor.attributes().get('Rfc')) {
            asserts.putStatus('RESFISC01', Status.when(!receptor.attributes().has('ResidenciaFiscal')));
        }

        const existsComercioExterior = !!comprobante.searchNode('cfdi:Complemento', 'cce11:ComercioExterrior');
        const isValidResidenciaFiscal =
            '' !== receptor.attributes().get('ResidenciaFiscal') &&
            'MEX' !== receptor.attributes().get('ResidenciaFiscal');
        if (existsComercioExterior) {
            asserts.putStatus('RESFISC02', Status.when(isValidResidenciaFiscal));
        }
        if (receptor.attributes().has('NumRegIdTrib')) {
            asserts.putStatus('RESFISC03', Status.when(isValidResidenciaFiscal));
        }

        return Promise.resolve(undefined);
    }

    public static createDiscovered(): ValidatorInterface {
        return new ReceptorResidenciaFiscal();
    }
}
