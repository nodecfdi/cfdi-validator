import { useValidate40TestCase } from '../validate40-test-case';
import { SelloDigitalCertificado } from '../../../../src/cfdi40/standard/sello-digital-certificado';
import { Status } from '../../../../src';

describe('SelloDigitalCertificado 40', () => {
    const {
        setValidator,
        getHydrater,
        setupCfdiFile,
        getComprobante,
        runValidate,
        assertStatusEqualsCode,
        getAsserts,
    } = useValidate40TestCase();

    let validator: SelloDigitalCertificado;
    beforeEach(() => {
        validator = new SelloDigitalCertificado();
        setValidator(validator);
        getHydrater().hydrate(validator);
    });

    test('object version', () => {
        expect(validator.canValidateCfdiVersion('4.0')).toBeTruthy();
    });

    test('validate bad sello', async () => {
        setupCfdiFile('cfdi40-valid.xml');
        getComprobante().set('Sello', getComprobante().get('Certificado'));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'SELLO08');
    });

    test('validate ok', async () => {
        setupCfdiFile('cfdi40-valid.xml');

        await runValidate();

        for (let i = 1; i <= 8; i++) {
            assertStatusEqualsCode(Status.ok(), `SELLO0${i}`);
        }

        expect(getAsserts()).toHaveLength(8);
    });
});
