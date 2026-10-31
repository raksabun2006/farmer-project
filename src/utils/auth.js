export const normalizeRole = (role) => {
  if (typeof role !== "string") {
    return "";
  }

  return role.replace(/^ROLE_/i, "").trim().toUpperCase();
};

export const isFarmerRole = (role) => normalizeRole(role) === "FARMER";

export const getDashboardPath = (role) => (
  isFarmerRole(role) ? "/dashboard" : "/"
);
