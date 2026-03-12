import User from '../models/user.model.js';
import { hashPassword } from './auth.service.js';

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
