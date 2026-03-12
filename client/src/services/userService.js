const STORAGE_KEY = 'eatwisely_users';

const getUsersFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const saveUsersToStorage = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getUsersFromStorage();
  return users.find(u => u.email === email);
};

export const findUserByCredentials = (email, password) => {
  const users = getUsersFromStorage();
  return users.find(u => u.email === email && u.password === password);
};

export const createUser = (userData) => {
  const users = getUsersFromStorage();
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
  
  users.push(newUser);
  saveUsersToStorage(users);
  
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export default {
  getUsersFromStorage,
  saveUsersToStorage,
  findUserByEmail,
  findUserByCredentials,
  createUser
};
