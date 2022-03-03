import { useValidate40TestCase } from '../validate40-test-case';
import { useTimbreFiscalDigital11SelloTestTrait } from '../../../common/timbre-fiscal-digital11-sello-test-trait';
import { TimbreFiscalDigitalSello } from '../../../../src/cfdi40/standard/timbre-fiscal-digital-sello';

describe('TimbreFiscalDigitalSello 40', () => {
    const { setValidator, getHydrater, runValidate, assertStatusEqualsCode, getComprobante, getAsserts, getValidator } =
        useValidate40TestCase();

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
