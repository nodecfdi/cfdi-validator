import { useValidate33TestCase } from '../validate33-test-case';
import { TimbreFiscalDigitalVersion } from '../../../../src/cfdi33/standard/timbre-fiscal-digital-version';
import { useTimbreFiscalDigital11VersionTestTrait } from '../../../common/timbre-fiscal-digital11-version-test-trait';

describe('TimbreFiscalDigitalVersion', () => {
    const { setValidator, runValidate, getComprobante, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new TimbreFiscalDigitalVersion());
    });

    useTimbreFiscalDigital11VersionTestTrait(runValidate, assertStatusEqualsCode, getComprobante);
});
