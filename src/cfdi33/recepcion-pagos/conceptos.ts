import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

/**
 * Conceptos
 * En un CFDI de recepción de pagos el Concepto del CFDI debe tener datos fijos,
 * puede ver el problema específico en la explicación del issue
 *
 * - PAGCON01: Se debe usar el concepto predefinido (CRP107 - CRP121)
 */
export class Conceptos extends AbstractRecepcionPagos10 {
    public static REQUIRED_CLAVEPRODSERV = '84111506';

    public static REQUIRED_CANTIDAD = '1';

    public static REQUIRED_CLAVEUNIDAD = 'ACT';

    public static REQUIRED_DESCRIPCION = 'Pago';

    public static REQUIRED_VALORUNITARIO = '0';

    public static REQUIRED_IMPORTE = '0';

    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const assert = asserts.put('PAGCON01', 'Se debe usar el concepto predefinido (CRP107 - CRP121)');
        // get conceptos
        try {
            this.checkConceptos(comprobante);
        } catch (e) {
            assert.setStatus(Status.error(), (e as Error).message);
            return Promise.resolve();
        }
        assert.setStatus(Status.ok());
        return Promise.resolve();
    }

    protected checkConceptos(comprobante: CNodeInterface): void {
        const conceptos = comprobante.searchNode('cfdi:Conceptos');
        if (!conceptos) {
            throw new Error('No se encontró el nodo Conceptos');
        }
        // check conceptos count
        const conceptosCount = conceptos.children().length;
        if (1 !== conceptosCount) {
            throw new Error(`Se esperaba encontrar un solo hijo de conceptos, se encontraron  ${conceptosCount}`);
        }
        // check it contains a Concepto
        const concepto = conceptos.searchNode('cfdi:Concepto');
        if (!concepto) {
            throw new Error('No se encontró el nodo Concepto');
        }
        // check concepto does not have any children
        const conceptoCount = concepto.children().length;
        if (0 !== conceptoCount) {
            throw new Error(`Se esperaba encontrar ningún hijo de concepto, se encontraron ${conceptoCount}`);
        }
        if (Conceptos.REQUIRED_CLAVEPRODSERV !== concepto.attributes().get('ClaveProdServ')) {
            throw new Error(
                `La clave del producto o servicio debe ser "${
                    Conceptos.REQUIRED_CLAVEPRODSERV
                }" y se registró "${concepto.attributes().get('ClaveProdServ')}"`
            );
        }
        if (concepto.attributes().has('NoIdentificacion')) {
            throw new Error('No debe existir el número de identificación');
        }
        if (Conceptos.REQUIRED_CANTIDAD !== concepto.attributes().get('Cantidad')) {
            throw new Error(
                `La cantidad debe ser "${Conceptos.REQUIRED_CANTIDAD}" y se registró ${concepto
                    .attributes()
                    .get('Cantidad')}`
            );
        }
        if (Conceptos.REQUIRED_CLAVEUNIDAD !== concepto.attributes().get('ClaveUnidad')) {
            throw new Error(
                `La clave de unidad debe ser "${Conceptos.REQUIRED_CLAVEUNIDAD}" y se registró ${concepto
                    .attributes()
                    .get('ClaveUnidad')}`
            );
        }
        if (concepto.attributes().has('Unidad')) {
            throw new Error('No debe existir la unidad');
        }
        if (Conceptos.REQUIRED_DESCRIPCION !== concepto.attributes().get('Descripcion')) {
            throw new Error(
                `La descripción debe ser "${Conceptos.REQUIRED_DESCRIPCION}" y se registró "${concepto
                    .attributes()
                    .get('Descripcion')}"`
            );
        }
        if (Conceptos.REQUIRED_VALORUNITARIO !== concepto.attributes().get('ValorUnitario')) {
            throw new Error(
                `El valor unitario debe ser "${Conceptos.REQUIRED_VALORUNITARIO}" y se registró "${concepto
                    .attributes()
                    .get('ValorUnitario')}"`
            );
        }
        if (Conceptos.REQUIRED_IMPORTE !== concepto.attributes().get('Importe')) {
            throw new Error(
                `El importe debe ser "${Conceptos.REQUIRED_IMPORTE}" y se registró "${concepto
                    .attributes()
                    .get('Importe')}"`
            );
        }
        if (concepto.attributes().has('Descuento')) {
            throw new Error('No debe existir descuento');
        }
    }

    public static createDiscovered(): ValidatorInterface {
        return new Conceptos();
    }
}
