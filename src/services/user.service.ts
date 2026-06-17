import User from "../models/user.model";

type CreateUserInput = {
  name: string;
  email: string;
  role?: "customer" | "worker" | "admin" | "organization_admin";
  phone?: string;
  organizationId?: string;
  status?: "active" | "inactive" | "suspended";
};

type UserFilters = {
  organizationId?: string;
  role?: string;
  status?: string;
};

export const createUser = async (input: CreateUserInput) => {
  return User.create(input);
};

export const fetchUsers = async (filters: UserFilters = {}) => {
  const query: Record<string, string> = {};

  if (filters.organizationId) query.organizationId = filters.organizationId;
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;

  return User.find(query).sort({ createdAt: -1 });
};

export const fetchUserById = async (id: string) => {
  return User.findById(id);
};

export const updateUserById = async (
  id: string,
  input: Partial<CreateUserInput>
) => {
  return User.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
};

export const deleteUserById = async (id: string) => {
  return User.findByIdAndDelete(id);
};