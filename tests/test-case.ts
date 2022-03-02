import { join } from 'path';
import { XmlResolver } from '@nodecfdi/cfdiutils-core';

const useTestCase = (): {
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
} => {
    const utilAsset = (file: string): string => {
        return join(__dirname, 'assets', file);
    };

    const newResolver = (): XmlResolver => {
        return new XmlResolver();
    };

    return {
        utilAsset,
        newResolver,
    };
};

export { useTestCase };
