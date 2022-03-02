import { MultiValidator } from './multi-validator';
import { XmlFollowSchema } from './xml/xml-follow-schema';
import { ValidatorInterface } from './contracts/validator-interface';

export class MultiValidatorFactory {
    public async newCreated33(): Promise<MultiValidator> {
        const multiValidator = new MultiValidator('3.3');
        multiValidator.add(new XmlFollowSchema());
        const standardFiles: ValidatorInterface[] = [
            new (await import('./cfdi33/standard/comprobante-decimales-moneda')).ComprobanteDecimalesMoneda(),
            new (await import('./cfdi33/standard/comprobante-descuento')).ComprobanteDescuento(),
            new (await import('./cfdi33/standard/comprobante-forma-pago')).ComprobanteFormaPago(),
            new (await import('./cfdi33/standard/comprobante-impuestos')).ComprobanteImpuestos(),
            new (await import('./cfdi33/standard/comprobante-tipo-cambio')).ComprobanteTipoCambio(),
            new (await import('./cfdi33/standard/comprobante-tipo-de-comprobante')).ComprobanteTipoDeComprobante(),
            new (await import('./cfdi33/standard/comprobante-total')).ComprobanteTotal(),
            new (await import('./cfdi33/standard/concepto-descuento')).ConceptoDescuento(),
            new (await import('./cfdi33/standard/concepto-impuestos')).ConceptoImpuestos(),
            new (await import('./cfdi33/standard/emisor-regimen-fiscal')).EmisorRegimenFiscal(),
            new (await import('./cfdi33/standard/emisor-rfc')).EmisorRfc(),
            new (await import('./cfdi33/standard/fecha-comprobante')).FechaComprobante(),
            new (await import('./cfdi33/standard/receptor-residencia-fiscal')).ReceptorResidenciaFiscal(),
            new (await import('./cfdi33/standard/receptor-rfc')).ReceptorRfc(),
            new (await import('./cfdi33/standard/sello-digital-certificado')).SelloDigitalCertificado(),
            new (
                await import('./cfdi33/standard/sumas-conceptos-comprobante-impuestos')
            ).SumasConceptosComprobanteImpuestos(),
            new (await import('./cfdi33/standard/timbre-fiscal-digital-sello')).TimbreFiscalDigitalSello(),
            new (await import('./cfdi33/standard/timbre-fiscal-digital-version')).TimbreFiscalDigitalVersion(),
        ];
        const recepcionFiles: ValidatorInterface[] = [
            new (await import('./cfdi33/recepcion-pagos/cfdi-relacionados')).CfdiRelacionados(),
            new (await import('./cfdi33/recepcion-pagos/complemento-pagos')).ComplementoPagos(),
            new (await import('./cfdi33/recepcion-pagos/comprobante-pagos')).ComprobantePagos(),
            new (await import('./cfdi33/recepcion-pagos/conceptos')).Conceptos(),
            new (await import('./cfdi33/recepcion-pagos/pago')).Pago(),
            new (await import('./cfdi33/recepcion-pagos/pagos')).Pagos(),
            new (await import('./cfdi33/recepcion-pagos/uso-cfdi')).UsoCfdi(),
        ];
        multiValidator.addMulti(...standardFiles);
        multiValidator.addMulti(...recepcionFiles);
        return multiValidator;
    }

    public newReceived33(): Promise<MultiValidator> {
        return this.newCreated33();
    }
}
