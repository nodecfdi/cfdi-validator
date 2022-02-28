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
        const currency = this.createCurrencyDecimals(docto.attributes().get('MonedaDR') || '');
        if (!currency.doesNotExceedDecimals(docto.attributes().get('ImpSaldoAnt') || '0')) {
            throw this.exception(
                `ImpSaldoAnt "${docto.attributes().get('ImpSaldoAnt')}", Decimales: ${currency.decimals()}`
            );
        }

        if (
            docto.attributes().has('ImpPagado') &&
            !currency.doesNotExceedDecimals(docto.attributes().get('ImpPagado') || '0')
        ) {
            throw this.exception(
                `ImpPagado: "${docto.attributes().get('ImpPagado')}", Decimales: ${currency.decimals()}`
            );
        }

        if (!currency.doesNotExceedDecimals(docto.attributes().get('ImpSaldoInsoluto') || '0')) {
            throw this.exception(
                `ImpSaldoInsoluto: "${docto.attributes().get('ImpSaldoInsoluto')}", Decimales: ${currency.decimals()}`
            );
        }
        return true;
    }
}
