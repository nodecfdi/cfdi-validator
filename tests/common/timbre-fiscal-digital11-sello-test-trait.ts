import { CNode, CNodeInterface } from '@nodecfdi/cfdiutils-common';
import { Tfd11 } from '@nodecfdi/cfdiutils-elements';
import { Asserts, Status, ValidatorInterface } from '../../src';
import { TimbreFiscalDigitalSello } from '../../src/cfdi33/standard/timbre-fiscal-digital-sello';

const useTimbreFiscalDigital11SelloTestTrait = (
    runValidate: () => Promise<void>,
    assertStatusEqualsCode: (expected: Status, code: string) => void,
    getComprobante: () => CNodeInterface,
    validator: () => ValidatorInterface,
    asserts: () => Asserts
): void => {
    const newTimbreFiscalDigital = (attributes: Record<string, unknown> = {}): CNodeInterface => {
        return new Tfd11.TimbreFiscalDigital(attributes);
    };

    const validCertificadoSAT = (): string => {
        return '00001000000406258094';
    };

    const validSelloCfdi = (): string => {
        return (
            'Xt7tK83WumikNMyx4Y/Z3R7D0rOjqTrrLu8wBlCnvXrpMFgWtyrcFUttGnevvUqCnQjuVUSpFcXqbzIQEUYNKFjxmtjwGHN+b' +
            '15xUvcnfqpJRBoJe2IKd5YMZqYp9NhTJIMBYsE7+fhP1+mHcKdKn9WwXrar8uXzISqPgZ97AORBsMWmXxbVWYRtqT4MX/Xq4yhbT4jao' +
            'aut5AwhVzE1TUyZ10/C2gGySQeFVyEp9aqNScIxPotVDb7fMIWxsV26XODf6GK14B0TJNmRlCIfmfb2rQeskiYeiF5AQPb6Z2gmGLHcN' +
            'ks7qC+eO3EsGVr1/ntmGcwTurbGXmE4/OAgdg=='
        );
    };

    const validSelloSat = (): string => {
        return (
            'IRy7wQnKnlIsN/pSZSR7qEm/SOJuLIbNjj/S3EAd278T2uo0t73KXfXzUbbfWOwpdZEAZeosq/yEiStTaf44ZonqRS1fq6oYk1' +
            '2udMmT4NFrEYbPEEKLn4lqdhuW4v8ZK2Vos/pjCtYtpT+/oVIXiWg9KrGVGuMvygRPWSmd+YJq3Jm7qTz0ON0vzBOvXralSZ4Q14xUvt' +
            '6ZDM9gYqIzTtCjIWaNrAdEYyqfZjvfy0uCyThh6HvCbMsX9gq4RsQj3SIoA56g+1SJevoZ6Jr722mDCLcPox3KCN75Bk8ALJI6G0weP7' +
            'rQO5jEtulTRNWN3w+tlryZWElkD79MDZA6Zg=='
        );
    };

    // TESTS
    test('valid case', async () => {
        const selloCfdi = validSelloCfdi();
        const selloSat = validSelloSat();
        getComprobante().attributes().set('Sello', selloCfdi);
        const tfd = newTimbreFiscalDigital({
            NoCertificadoSAT: validCertificadoSAT(),
            SelloSAT: selloSat,
            // these are required to create the source string
            SelloCFD: selloCfdi,
            FechaTimbrado: '2018-01-12T08:17:54',
            RfcProvCertif: 'DCD090706E42',
            UUID: 'CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC',
        });
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.ok(), 'TFDSELLO01');
    });

    test('validator dont have xml resolver', async () => {
        (validator() as TimbreFiscalDigitalSello).setXmlResolver(null);
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('No se puede hacer la validación');
    });

    test('validator dont have timbre fiscal digital', async () => {
        await runValidate();

        assertStatusEqualsCode(Status.none(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('no contiene un Timbre');
    });

    test('validator timbre fiscal digital version is not present', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().delete('Version');
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('La versión del timbre');
    });

    test('validator timbre fiscal digital version is not valid', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().set('Version', '1.0');
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.none(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('La versión del timbre');
    });

    test('validator timbre fiscal digital sello sat does not match with comprobante', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().set('SelloCFD', 'foo');
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('no coincide');
    });

    test('validator no certificado sat empty', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().set('SelloCFD', 'foo');
        getComprobante().attributes().set('Sello', tfd.attributes().get('SelloCFD'));
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('NoCertificadoSAT');
    });

    test('validator no certificado sat invalid', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().set('SelloCFD', 'foo');
        tfd.attributes().set('NoCertificadoSAT', '9876543210987654321A');
        getComprobante().attributes().set('Sello', tfd.attributes().get('SelloCFD'));
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('NoCertificadoSAT');
    });

    test('validator no certificado sat non existent', async () => {
        const tfd = newTimbreFiscalDigital();
        tfd.attributes().set('SelloCFD', 'foo');
        tfd.attributes().set('NoCertificadoSAT', '98765432109876543210');
        getComprobante().attributes().set('Sello', tfd.attributes().get('SelloCFD'));
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('obtener el certificado');
    });

    test('validator sello sat invalid', async () => {
        // to make it fail we change the FechaTimbrado
        const selloCfdi = validSelloCfdi();
        const selloSat = validSelloSat();
        getComprobante().attributes().set('Sello', selloCfdi);
        const tfd = newTimbreFiscalDigital({
            NoCertificadoSAT: validCertificadoSAT(),
            SelloSAT: selloSat,
            // these are required to create the source string
            SelloCFD: selloCfdi,
            FechaTimbrado: '2018-01-12T08:17:53', // this was 54 seconds
            RfcProvCertif: 'DCD090706E42',
            UUID: 'CEE4BE01-ADFA-4DEB-8421-ADD60F0BEDAC',
        });
        getComprobante().addChild(new CNode('cfdi:Complemento', {}, [tfd]));

        await runValidate();

        assertStatusEqualsCode(Status.error(), 'TFDSELLO01');
        expect(asserts().get('TFDSELLO01').getExplanation()).toContain('La verificación del timbrado fue negativa');
    });
};

export { useTimbreFiscalDigital11SelloTestTrait };
