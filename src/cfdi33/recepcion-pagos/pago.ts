import { AbstractRecepcionPagos10 } from '../abstracts/abstract-recepcion-pagos10';
import { ValidatorInterface } from '../../contracts/validator-interface';
import { Asserts } from '../../asserts';
import { AbstractPagoValidator } from './pagos/abstract-pago-validator';
import { Fecha } from './pagos/fecha';
import { FormaDePago } from './pagos/forma-de-pago';
import { MonedaPago } from './pagos/moneda-pago';
import { TipoCambioExists } from './pagos/tipo-cambio-exists';
import { TipoCambioValue } from './pagos/tipo-cambio-value';
import { MontoGreaterThanZero } from './pagos/monto-greater-than-zero';
import { MontoDecimals } from './pagos/monto-decimals';
import { MontoBetweenIntervalSumOfDocuments } from './pagos/monto-between-interval-sum-of-documents';
import { BancoOrdenanteRfcCorrecto } from './pagos/banco-ordenante-rfc-correcto';
import { BancoOrdenanteNombreRequerido } from './pagos/banco-ordenante-nombre-requerido';
import { BancoOrdenanteRfcProhibido } from './pagos/banco-ordenante-rfc-prohibido';
import { CuentaOrdenanteProhibida } from './pagos/cuenta-ordenante-prohibida';
import { CuentaOrdenantePatron } from './pagos/cuenta-ordenante-patron';
import { BancoBeneficiarioRfcCorrecto } from './pagos/banco-beneficiario-rfc-correcto';
import { BancoBeneficiarioRfcProhibido } from './pagos/banco-beneficiario-rfc-prohibido';
import { CuentaBeneficiariaProhibida } from './pagos/cuenta-beneficiaria-prohibida';
import { CuentaBeneficiariaPatron } from './pagos/cuenta-beneficiaria-patron';
import { TipoCadenaPagoProhibido } from './pagos/tipo-cadena-pago-prohibido';
import { TipoCadenaPagoCertificado } from './pagos/tipo-cadena-pago-certificado';
import { TipoCadenaPagoCadena } from './pagos/tipo-cadena-pago-cadena';
import { TipoCadenaPagoSello } from './pagos/tipo-cadena-pago-sello';
import { DoctoRelacionado } from './pagos/docto-relacionado';
import { MontoGreaterOrEqualThanSumOfDocuments } from './pagos/monto-greater-or-equal-than-sum-of-documents';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { ValidateDoctoException } from './pagos/docto-relacionado/validate-docto-exception';
import { ValidatePagoException } from './pagos/validate-pago-exception';
import { Status } from '../../status';

/**
 * Pago - Válida los nodos de pago dentro del complemento de pagos
 *
 * Se generan mensajes de error en los pagos con clave:
 * PAGO??-XX donde '??', es el número de validación general y XX es el número del nodo con problemas
 *
 * Se generan mensajes de error en los documentos relacionados con clave:
 * PAGO??-XX-YY donde YY es el número del nodo con problemas
 */
export class Pago extends AbstractRecepcionPagos10 {
    /** This is the asserts object used in the validation process */
    private _asserts: Asserts = new Asserts();

    private _validators: AbstractPagoValidator[] | null = null;

    public createValidators(): AbstractPagoValidator[] {
        return [
            new Fecha(), // PAGO02
            new FormaDePago(), // PAGO03
            new MonedaPago(), // PAGO04
            new TipoCambioExists(), // PAGO05
            new TipoCambioValue(), // PAGO06
            new MontoGreaterThanZero(), // PAGO07
            new MontoDecimals(), // PAGO08
            new MontoBetweenIntervalSumOfDocuments(), // PAGO09
            new BancoOrdenanteRfcCorrecto(), // PAGO10
            new BancoOrdenanteNombreRequerido(), // PAGO11
            new BancoOrdenanteRfcProhibido(), // PAGO12
            new CuentaOrdenanteProhibida(), // PAGO13
            new CuentaOrdenantePatron(), // PAGO14
            new BancoBeneficiarioRfcCorrecto(), // PAGO15
            new BancoBeneficiarioRfcProhibido(), // PAGO16
            new CuentaBeneficiariaProhibida(), // PAGO017
            new CuentaBeneficiariaPatron(), // PAGO18
            new TipoCadenaPagoProhibido(), // PAGO19
            new TipoCadenaPagoCertificado(), // PAGO20
            new TipoCadenaPagoCadena(), // PAGO21
            new TipoCadenaPagoSello(), // PAGO22
            new DoctoRelacionado(), // PAGO23 ... PAGO29
            new MontoGreaterOrEqualThanSumOfDocuments(), // PAGO30
        ];
    }

    public getValidators(): AbstractPagoValidator[] {
        if (!this._validators) {
            this._validators = this.createValidators();
        }
        return this._validators;
    }

    public validateRecepcionPagos(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        this._asserts = asserts;

        // create pago validators array
        const validators = this.createValidators();

        // register pago validators array into asserts
        validators.forEach((validator) => {
            validator.registerInAssets(asserts);
        });

        // obtain the pago nodes
        const pagoNodes = comprobante.searchNodes('cfdi:Complemento', 'pago10:Pagos', 'pago10:Pago');
        pagoNodes.forEach((pagoNode, index) => {
            // pass each pago node throw validators
            validators.forEach((validator) => {
                try {
                    if (!validator.validatePago(pagoNode)) {
                        throw new Error(`The validation of pago ${index} ${validator.constructor.name} retrun false`);
                    }
                } catch (e) {
                    if (e instanceof ValidateDoctoException) {
                        this.setDoctoRelacionadoStatus(
                            e.getValidatorCode(),
                            index,
                            e.getIndex(),
                            e.getStatus(),
                            e.message
                        );
                    } else if (e instanceof ValidatePagoException) {
                        this.setPagoStatus(validator.getCode(), index, e.getStatus(), e.message);
                    }
                }
            });
        });
        return Promise.resolve();
    }

    private setPagoStatus(code: string, index: number, errorStatus: Status, explanation = ''): void {
        const assert = this._asserts.get(code);
        assert.setStatus(errorStatus);
        this._asserts.put(
            `${assert.getCode()}-${index.toString().padStart(2, '0')}`,
            assert.getTitle(),
            errorStatus,
            explanation
        );
    }

    private setDoctoRelacionadoStatus(
        code: string,
        pagoIndex: number,
        doctoIndex: number,
        errorStatus: Status,
        explanation = ''
    ): void {
        const assert = this._asserts.get(code);
        const doctoCode = `${assert.getCode()}-${pagoIndex.toString().padStart(2, '0')}-${doctoIndex
            .toString()
            .padStart(2, '0')}`;
        this.setPagoStatus(code, pagoIndex, errorStatus);
        this._asserts.put(doctoCode, assert.getTitle(), errorStatus, explanation);
    }

    public static createDiscovered(): ValidatorInterface {
        return new Pago();
    }
}
