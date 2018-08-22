/**
 * @file forget.ts
 * @author Alejandro D. Simi
 */

export async function WARuleForget(rule: any, root: any): Promise<string> {
    delete root[rule.field];

    return root;
}
