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
  },

  async updateUserProfile({ actor, targetUserId, body }) {
    const userId = actor.id;
    const isSelf = userId === targetUserId;
    const isAdmin = actor.role === 'admin' || actor.role === 'superAdmin';

    const allowedFields = isAdmin 
      ? ['userName', 'email', 'role', 'isActive', 'profilePicture', 'restaurantId']
      : ['userName', 'profilePicture'];

    const updateData = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (!isSelf && !isAdmin) {
      throw new Error('Unauthorized to update this user');
    }

    if (body.password) {
      throw new Error('Password cannot be updated through this endpoint');
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      updateData,
      { new: true }
    ).select('-password');

    return updatedUser;
  },

  async deleteUserAccount({ actor, targetUserId }) {
    const userId = actor.id;
    const isSelf = userId === targetUserId;
    const isSuperAdmin = actor.role === 'superAdmin';

    if (!isSelf && !isSuperAdmin) {
      throw new Error('Unauthorized to delete this user');
    }

    const deletedUser = await User.findByIdAndDelete(targetUserId);
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  },

  async deactivateUserAccount({ actor, targetUserId }) {
    const userId = actor.id;
    const isSelf = userId === targetUserId;
    const isAdmin = actor.role === 'admin' || actor.role === 'superAdmin';

    if (!isSelf && !isAdmin) {
      throw new Error('Unauthorized to deactivate this user');
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { isActive: false },
      { new: true }
    ).select('-password');

    return updatedUser;
  },

  async restoreUserAccount({ actor, targetUserId }) {
    if (actor.role !== 'superAdmin') {
      throw new Error('Only superAdmin can restore users');
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { isActive: true },
      { new: true }
    ).select('-password');

    return updatedUser;
  },

  async listUsersForAdmin({ actor, query = {} }) {
    if (actor.role !== 'admin' && actor.role !== 'superAdmin') {
      throw new Error('Unauthorized access');
    }

    const { page = 1, limit = 10, search, role, isActive } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  },

  async listAvailableAdmins({ actor }) {
    if (actor.role !== 'superAdmin') {
      throw new Error('Unauthorized access');
    }

    const admins = await User.find({
      role: { $in: ['admin', 'superAdmin'] },
      isActive: true
    }).select('-password');

    return { data: admins };
  },

  async createStoreManagerUser({ actor, body }) {
    if (actor.role !== 'admin' && actor.role !== 'superAdmin') {
      throw new Error('Unauthorized to create store manager');
    }

    const { userName, email, password, restaurantId } = body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);
    
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: 'storeManager',
      restaurantId: restaurantId || null,
      createdByAdminId: actor.id,
      isActive: true
    });

    await newUser.save();
    newUser.password = undefined;
    
    return newUser;
  },

  async assignStoreManagerRestaurant({ actor, targetUserId, body }) {
    if (actor.role !== 'admin' && actor.role !== 'superAdmin') {
      throw new Error('Unauthorized to assign restaurant');
    }

    const { restaurantId } = body;
    
    const user = await User.findByIdAndUpdate(
      targetUserId,
      { restaurantId },
      { new: true }
    ).select('-password');

    return user;
  },

  async listStoreManagers({ actor, query = {} }) {
    if (actor.role !== 'admin' && actor.role !== 'superAdmin') {
      throw new Error('Unauthorized access');
    }

    const { restaurantId } = query;
    const filter = { role: 'storeManager' };
    if (restaurantId) filter.restaurantId = restaurantId;

    const managers = await User.find(filter).select('-password');
    return { data: managers };
  },

  async unassignStoreManagerRestaurant({ actor, targetUserId }) {
    if (actor.role !== 'admin' && actor.role !== 'superAdmin') {
      throw new Error('Unauthorized');
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { restaurantId: null },
      { new: true }
    ).select('-password');

    return user;
  },

  async transferStoreManagerOwner({ actor, targetUserId, body }) {
    if (actor.role !== 'superAdmin') {
      throw new Error('Only superAdmin can transfer ownership');
    }

    const { newOwnerId } = body;
    
    const user = await User.findByIdAndUpdate(
      targetUserId,
      { createdByAdminId: newOwnerId },
      { new: true }
    ).select('-password');

    return user;
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
