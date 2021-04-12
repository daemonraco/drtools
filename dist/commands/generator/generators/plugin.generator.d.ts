import { SubGenerator } from "../sub-generator";
declare class PluginGeneratorClass extends SubGenerator {
    load(program: any): void;
    protected generate(name: string, directory: string, options: any): void;
}
declare const _default: PluginGeneratorClass;
export = _default;
