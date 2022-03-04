import { MultiValidator } from './multi-validator';
import { XmlFollowSchema } from './xml/xml-follow-schema';
import { ValidatorInterface } from './contracts/validator-interface';
import { XmlDefinition } from './cfdi40/xml/xml-definition';

import { ComprobanteDecimalesMoneda } from './cfdi33/standard/comprobante-decimales-moneda';
import { ComprobanteDescuento } from './cfdi33/standard/comprobante-descuento';
import { ComprobanteFormaPago } from './cfdi33/standard/comprobante-forma-pago';
import { ComprobanteImpuestos } from './cfdi33/standard/comprobante-impuestos';
import { ComprobanteTipoCambio } from './cfdi33/standard/comprobante-tipo-cambio';
import { ComprobanteTipoDeComprobante } from './cfdi33/standard/comprobante-tipo-de-comprobante';
import { ComprobanteTotal } from './cfdi33/standard/comprobante-total';
import { ConceptoDescuento } from './cfdi33/standard/concepto-descuento';
import { ConceptoImpuestos } from './cfdi33/standard/concepto-impuestos';
import { EmisorRegimenFiscal } from './cfdi33/standard/emisor-regimen-fiscal';
import { EmisorRfc } from './cfdi33/standard/emisor-rfc';
import { FechaComprobante } from './cfdi33/standard/fecha-comprobante';
import { ReceptorResidenciaFiscal } from './cfdi33/standard/receptor-residencia-fiscal';
import { ReceptorRfc } from './cfdi33/standard/receptor-rfc';
import { SelloDigitalCertificado } from './cfdi33/standard/sello-digital-certificado';
import { SumasConceptosComprobanteImpuestos } from './cfdi33/standard/sumas-conceptos-comprobante-impuestos';
import { TimbreFiscalDigitalSello } from './cfdi33/standard/timbre-fiscal-digital-sello';
import { TimbreFiscalDigitalVersion } from './cfdi33/standard/timbre-fiscal-digital-version';
import { CfdiRelacionados } from './cfdi33/recepcion-pagos/cfdi-relacionados';
import { ComplementoPagos } from './cfdi33/recepcion-pagos/complemento-pagos';
import { ComprobantePagos } from './cfdi33/recepcion-pagos/comprobante-pagos';
import { Conceptos } from './cfdi33/recepcion-pagos/conceptos';
import { Pago } from './cfdi33/recepcion-pagos/pago';
import { Pagos } from './cfdi33/recepcion-pagos/pagos';
import { UsoCfdi } from './cfdi33/recepcion-pagos/uso-cfdi';
import { SelloDigitalCertificado as SelloDigitalCertificado40 } from './cfdi40/standard/sello-digital-certificado';
import { TimbreFiscalDigitalSello as TimbreFiscalDigitalSello40 } from './cfdi40/standard/timbre-fiscal-digital-sello';
import { TimbreFiscalDigitalVersion as TimbreFiscalDigitalVersion40 } from './cfdi40/standard/timbre-fiscal-digital-version';

export class MultiValidatorFactory {
    public newCreated33(): MultiValidator {
        const multiValidator = new MultiValidator('3.3');
        multiValidator.add(new XmlFollowSchema());
        const standardFiles: ValidatorInterface[] = [
            new ComprobanteDecimalesMoneda(),
            new ComprobanteDescuento(),
            new ComprobanteFormaPago(),
            new ComprobanteImpuestos(),
            new ComprobanteTipoCambio(),
            new ComprobanteTipoDeComprobante(),
            new ComprobanteTotal(),
            new ConceptoDescuento(),
            new ConceptoImpuestos(),
            new EmisorRegimenFiscal(),
            new EmisorRfc(),
            new FechaComprobante(),
            new ReceptorResidenciaFiscal(),
            new ReceptorRfc(),
            new SelloDigitalCertificado(),
            new SumasConceptosComprobanteImpuestos(),
            new TimbreFiscalDigitalSello(),
            new TimbreFiscalDigitalVersion(),
        ];
        const recepcionFiles: ValidatorInterface[] = [
            new CfdiRelacionados(),
            new ComplementoPagos(),
            new ComprobantePagos(),
            new Conceptos(),
            new Pago(),
            new Pagos(),
            new UsoCfdi(),
        ];
        multiValidator.addMulti(...standardFiles);
        multiValidator.addMulti(...recepcionFiles);
        return multiValidator;
    }

    public newReceived33(): MultiValidator {
        return this.newCreated33();
    }

    public newCreated40(): MultiValidator {
        const multiValidator = new MultiValidator('4.0');
        multiValidator.add(new XmlFollowSchema());
        multiValidator.add(new XmlDefinition());
        const standardFiles = [
            new SelloDigitalCertificado40(),
            new TimbreFiscalDigitalSello40(),
            new TimbreFiscalDigitalVersion40(),
        ];
        multiValidator.addMulti(...standardFiles);
        return multiValidator;
    }

    public newReceived40(): MultiValidator {
        return this.newCreated40();
    }
}
