// Các trường hồ sơ được làm nổi (tên field của GET /users/me).
export const HIGHLIGHTABLE_PROFILE_FIELDS = ["dateOfBirth", "gender", "activityLevel"];

export function readProfileFixState(state) {
  const missingFields = Array.isArray(state?.missingFields)
    ? state.missingFields.filter((field) => HIGHLIGHTABLE_PROFILE_FIELDS.includes(field))
    : [];
  const returnTo =
    typeof state?.returnTo === "string" && state.returnTo.startsWith("/") && !state.returnTo.startsWith("//")
      ? state.returnTo
      : null;
  const returnLabel = typeof state?.returnLabel === "string" && state.returnLabel ? state.returnLabel : "Quay lại";
  return { missingFields, returnTo, returnLabel };
}
