import User from '../models/user.model.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select('+password');
};

export const findUserById = async (id, select = '') => {
  if (select) {
    return User.findById(id).select(select);
  }
  return User.findById(id);
};

export const findUserByUserName = async (userName) => {
  return User.findOne({ userName });
};

export const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

export const saveUser = async (user) => {
  return user.save();
};

export const findRefreshTokenByHash = async (tokenHash) => {
  return null;
};

export const createRefreshToken = async (tokenData) => {
  return { ...tokenData };
};

export const revokeRefreshFamily = async (familyId, reason) => {
  return { success: true };
};
