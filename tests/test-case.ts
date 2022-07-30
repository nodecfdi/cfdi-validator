import { join, basename, dirname } from 'path';
import { SatCertificateNumber, XmlResolver } from '@nodecfdi/cfdiutils-core';
import { copyFileSync, existsSync, mkdirSync, lstatSync } from 'fs';

const useTestCase = (): {
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
    installCertificate(cerFile: string): string;
} => {
    const utilAsset = (file: string): string => {
        return join(__dirname, '_files', file);
    };

    const newResolver = (): XmlResolver => {
        return new XmlResolver();
    };

    const installCertificate = (cerFile: string): string => {
        const certificateNumber = basename(cerFile, '.cer').substring(0, 20);
        const satCertificateNumber = new SatCertificateNumber(certificateNumber);

        const cerRetriever = newResolver().newCerRetriever();

        const installationPath = cerRetriever.buildPath(satCertificateNumber.remoteUrl());
        if (existsSync(installationPath)) {
            return installationPath;
        }

        const installationDir = dirname(installationPath);
        if (!existsSync(installationDir)) {
            mkdirSync(installationDir, { recursive: true });
        }
        if (!lstatSync(installationDir).isDirectory()) {
            throw new Error(`Cannot create installation dir ${installationDir}`);
        }

        try {
            copyFileSync(cerFile, installationPath);
        } catch (e) {
            throw new Error(`Cannot install ${cerFile} into ${installationPath} error: ${(e as Error).message}`);
        }

        return installationPath;
    };

    return {
        utilAsset,
        newResolver,
        installCertificate
    };
};
export { useTestCase };
