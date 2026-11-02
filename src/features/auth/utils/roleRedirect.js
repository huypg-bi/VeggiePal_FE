// Điều hướng theo vai trò (role của BE: "USER" | "ADMIN").

export const ADMIN_HOME_PATH = "/admin";

export const isAdmin = (user) => user?.role === "ADMIN";

export function resolvePostLoginPath(user, from) {
  if (isAdmin(user)) {
    return from && (from === ADMIN_HOME_PATH || from.startsWith(`${ADMIN_HOME_PATH}/`))
      ? from
      : ADMIN_HOME_PATH;
  }
  return from || "/";
}
