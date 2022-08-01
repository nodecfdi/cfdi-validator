import { DateTime } from 'luxon';
import { CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { Asserts } from '../../asserts';
import { AssertFechaFormat } from '../utils/assert-fecha-format';
import { Status } from '../../status';

/**
 * FechaComprobante
 *
 * Válida que:
 * - FECHA01: La fecha del comprobante cumple con el formato
 * - FECHA02: La fecha existe en el comprobante y es mayor que 2017-07-01 y menor que el futuro
 *      - La fecha en el futuro se puede configurar a un valor determinado
 *      - La fecha en el futuro es por defecto el momento de validación más una tolerancia
 *      - La tolerancia puede ser configurada y es por defecto 300 segundos
 */
export class FechaComprobante extends AbstractDiscoverableVersion33 {
    private _maximumDate?: number;

    /** Tolerancia en segundos */
    private _tolerance = 300;

    public getMinimumDate(): number {
        return DateTime.fromObject({
            hour: 0,
            minute: 0,
            second: 0,
            month: 7,
            day: 1,
            year: 2017
        }).toMillis();
    }

    public getMaximumDate(): number {
        if (this._maximumDate === undefined || isNaN(Number(this._maximumDate))) {
            return Date.now() + this.getTolerance();
        }

        return this._maximumDate;
    }

    public setMaximumDate(maximumDate: number | null = null): void {
        this._maximumDate = maximumDate !== null ? maximumDate : undefined;
    }

    public getTolerance(): number {
        return this._tolerance;
    }

    public setTolerance(tolerance: number): void {
        this._tolerance = tolerance;
    }

    public validate(comprobante: CNodeInterface, asserts: Asserts): Promise<void> {
        const fechaSource = comprobante.get('Fecha');
        const hasFormat = AssertFechaFormat.assertFormat(asserts, 'FECHA01', 'del comprobante', fechaSource);
        const assertBetween = asserts.put(
            'FECHA02',
            'La fecha existe en el comprobante y es mayor que 2017-07-01 y menor que el futuro'
        );
        if (!hasFormat) {
            return Promise.resolve();
        }

        const exists = comprobante.offsetExists('Fecha');
        const testDate = '' !== fechaSource ? DateTime.fromISO(fechaSource).toMillis() : 0;

        const minimumDate = this.getMinimumDate();
        const maximumDate = this.getMaximumDate();

        assertBetween.setStatus(
            Status.when(testDate >= minimumDate && testDate <= maximumDate),
            `Fecha: "${fechaSource}" (${exists ? 'Existe' : 'No existe'}), Máxima: ${DateTime.fromMillis(
                maximumDate
            ).toFormat('yyyy-LL-dd HH:mm:ss')}`
        );

        return Promise.resolve();
    }
}
