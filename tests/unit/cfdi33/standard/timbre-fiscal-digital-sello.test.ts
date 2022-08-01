import { useValidate33TestCase } from '../validate33-test-case';
import { useTimbreFiscalDigital11SelloTestTrait } from '../../../common/timbre-fiscal-digital11-sello-test-trait';
import { TimbreFiscalDigitalSello } from '~/cfdi33/standard/timbre-fiscal-digital-sello';

describe('TimbreFiscalDigitalSello', () => {
    const { setValidator, getHydrater, runValidate, assertStatusEqualsCode, getComprobante, getAsserts, getValidator } =
        useValidate33TestCase();

    beforeEach(() => {
        const validator = new TimbreFiscalDigitalSello();
        setValidator(validator);
        getHydrater().hydrate(validator);
    });

    useTimbreFiscalDigital11SelloTestTrait(
        runValidate,
        assertStatusEqualsCode,
        getComprobante,
        getValidator,
        getAsserts
    );
});
