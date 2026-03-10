const STORAGE_KEY = 'eatwisely_users_json';

const defaultUsers = [
  {
    _id: "507f1f77bcf86cd799439011",
    userName: "testuser",
    email: "test@example.com",
    password: "test123",
    profilePicture: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
    role: "user",
    restaurantId: null,
    createdByAdminId: null,
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439012",
    userName: "admin",
    email: "admin@eatwisely.com",
    password: "admin123",
    profilePicture: "https://.com/premium-vectorimg.freepik/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
    role: "admin",
    restaurantId: null,
    createdByAdminId: null,
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z"
  },
  {
    _id: "507f1f77bcf86cd799439013",
    userName: "admin1",
    email: "admin1@eatwisely.com",
    password: "Eatwisely@Admin123",
    profilePicture: "https://.com/premium-vectorimg.freepik/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
    role: "superAdmin",
    restaurantId: null,
    createdByAdminId: null,
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z"
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const readUsersFromJson = async () => {
  await delay(100);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const writeUsersToJson = async (users) => {
  await delay(100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users, null, 2));
};

export const appendUserToJson = async (newUser) => {
  const users = await readUsersFromJson();
  users.push(newUser);
  await writeUsersToJson(users);
  return newUser;
};

export const findUserByEmailInJson = async (email) => {
  const users = await readUsersFromJson();
  return users.find(u => u.email === email.toLowerCase());
};

export const validateUserCredentials = async (email, password) => {
  const users = await readUsersFromJson();
  return users.find(u => u.email === email.toLowerCase() && u.password === password);
};

export const createUserInJson = async (userData) => {
  const existingUser = await findUserByEmailInJson(userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = {
    _id: Date.now().toString(),
    userName: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    profilePicture: 'https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80',
    role: 'user',
    restaurantId: null,
    createdByAdminId: null,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  await appendUserToJson(newUser);

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export default {
  readUsersFromJson,
  writeUsersToJson,
  appendUserToJson,
  findUserByEmailInJson,
  validateUserCredentials,
  createUserInJson
};
