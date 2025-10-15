import type { RbacConfig, AbacConfig, AccessUser } from "@/types/access";

let _rbac: RbacConfig | null = null;
let _abac: AbacConfig | null = null;

export async function loadRbac(): Promise<RbacConfig> {
  if (_rbac) return _rbac;
  _rbac = (await import("@/public/data/rbac-roles.json")).default as RbacConfig;
  return _rbac;
}

export async function loadAbac(): Promise<AbacConfig> {
  if (_abac) return _abac;
  _abac = (await import("@/public/data/abac-rules.json")).default as AbacConfig;
  return _abac;
}

export async function can(
  user: AccessUser,
  action: string,
  resource: string,
  record?: Record<string, unknown>
): Promise<boolean> {
  const rbac = await loadRbac();
  const abac = await loadAbac();

  // RBAC: role-based check
  const allowedByRole = rbac.permissions.some((p) =>
    p.resource === resource && p.actions.includes(action) && p.roles.some((r) => user.roles.includes(r))
  );
  if (!allowedByRole) return false;

  // ABAC: attribute-based (light)
  const rules = abac.rules.filter((r) => r.resource === resource && r.action === action);
  for (const rule of rules) {
    if (!record) return false; // if rule exists and no record, deny
    const fieldVal = record[rule.condition.field];
    const op = rule.condition.op;
    const valueExpr = rule.condition.value;
    // very light template replacement: ${user.*}
    const resolved = valueExpr.replace(/\$\{user\.([a-zA-Z0-9_]+)\}/g, (_, key) => {
      const v = (user as any)[key];
      if (Array.isArray(v)) return JSON.stringify(v);
      return String(v ?? "");
    });
    if (op === "==" && String(fieldVal) !== resolved) return false;
    if (op === "!=" && String(fieldVal) === resolved) return false;
    if (op === "in") {
      let arr: unknown;
      try {
        arr = JSON.parse(resolved);
      } catch {
        arr = resolved.split(",").map((s) => s.trim());
      }
      if (!Array.isArray(arr) || !arr.map(String).includes(String(fieldVal))) return false;
    }
    if (op === "not-in") {
      let arr: unknown;
      try {
        arr = JSON.parse(resolved);
      } catch {
        arr = resolved.split(",").map((s) => s.trim());
      }
      if (Array.isArray(arr) && arr.map(String).includes(String(fieldVal))) return false;
    }
  }
  return true;
}

