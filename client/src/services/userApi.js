const API_URL = '/api/auth';

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
    profilePicture: "https://img.freepik.com/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
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
    profilePicture: "https://img.freepik.com/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740&q=80",
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
  await delay(100);
  const users = await readUsersFromJson();
  const user = users.find(u => u.email === email.toLowerCase());
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }
  
  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  const token = btoa(JSON.stringify({ userId: user._id, email: user.email }));
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  return { user: userWithoutPassword, token };
};

export const createUserInJson = async (userData) => {
  await delay(100);
  const users = await readUsersFromJson();
  
  const existingUser = users.find(u => u.email === userData.email.toLowerCase());
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    _id: Date.now().toString(),
    userName: userData.userName,
    email: userData.email.toLowerCase(),
    password: userData.password,
    profilePicture: '',
    role: 'user',
    restaurantId: null,
    createdByAdminId: null,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  await writeUsersToJson(users);
  
  const { password: _, ...userWithoutPassword } = newUser;
  const token = btoa(JSON.stringify({ userId: newUser._id, email: newUser.email }));
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  return { user: userWithoutPassword, token };
};

export const logoutUser = async () => {
  await delay(100);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { message: 'Logged out successfully' };
};

export const updateUserInJson = async (userId, updates) => {
  await delay(100);
  const users = await readUsersFromJson();
  const userIndex = users.findIndex(u => u._id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;
  await writeUsersToJson(users);
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const deleteUserFromJson = async (userId) => {
  await delay(100);
  const users = await readUsersFromJson();
  const userIndex = users.findIndex(u => u._id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users.splice(userIndex, 1);
  await writeUsersToJson(users);
  
  return { message: 'User deleted successfully' };
};

export default {
  readUsersFromJson,
  writeUsersToJson,
  appendUserToJson,
  findUserByEmailInJson,
  validateUserCredentials,
  createUserInJson,
  logoutUser,
  updateUserInJson,
  deleteUserFromJson
};
