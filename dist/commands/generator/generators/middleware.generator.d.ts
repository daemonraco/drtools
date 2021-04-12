import { SubGenerator } from "../sub-generator";
declare class MiddlewareGeneratorClass extends SubGenerator {
    load(program: any): void;
    protected generate(name: string, directory: string, options: any): void;
}
declare const _default: MiddlewareGeneratorClass;
export = _default;
