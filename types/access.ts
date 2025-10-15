export type RbacRole = { key: string; name: string };
export type RbacPermission = { resource: string; actions: string[]; roles: string[] };
export type RbacConfig = { roles: RbacRole[]; permissions: RbacPermission[] };

export type AbacCondition = { field: string; op: "==" | "!=" | "in" | "not-in" }; // value is dynamic
export type AbacRule = { resource: string; action: string; condition: AbacCondition & { value: string } };
export type AbacConfig = { rules: AbacRule[] };

export type AccessUser = { id: string; roles: string[]; brandSlugs?: string[]; [k: string]: unknown };

