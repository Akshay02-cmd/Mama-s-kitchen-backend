export const roles = ["CUSTOMER", "OWNER"] as const;
export type Role = (typeof roles)[number];

export const permissions = {
  CUSTOMER: ["browseMeals", "createOrder", "manageOwnProfile", "createReview", "createContact"] as const,
  OWNER: ["manageMess", "manageMeals", "manageOrders", "viewOwnerDashboard", "manageOwnProfile"] as const,
} as const;

export type Permission = (typeof permissions)[Role][number];

export const roleHasPermission = (role: Role, permission: Permission) =>
  permissions[role].includes(permission as never);

export default allRoles;
