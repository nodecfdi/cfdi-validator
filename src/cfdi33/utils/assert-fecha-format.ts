import { DateTime } from 'luxon';
import { Asserts } from '../../asserts';
import { Status } from '../../status';

export class AssertFechaFormat {
    public static assertFormat(asserts: Asserts, code: string, label: string, text: string): boolean {
        const hasFormat = AssertFechaFormat.hasFormat(text);
        asserts.put(
            code,
            `La fecha ${label} cumple con el formato`,
            Status.when(hasFormat),
            `Contenido del campo: "${text}"`
        );

        return hasFormat;
    }

    public static hasFormat(format: string): boolean {
        if ('' === format) {
            return false;
        }
        try {
            const rawDate = DateTime.fromISO(format);
            const value = rawDate.toMillis();
            const expectedFormat = DateTime.fromMillis(value).toFormat("yyyy-LL-dd'T'HH:mm:ss");

            return expectedFormat === format;
        } catch (e) {
            return false;
        }
    }
}
