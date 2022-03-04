import { join, basename, dirname } from 'path';
import { SatCertificateNumber, XmlResolver } from '@nodecfdi/cfdiutils-core';
import { copyFileSync, existsSync, statSync } from 'fs';
import mkdirp from 'mkdirp';

const useTestCase = (): {
    utilAsset(file: string): string;
    newResolver(): XmlResolver;
    installCertificate(cerFile: string): string;
} => {
    const utilAsset = (file: string): string => {
        return join(__dirname, 'assets', file);
    };

    const newResolver = (): XmlResolver => {
        return new XmlResolver();
    };

    const installCertificate = (cerFile: string): string => {
        const certificateNumber = basename(cerFile).substring(0, 20);
        const satCertificateNumber = new SatCertificateNumber(certificateNumber);

        const cerRetriever = newResolver().newCerRetriever();

        const installationPath = cerRetriever.buildPath(satCertificateNumber.remoteUrl());

        if (existsSync(installationPath)) {
            return installationPath;
        }

        const installationDir = dirname(installationPath);
        if (!existsSync(installationDir)) {
            mkdirp.sync(installationDir);
        }
        const stats = statSync(installationDir);
        if (!stats.isDirectory()) {
            throw new Error(`Cannot create installation dir ${installationDir}`);
        }

        try {
            copyFileSync(cerFile, installationPath);
        } catch (e) {
            throw new Error(`Cannot install ${cerFile} into ${installationPath}`);
        }
        return installationPath;
    };

    return {
        utilAsset,
        newResolver,
        installCertificate,
    };
};
export { useTestCase };
