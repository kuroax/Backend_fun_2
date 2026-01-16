export type DbUserRole = "user" | "admin";
export type GqlUserRole = "USER" | "ADMIN";

export const toGqlRole = (dbRole: DbUserRole): GqlUserRole =>
  dbRole === "admin" ? "ADMIN" : "USER";

export const toDbRole = (gqlRole: GqlUserRole): DbUserRole =>
  gqlRole === "ADMIN" ? "admin" : "user";