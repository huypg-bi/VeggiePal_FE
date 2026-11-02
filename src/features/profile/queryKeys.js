export const profileKeys = {
  me: ["profile", "me"],
  allergens: ["nutrition", "allergens"],
  myAllergies: ["nutrition", "my-allergies"],
  healthRecords: ["nutrition", "health-records"],
  latestHealthRecord: ["nutrition", "health-records", "latest"],
  healthHistory: (size) => ["nutrition", "health-records", "history", { size }],
};
