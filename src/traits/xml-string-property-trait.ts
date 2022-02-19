export abstract class XmlStringPropertyTrait {
    private _xmlString = '';

    public setXmlString(xmlString: string): void {
        this._xmlString = xmlString;
    }

    public getXmlString(): string {
        return this._xmlString;
    }
}
