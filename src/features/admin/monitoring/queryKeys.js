// Khóa cache React Query của khu admin: giám sát AI.
export const monitoringKeys = {
  all: ["ai-monitoring"],
  summary: (days, excludeFeature) => ["ai-monitoring", "summary", days, excludeFeature ?? null],
  logs: (params) => ["ai-monitoring", "logs", params],
  models: ["ai-monitoring", "models"],
  limits: ["ai-monitoring", "limits"],
};
