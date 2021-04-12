import { SubGenerator } from "../sub-generator";
declare class TaskGeneratorClass extends SubGenerator {
    load(program: any): void;
    protected generate(name: string, directory: string, options: any): void;
}
declare const _default: TaskGeneratorClass;
export = _default;
