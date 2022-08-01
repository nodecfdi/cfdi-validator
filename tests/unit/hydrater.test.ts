import { useTestCase } from '../test-case';
import { Hydrater } from '~/hydrater';
import { ImplementationRequireXmlStringInterface } from '../fake-objects/implementation-require-xml-string-interface';
import { ImplementationRequireXmlResolverInterface } from '../fake-objects/implementation-require-xml-resolver-interface';

describe('Hydrater', () => {
    const { newResolver } = useTestCase();

    test('hydrate xml string', () => {
        const hydrater = new Hydrater();

        hydrater.setXmlString('<root />');
        expect(hydrater.getXmlString()).toBe('<root />');

        const container = new ImplementationRequireXmlStringInterface();
        hydrater.hydrate(container);
        expect(hydrater.getXmlString()).toBe(container.getXmlString());
    });

    test('hydrate xml resolver', () => {
        const hydrater = new Hydrater();
        const xmlResolver = newResolver();

        hydrater.setXmlResolver(xmlResolver);
        expect(hydrater.getXmlResolver()).toBe(xmlResolver);

        const container = new ImplementationRequireXmlResolverInterface();
        hydrater.hydrate(container);
        expect(container.getXmlResolver()).toBe(hydrater.getXmlResolver());
    });
});
