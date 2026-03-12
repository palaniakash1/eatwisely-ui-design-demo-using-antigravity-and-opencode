import User from '../models/user.model.js';
import { hashPassword } from './auth.service.js';

export const userService = {
  async findById(id) {
    return User.findById(id);
  },

  async findByEmail(email) {
    return User.findOne({ email });
  },

  async findByUserName(userName) {
    return User.findOne({ userName });
  },

  async create(data) {
    const user = new User(data);
    return user.save();
  },

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return User.findByIdAndDelete(id);
  },

  async list(query = {}) {
    return User.find(query);
  },

  async assignRestaurant(userId, restaurantId) {
    return User.findByIdAndUpdate(
      userId,
      { restaurantId },
      { new: true }
    );
  },

  async changeRole(userId, role) {
    return User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
  },

  async deactivate(userId) {
    return User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
  },

  async activate(userId) {
    return User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );
  }
};

export const createPrivilegedUser = async (data) => {
  const { userName, email, password, role, restaurantId, createdByAdminId } = data;
  
  const hashedPassword = await hashPassword(password);
  
  const user = new User({
    userName,
    email,
    password: hashedPassword,
    role: role || 'user',
    restaurantId: restaurantId || null,
    createdByAdminId: createdByAdminId || null
  });

  return user.save();
};

export default userService;
