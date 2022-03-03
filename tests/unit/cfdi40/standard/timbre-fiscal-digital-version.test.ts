import { useValidate40TestCase } from '../validate40-test-case';
import { TimbreFiscalDigitalVersion } from '../../../../src/cfdi40/standard/timbre-fiscal-digital-version';
import { useTimbreFiscalDigital11VersionTestTrait } from '../../../common/timbre-fiscal-digital11-version-test-trait';

describe('TimbreFiscalDigitalVersion 40', () => {
    const { setValidator, runValidate, getComprobante, assertStatusEqualsCode } = useValidate40TestCase();

    beforeEach(() => {
        setValidator(new TimbreFiscalDigitalVersion());
    });

    useTimbreFiscalDigital11VersionTestTrait(runValidate, assertStatusEqualsCode, getComprobante);
});
