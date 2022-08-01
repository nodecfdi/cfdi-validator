import { Mixin } from 'ts-mixer';
import { AbstractDiscoverableVersion33 } from '../abstracts/abstract-discoverable-version33';
import { RequireXmlResolverInterface } from '../../contracts/require-xml-resolver-interface';
import { RequireXsltBuilderInterface } from '../../contracts/require-xslt-builder-interface';
import { RequireXmlStringInterface } from '../../contracts/require-xml-string-interface';
import { SelloDigitalCertificadoValidatorTrait } from '../../common/sello-digital-certificado-validator-trait';

/**
 * SelloDigitalCertificado
 *
 * Válida que:
 * - SELLO01: Se puede obtener el certificado del comprobante
 * - SELLO02: El número de certificado del comprobante igual al encontrado en el certificado
 * - SELLO03: El RFC del comprobante igual al encontrado en el certificado
 * - SELLO04: El nombre del emisor del comprobante es igual al encontrado en el certificado
 * - SELLO05: La fecha del documento es mayor o igual a la fecha de inicio de vigencia del certificado
 * - SELLO06: La fecha del documento menor o igual a la fecha de fin de vigencia del certificado
 * - SELLO07: El sello del comprobante está en base 64
 * - SELLO08: El sello del comprobante coincide con el certificado y la cadena de origen generada
 */
class SelloDigitalCertificado
    extends Mixin(AbstractDiscoverableVersion33, SelloDigitalCertificadoValidatorTrait)
    implements RequireXmlStringInterface, RequireXmlResolverInterface, RequireXsltBuilderInterface {}

export { SelloDigitalCertificado };
