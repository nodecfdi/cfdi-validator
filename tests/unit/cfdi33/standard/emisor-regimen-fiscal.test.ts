import { useValidate33TestCase } from '../validate33-test-case';
import { EmisorRegimenFiscal } from '../../../../src/cfdi33/standard/emisor-regimen-fiscal';
import { CNode } from '@nodecfdi/cfdiutils-common';
import { Status } from '../../../../src';

describe('EmisorRegimenFiscal', () => {
    const { setValidator, getComprobante33, runValidate, assertStatusEqualsCode } = useValidate33TestCase();

    beforeEach(() => {
        setValidator(new EmisorRegimenFiscal());
    });

    test.each([
        // personas morales
        ['AAA010101AAA', '601'],
        ['AAA010101AAA', '603'],
        ['AAA010101AAA', '609'],
        ['AAA010101AAA', '610'],
        ['AAA010101AAA', '620'],
        ['AAA010101AAA', '622'],
        ['AAA010101AAA', '623'],
        ['AAA010101AAA', '624'],
        ['AAAA010101AA', '626'],
        ['AAA010101AAA', '628'],
        ['ÑAA010101AAA', '601'], // with Ñ
        // personas físicas
        ['AAAA010101AAA', '605'],
        ['AAAA010101AAA', '606'],
        ['AAAA010101AAA', '607'],
        ['AAAA010101AAA', '608'],
        ['AAAA010101AAA', '610'],
        ['AAAA010101AAA', '611'],
        ['AAAA010101AAA', '612'],
        ['AAAA010101AAA', '614'],
        ['AAAA010101AAA', '616'],
        ['AAAA010101AAA', '621'],
        ['AAAA010101AAA', '629'],
        ['AAAA010101AAA', '630'],
        ['AAAA010101AAA', '626'], // regimen RESICO
        ['AAAA010101AAA', '615'],
        ['ÑAAA010101AAA', '605'], // with Ñ
        ['AAA010000AAA', '601'], // RFC inválido, regimen válido persona moral
        ['AAAA010000AAA', '605'], // RFC inválido, regimen válido persona física
    ])('valid cases %s %s', async (emisorRfc, regimenFiscal) => {
        getComprobante33().addChild(
            new CNode('cfdi:Emisor', {
                RegimenFiscal: regimenFiscal,
                Rfc: emisorRfc,
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'REGFIS01');
    });

    test.each([
        ['AAA010101AAA', '605'], // persona moral con regimen incorrecto
        ['AAAA010101AAA', '601'], // persona física con regimen incorrecto
        ['', '615'], // RFC vacío, con regimen
        ['', ''], // RFC vacío, regimen vacío
        [null, ''], // sin RFC, regimen vacío
        [null, '630'], // sin RFC, con regimen
        [null, null], // sin RFC, sin regimen
    ])('invalid cases', async (emisorRfc: string | null, regimenFiscal: string | null) => {
        getComprobante33().addChild(
            new CNode('cfdi:Emisor', {
                RegimenFiscal: regimenFiscal,
                Rfc: emisorRfc,
            })
        );

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'REGFIS01');
    });
});
