import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractPagoValidator } from './abstract-pago-validator';
import { AbstractDoctoRelacionadoValidator } from './docto-relacionado/abstract-docto-relacionado-validator';
import { Moneda } from './docto-relacionado/moneda';
import { TipoCambioRequerido } from './docto-relacionado/tipo-cambio-requerido';
import { TipoCambioValor } from './docto-relacionado/tipo-cambio-valor';
import { ImporteSaldoAnteriorValor } from './docto-relacionado/importe-saldo-anterior-valor';
import { ImportePagadoValor } from './docto-relacionado/importe-pagado-valor';
import { ImporteSaldoInsolutoValor } from './docto-relacionado/importe-saldo-insoluto-valor';
import { ImportesDecimales } from './docto-relacionado/importes-decimales';
import { ImportePagadoRequerido } from './docto-relacionado/importe-pagado-requerido';
import { NumeroParcialidadRequerido } from './docto-relacionado/numero-parcialidad-requerido';
import { ImporteSaldoAnteriorRequerido } from './docto-relacionado/importe-saldo-anterior-requerido';
import { ImporteSaldoInsolutoRequerido } from './docto-relacionado/importe-saldo-insoluto-requerido';
import { Asserts } from '../../../asserts';

export class DoctoRelacionado extends AbstractPagoValidator {
    protected validators: AbstractDoctoRelacionadoValidator[];

    constructor() {
        super();
        this.validators = this.createValidators();
    }

    public getValidators(): AbstractDoctoRelacionadoValidator[] {
        return this.validators;
    }

    public createValidators(): AbstractDoctoRelacionadoValidator[] {
        return [
            new Moneda(), // PAGO23
            new TipoCambioRequerido(), // PAGO24
            new TipoCambioValor(), // PAGO25
            new ImporteSaldoAnteriorValor(), // PAGO26
            new ImportePagadoValor(), // PAGO27
            new ImporteSaldoInsolutoValor(), // PAGO28
            new ImportesDecimales(), // PAGO29
            new ImportePagadoRequerido(), // PAGO30
            new NumeroParcialidadRequerido(), // PAGO31
            new ImporteSaldoAnteriorRequerido(), // PAGO32
            new ImporteSaldoInsolutoRequerido() // PAGO33
        ];
    }

    // override registerInAssets to add validators instead of itself
    public override registerInAssets(asserts: Asserts): void {
        this.validators.forEach((validator) => {
            validator.registerInAssets(asserts);
        });
    }

    public validatePago(pago: CNodeInterface): boolean {
        // when validate pago perform validators on all documents
        const validators = this.getValidators();
        pago.searchNodes('pago10:DoctoRelacionado').forEach((doctoRelacionado, index) => {
            validators.forEach((validator) => {
                validator.setPago(pago);
                validator.setIndex(index);
                validator.validateDoctoRelacionado(doctoRelacionado);
            });
        });

        return true;
    }
}
