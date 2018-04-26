/**
 * @file variables.ts
 * @author Alejandro D. Simi
 */

export class ServerVariables {
    public availableUrls: any[] = [];
    // export const chalkForMethods = {
    //     DELETE: chalk.red,
    //     GET: chalk.green,
    //     POST: chalk.red,
    //     PUT: chalk.yellow,
    //     PATCH: chalk.yellow
    // };
    public error: string = null;
    public connectorOptions: any = {
        verbose: true
    };
    public webUI: boolean = true;
    public port: boolean = false;
}
