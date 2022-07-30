import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion40 } from '../abstracts/abstract-discoverable-version40';
import { Asserts } from '../../asserts';
import { Status } from '../../status';
import { ValidatorInterface } from '../../contracts/validator-interface';

/**
 * XmlDefinition
 *
 * Válida que:
 * - XML01: El XML implementa el namespace %s con el prefijo cfdi
 * - XML02: El nodo principal se llama cfdi:Comprobante
 * - XML03: La versión es 4.0
 */
export class XmlDefinition extends AbstractDiscoverableVersion40 {
    private static CFDI40_NAMESPACE = 'http://www.sat.gob.mx/cfd/4';

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        asserts.put(
            'XML01',
            `El XML implementa el namespace ${XmlDefinition.CFDI40_NAMESPACE} con el prefijo cfdi.`,
            Status.when(XmlDefinition.CFDI40_NAMESPACE === comprobante.get('xmlns:cfdi')),
            `Valor de xmlns:cfdi: ${comprobante.get('xmlns:cfdi')}`
        );
        asserts.put(
            'XML02',
            'El nodo principal se llama cfdi:Comprobante',
            Status.when('cfdi:Comprobante' === comprobante.name()),
            `Nombre: ${comprobante.name()}`
        );
        asserts.put(
            'XML03',
            'La versión es 4.0',
            Status.when('4.0' === comprobante.get('Version')),
            `Version: ${comprobante.get('Version')}`
        );

        return Promise.resolve();
    }

    public static createDiscovered(): ValidatorInterface {
        return new XmlDefinition();
    }
}
