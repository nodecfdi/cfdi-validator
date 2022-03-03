import { AbstractDoctoRelacionadoValidator } from './abstract-docto-relacionado-validator';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';

/**
 * PAGO29: En un documento relacionado, los importes de importe pagado, saldo anterior y saldo insoluto
 *         deben tener hasta la cantidad de decimales que soporte la moneda (CRP222, CRP224, CRP225)
 */
export class ImportesDecimales extends AbstractDoctoRelacionadoValidator {
    protected code = 'PAGO29';

    protected title = [
        'En un documento relacionado, los importes de importe pagado, saldo anterior y saldo insoluto',
        ' deben tener hasta la cantidad de decimales que soporte la moneda (CRP222, CRP224, CRP225)',
    ].join('');

    public validateDoctoRelacionado(docto: CNodeInterface): boolean {
        const currency = this.createCurrencyDecimals(docto.get('MonedaDR'));
        if (!currency.doesNotExceedDecimals(docto.get('ImpSaldoAnt') || '0')) {
            throw this.exception(`ImpSaldoAnt "${docto.get('ImpSaldoAnt')}", Decimales: ${currency.decimals()}`);
        }

        if (docto.offsetExists('ImpPagado') && !currency.doesNotExceedDecimals(docto.get('ImpPagado') || '0')) {
            throw this.exception(`ImpPagado: "${docto.get('ImpPagado')}", Decimales: ${currency.decimals()}`);
        }

        if (!currency.doesNotExceedDecimals(docto.get('ImpSaldoInsoluto') || '0')) {
            throw this.exception(
                `ImpSaldoInsoluto: "${docto.get('ImpSaldoInsoluto')}", Decimales: ${currency.decimals()}`
            );
        }
        return true;
    }
}
