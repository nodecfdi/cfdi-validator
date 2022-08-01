import { useValidate33TestCase } from '../validate33-test-case';
import { SelloDigitalCertificado } from '~/cfdi33/standard/sello-digital-certificado';
import { useSelloDigitalCertificadoWithCfdiRegistroFiscalTrait } from '../../../common/sello-digital-certificado-with-cfdi-registro-fiscal-trait';

describe('SelloDigitalCertificado with CfdiRegistroFiscal', () => {
    const {
        setValidator,
        getHydrater,
        utilAsset,
        setUpCertificado,
        runValidate,
        assertStatusEqualsCode,
        getComprobante
    } = useValidate33TestCase();
    beforeEach(() => {
        const validator = new SelloDigitalCertificado();
        setValidator(validator);
        getHydrater().hydrate(validator);

        const certfile = utilAsset('certs/00001000000403258748.cer');
        setUpCertificado(
            {},
            {
                Nombre: 'CARLOS CORTES SOTO',
                Rfc: 'COSC8001137NA'
            },
            certfile
        );
    });
    useSelloDigitalCertificadoWithCfdiRegistroFiscalTrait(runValidate, assertStatusEqualsCode, getComprobante);
});
