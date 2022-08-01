/* eslint-disable jest/expect-expect */
import { useValidate33TestCase } from '../validate33-test-case';
import { SelloDigitalCertificado } from '~/cfdi33/standard/sello-digital-certificado';
import { Status } from '~/status';

describe('SelloDigitalCertificado', () => {
    const {
        setValidator,
        getHydrater,
        setupCfdiFile,
        getComprobante,
        runValidate,
        assertStatusEqualsCode,
        getAsserts
    } = useValidate33TestCase();

    let validator: SelloDigitalCertificado;
    beforeEach(() => {
        validator = new SelloDigitalCertificado();
        setValidator(validator);
        getHydrater().hydrate(validator);
    });

    test('object version', () => {
        expect(validator.canValidateCfdiVersion('3.3')).toBeTruthy();
    });

    test('validate bad sello', async () => {
        setupCfdiFile('cfdi33-valid.xml');
        getComprobante().attributes().set('Sello', getComprobante().attributes().get('Certificado'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SELLO08');
    });

    test('validate ok', async () => {
        setupCfdiFile('cfdi33-valid.xml');

        await runValidate();

        for (let i = 1; i <= 8; i++) {
            assertStatusEqualsCode(Status.ok(), `SELLO0${i}`);
        }

        expect(getAsserts()).toHaveLength(8);
    });
});
