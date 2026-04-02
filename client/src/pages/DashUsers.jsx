import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Spinner } from 'flowbite-react';
import imageCompression from 'browser-image-compression';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import {
  HiOutlineExclamationCircle,
  HiOutlineX,
  HiPencilAlt,
  HiTrash,
  HiUserAdd,
  HiUserGroup,
  HiUserCircle,
  HiShieldCheck,
  HiStatusOffline,
  HiStatusOnline,
  HiSearch,
  HiFilter,
  HiRefresh,
  HiChevronDown,
  HiStar
} from 'react-icons/hi';
import { TextInput, Select } from 'flowbite-react';

import { app } from '../firebase';
import {
  buildPermissionPayload,
  buildPermissionStateFromPayload,
  buildPermissionStateForRole,
  countEnabledPermissions,
  PERMISSION_GROUPS
} from '../constants/permissionTemplates';
import { useAuth } from '../context/AuthContext';
import FloatingPagination from '../components/FloatingPagination';

const DEFAULT_ROLE = 'admin';

const buildCreateForm = () => ({
  userName: '',
  email: '',
  password: '',
  role: DEFAULT_ROLE,
  isActive: true
});

const areEqual = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);

const getPermissionModeLabel = (user) =>
  user?.customPermissions ? 'Custom Access' : 'Role Template';

function SwitchField({ checked, onChange, srLabel }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-[#8fa31e] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#d8e89d] after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5" />
      <span className="sr-only">{srLabel}</span>
    </label>
  );
}

function PremiumUserModal({ isOpen, onClose, mode, user, onSuccess }) {
  const { updateUser } = useAuth();
  const filePickerRef = useRef();

  const isEditMode = mode === 'edit';
  const [formData, setFormData] = useState(buildCreateForm());
  const [permissionState, setPermissionState] = useState(
    buildPermissionStateForRole(DEFAULT_ROLE)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && user) {
        setFormData({
          userName: user.userName || '',
          email: user.email || '',
          password: '',
          role: user.role || DEFAULT_ROLE,
          isActive: user.isActive ?? true
        });
        setPermissionState(
          buildPermissionStateFromPayload(user.customPermissions, user.role)
        );
        setImageFileUrl(user.profilePicture || null);
      } else {
        setFormData(buildCreateForm());
        setPermissionState(buildPermissionStateForRole(DEFAULT_ROLE));
        setImageFileUrl(null);
      }
      setError(null);
      setSuccess(null);
      setImageFile(null);
    }
  }, [isOpen, isEditMode, user]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleTemplateChange = (event) => {
    const nextRole = event.target.value;
    setFormData((prev) => ({ ...prev, role: nextRole }));
    setPermissionState(buildPermissionStateForRole(nextRole));
  };

  const resetPermissionsToRoleTemplate = () => {
    setPermissionState(buildPermissionStateForRole(formData.role));
  };

  const setAllPermissions = (enabled) => {
    setPermissionState((prev) =>
      Object.fromEntries(
        Object.keys(prev).map((permissionKey) => [permissionKey, enabled])
      )
    );
  };

  const togglePermission = (permissionKey) => {
    setPermissionState((prev) => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageFileUploadingError('Only image files are allowed.');
      event.target.value = null;
      return;
    }
    const limitInBytes = 2 * 1024 * 1024;
    try {
      setImageFileUploading(true);
      setImageFileUploadingError(null);
      if (file.size > limitInBytes) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });
        setImageFile(compressedFile);
        setImageFileUrl(URL.createObjectURL(compressedFile));
      } else {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    } catch {
      setImageFileUploadingError('Compression failed. Try a smaller photo.');
    } finally {
      setImageFileUploading(false);
    }
  };

  const uploadImage = useCallback(() => {
    if (!imageFile) return;
    setIsUploading(true);
    setImageFileUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const storageRef = ref(storage, `${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(Math.round(progress));
      },
      () => {
        setIsUploading(false);
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploadingError("Couldn't upload image.");
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
          setIsUploading(false);
          setImageFileUploading(false);
        });
      }
    );
  }, [imageFile]);

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile, uploadImage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const customPayload = buildPermissionPayload(permissionState);
      const roleTemplatePayload = buildPermissionPayload(
        buildPermissionStateForRole(formData.role)
      );

      const payload = {
        ...formData,
        permissions: areEqual(customPayload, roleTemplatePayload)
          ? null
          : customPayload
      };

      if (isEditMode) {
        if (!user?._id) throw new Error('User ID is missing');
        if (imageFileUploading) {
          throw new Error('Please wait for the image upload to finish');
        }
        payload.password = payload.password || undefined;
        if (imageFileUrl && imageFileUrl !== user.profilePicture) {
          payload.profilePicture = imageFileUrl;
        }

        const res = await fetch(`/api/admin/users/${user._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update user');
        }
        setSuccess('User updated successfully!');
        onSuccess?.(data.user, 'update');
        updateUser(data.user);
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to create user');
        }
        setSuccess(
          `${data.user.userName} created with ${
            data.permissionMode === 'custom'
              ? 'custom access'
              : 'role template access'
          }.`
        );
        onSuccess?.(data.user, 'create');
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'from-yellow-500 to-orange-500';
      case 'admin':
        return 'from-blue-500 to-blue-600';
      case 'storeManager':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'storeManager':
        return 'Store Manager';
      default:
        return role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[1400px] max-h-[95vh] bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col border border-gray-200">
        <div className="bg-gradient-to-r from-[#4a5c10] via-[#6b7d18] to-[#8fa31e] px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
              {isEditMode ? (
                <HiPencilAlt className="w-7 h-7 text-white" />
              ) : (
                <HiUserAdd className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditMode ? 'Edit User' : 'Create New User'}
              </h2>
              <p className="text-green-100 text-sm mt-0.5">
                {isEditMode
                  ? `Updating user profile for ${user?.userName || ''}`
                  : 'Add a new privileged user with custom permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center transition-all hover:scale-105"
          >
            <HiOutlineX className="w-6 h-6 text-white" />
          </button>
        </div>

        <form id="user-form" onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="px-8 pt-6 flex-shrink-0">
              <Alert color="failure">
                {error}
              </Alert>
            </div>
          )}
          {success && (
            <div className="px-8 pt-6 flex-shrink-0">
              <Alert color="success">
                {success}
              </Alert>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Profile Photo</h3>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div
                      className="relative w-40 h-40 cursor-pointer group mb-4"
                      onClick={() => filePickerRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        ref={filePickerRef}
                        onChange={handleImageChange}
                        hidden
                      />
                      <div className="absolute inset-0 rounded-full ring-4 ring-[#8fa31e]/30 group-hover:ring-[#8fa31e] transition-all duration-300 overflow-hidden">
                        <img
                          src={imageFileUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.userName || 'default'}
                          alt="user avatar"
                          className="w-full h-full object-cover bg-gradient-to-br from-[#f7f9e8] to-[#eef4d3]"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white text-xs font-medium">Click to upload</span>
                        </div>
                      </div>
                      {imageFileUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Click on image to change</p>
                    {imageFileUploadingProgress !== null && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${imageFileUploadingProgress}%` }}
                        />
                      </div>
                    )}
                    {imageFileUploading && (
                      <p className="text-sm text-[#6b7d18] font-medium">Uploading... {imageFileUploadingProgress || 0}%</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Account Details</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        id="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm shadow-sm focus:border-[#8fa31e] focus:outline-none focus:ring-2 focus:ring-[#d8e89d]/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="user@example.com"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm shadow-sm focus:border-[#8fa31e] focus:outline-none focus:ring-2 focus:ring-[#d8e89d]/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {isEditMode ? 'New Password (Optional)' : 'Password'}
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={isEditMode ? 'Leave blank to keep current' : 'Min. 8 characters'}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm shadow-sm focus:border-[#8fa31e] focus:outline-none focus:ring-2 focus:ring-[#d8e89d]/50 transition-all"
                        required={!isEditMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getRoleBadgeColor(formData.role)} rounded-xl flex items-center justify-center`}>
                      <HiShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Role & Status</h3>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role Template
                      </label>
                      <div className="relative">
                        <select
                          id="role"
                          value={formData.role}
                          onChange={handleRoleTemplateChange}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm shadow-sm focus:border-[#8fa31e] focus:outline-none focus:ring-2 focus:ring-[#d8e89d]/50 transition-all appearance-none bg-white cursor-pointer"
                        >
                          <option value="superAdmin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="storeManager">Store Manager</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r ${getRoleBadgeColor(formData.role)} text-white`}>
                          {getRoleLabel(formData.role)}
                        </span>
                        <span className="text-xs text-gray-500">permission template</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#f7f9e8] to-[#f0f4d8] rounded-2xl p-5 border border-[#d4de8a]/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-800">Account Status</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.isActive ? 'User can access the system' : 'User is blocked from login'}
                          </p>
                        </div>
                        <SwitchField
                          checked={formData.isActive}
                          onChange={() =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: !prev.isActive
                            }))
                          }
                          srLabel="Toggle account status"
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-sm font-semibold ${formData.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#f6fadf] to-[#eef4d3] rounded-2xl p-5 border border-[#cad98a]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-lg flex items-center justify-center">
                          <HiShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-bold text-[#556b2f]">Permissions</p>
                      </div>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold text-[#4f6f1b]">
                          {countEnabledPermissions(permissionState)}
                        </p>
                        <p className="text-sm text-[#6b7d18] mb-1">enabled</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={resetPermissionsToRoleTemplate}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[#8fa31e] px-4 py-3 text-sm font-semibold text-[#556b2f] transition hover:bg-[#f0f6d4]"
                      >
                        <HiShieldCheck className="w-4 h-4" />
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllPermissions(true)}
                        className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Enable All
                      </button>
                      <button
                        type="button"
                        onClick={() => setAllPermissions(false)}
                        className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8">
                <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#9ab82e] rounded-2xl px-6 py-4 mb-6 flex items-center justify-between shadow-lg shadow-[#8fa31e]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Operational Permissions</h3>
                      <p className="text-green-100 text-sm">Configure granular access rights for this user</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl text-sm font-semibold text-white">
                    {getRoleLabel(formData.role)} Template
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {PERMISSION_GROUPS.map((group) => (
                    <section
                      key={group.id}
                      className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/30 transition-shadow duration-300"
                    >
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200 px-5 py-4">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8fa31e] to-[#a5b82e]" />
                          {group.title}
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
                        {group.permissions.map((permission) => (
                          <div
                            key={permission.key}
                            className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[#f7f9e8]/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800">
                                {permission.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {permission.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <SwitchField
                                checked={Boolean(permissionState[permission.key])}
                                onChange={() => togglePermission(permission.key)}
                                srLabel={`Toggle ${permission.label}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] animate-pulse" />
                <span className="text-sm text-gray-500">
                  {isEditMode ? 'Click "Save Changes" to update user' : 'Click "Create User" to add new user'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 text-sm font-semibold text-gray-600 rounded-xl border-2 border-gray-200 transition hover:bg-gray-100 hover:border-gray-300"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  form="user-form"
                  disabled={submitting}
                  className="!bg-gradient-to-r !from-[#4a5c10] !via-[#6b7d18] !to-[#8fa31e] hover:!from-[#3d5610] hover:!to-[#6b7d18] !text-white px-10 py-3.5 !rounded-xl !shadow-xl !shadow-[#8fa31e]/30 font-semibold transition-all duration-300"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : isEditMode ? (
                    'Save Changes'
                  ) : (
                    'Create User'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashUsers() {
  const { user: currentUser, updateUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (searchTerm) params.append('q', searchTerm);
    if (sortBy === 'newest') params.append('order', 'desc');
    else if (sortBy === 'oldest') params.append('order', 'asc');
    return params.toString();
  }, [page, limit, searchTerm, sortBy]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      setError(null);
      const queryParams = buildQueryParams();
      const res = await fetch(`/api/users?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load users');
      }
      setUsers(data.data || []);
      setTotalPages(Math.max(1, data.totalPages || 1));
      setTotalUsers(data.total || 0);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    if (currentUser?.role === 'superAdmin') {
      fetchUsers();
    }
  }, [currentUser?.role, fetchUsers]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleModalSuccess = (updatedUser, action) => {
    if (action === 'create') {
      fetchUsers();
    } else if (action === 'update') {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === updatedUser._id ? { ...u, ...updatedUser } : u
        )
      );
      if (
        currentUser &&
        (currentUser._id === updatedUser._id || currentUser.id === updatedUser._id)
      ) {
        updateUser(updatedUser);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) return;
    try {
      const res = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }
      setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
      setTotalUsers((prev) => Math.max(0, prev - 1));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const stats = {
    total: totalUsers,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    superAdmins: users.filter((u) => u.role === 'superAdmin').length,
    admins: users.filter((u) => u.role === 'admin').length,
    storeManagers: users.filter((u) => u.role === 'storeManager').length
  };

  const filteredUsers = React.useMemo(() => {
    let result = [...users];

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'active';
      result = result.filter((user) => user.isActive === isActive);
    }

    if (accessFilter) {
      const hasCustom = accessFilter === 'custom';
      result = result.filter(
        (user) =>
          hasCustom
            ? user.customPermissions
            : !user.customPermissions
      );
    }

    return result;
  }, [users, roleFilter, statusFilter, accessFilter]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setPage(1);
    setTimeout(() => fetchUsers(), 0);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
    setTimeout(() => fetchUsers(), 0);
  };

  const handleAccessFilterChange = (value) => {
    setAccessFilter(value);
    setPage(1);
    setTimeout(() => fetchUsers(), 0);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setTimeout(() => fetchUsers(), 0);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setAccessFilter('');
    setSortBy('newest');
    setPage(1);
    setTimeout(() => fetchUsers(), 0);
  };

  const hasActiveFilters = searchTerm || roleFilter || statusFilter || accessFilter;

  if (currentUser?.role !== 'superAdmin') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md text-center">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
              <HiShieldCheck className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Access Restricted
            </h2>
            <p className="text-gray-500">
              Only the super admin can access the staff creation and permission
              management module.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {error && (
            <Alert color="failure" onDismiss={() => setError(null)} className="mb-6">
              {error}
            </Alert>
          )}

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 sm:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                    <HiUserGroup className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-green-100 text-sm">
                      Manage privileged users and their access permissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur rounded-xl border border-white/20">
                    <div className={`w-2.5 h-2.5 rounded-full ${isRefreshing ? 'bg-yellow-300 animate-pulse' : 'bg-white'}`} />
                    <span className="text-white/90 text-sm font-medium">
                      {isRefreshing ? 'Updating...' : 'Ready'}
                    </span>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur hover:bg-white/25 text-white rounded-xl transition-all font-medium border border-white/20"
                  >
                    <HiRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/95 text-[#6b7d18] rounded-xl transition-all font-semibold shadow-lg shadow-white/25"
                  >
                    <HiUserAdd className="w-5 h-5" />
                    Add New User
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  {
                    label: 'Total Users',
                    value: totalUsers,
                    icon: HiUserGroup,
                    gradient: 'from-[#8fa31e] to-[#a5b82e]'
                  },
                  {
                    label: 'Super Admins',
                    value: stats.superAdmins,
                    icon: HiStar,
                    gradient: 'from-yellow-500 to-orange-500'
                  },
                  {
                    label: 'Admins',
                    value: stats.admins,
                    icon: HiShieldCheck,
                    gradient: 'from-blue-500 to-blue-600'
                  },
                  {
                    label: 'Store Managers',
                    value: stats.storeManagers,
                    icon: HiUserCircle,
                    gradient: 'from-purple-500 to-purple-600'
                  },
                  {
                    label: 'Active',
                    value: stats.active,
                    icon: HiStatusOnline,
                    gradient: 'from-emerald-500 to-emerald-600'
                  },
                  {
                    label: 'Inactive',
                    value: stats.inactive,
                    icon: HiStatusOffline,
                    gradient: 'from-red-500 to-red-600'
                  }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      if (stat.label === 'Active') {
                        setStatusFilter('active');
                      } else if (stat.label === 'Inactive') {
                        setStatusFilter('inactive');
                      } else if (stat.label === 'Super Admins') {
                        setRoleFilter('superAdmin');
                      } else if (stat.label === 'Admins') {
                        setRoleFilter('admin');
                      } else if (stat.label === 'Store Managers') {
                        setRoleFilter('storeManager');
                      }
                    }}
                  >
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa31e]" />
                  <TextInput
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-11 [&_input]:!bg-[#f7f9e8] [&_input]:!border-[#d4de8a] focus:[&_input]:!ring-[#8fa31e] focus:[&_input]:!border-[#8fa31e]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium ${
                      showFilters || hasActiveFilters
                        ? 'bg-[#8fa31e]/10 border-[#8fa31e]/30 text-[#6b7d18]'
                        : 'bg-[#f7f9e8] border-[#d4de8a]/50 text-[#6b7d18]'
                    }`}
                  >
                    <HiFilter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="w-5 h-5 bg-[#8fa31e] text-white text-xs rounded-full flex items-center justify-center">
                        {(searchTerm ? 1 : 0) + (roleFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (accessFilter ? 1 : 0)}
                      </span>
                    )}
                    <HiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>

                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="!bg-white !border-gray-200 min-w-[140px] [&>select]:!bg-white [&>select]:!border-gray-200 [&>select]:!text-gray-700 [&>select]:!font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="email-asc">Email (A-Z)</option>
                    <option value="email-desc">Email (Z-A)</option>
                  </Select>

                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-[#f7f9e8] rounded-xl border border-[#d4de8a]/30">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Role
                      </label>
                      <Select
                        value={roleFilter}
                        onChange={(e) => handleRoleFilterChange(e.target.value)}
                        className="!bg-white !border-gray-200 min-w-[160px] [&>select]:!bg-white [&>select]:!border-gray-200"
                      >
                        <option value="">All Roles</option>
                        <option value="superAdmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="storeManager">Store Manager</option>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </label>
                      <Select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="!bg-white !border-gray-200 min-w-[140px] [&>select]:!bg-white [&>select]:!border-gray-200"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Access Mode
                      </label>
                      <Select
                        value={accessFilter}
                        onChange={(e) => handleAccessFilterChange(e.target.value)}
                        className="!bg-white !border-gray-200 min-w-[160px] [&>select]:!bg-white [&>select]:!border-gray-200"
                      >
                        <option value="">All Access</option>
                        <option value="role">Role Template</option>
                        <option value="custom">Custom Access</option>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-800 text-lg">Users</h2>
                <span className="px-3 py-1 bg-[#8fa31e]/10 text-[#6b7d18] text-xs font-bold rounded-full border border-[#8fa31e]/20">
                  {hasActiveFilters ? `${filteredUsers.length} of ${totalUsers}` : totalUsers} users
                </span>
                {hasActiveFilters && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Filtered
                  </span>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] flex items-center justify-center mb-5 shadow-xl shadow-[#8fa31e]/20">
                    <Spinner size="lg" color="success" />
                  </div>
                  <p className="text-[#6b7d18] font-semibold text-lg">
                    Loading users...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4">
                  <div className="w-24 h-24 bg-[#f7f9e8] rounded-3xl flex items-center justify-center mb-5 border-2 border-[#d4de8a]/40">
                    <HiUserGroup className="w-12 h-12 text-[#8fa31e]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {hasActiveFilters ? 'No users match your filters' : 'No users found'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {hasActiveFilters
                      ? 'Try adjusting your search or filter criteria'
                      : 'Get started by creating your first privileged user'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] text-white rounded-xl hover:shadow-xl hover:shadow-[#8fa31e]/20 transition-all font-semibold"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCreateModal}
                      className="px-6 py-3 bg-gradient-to-r from-[#8fa31e] to-[#a5b82e] text-white rounded-xl hover:shadow-xl hover:shadow-[#8fa31e]/20 transition-all font-semibold"
                    >
                      <HiUserAdd className="w-5 h-5 inline mr-2" />
                      Add New User
                    </button>
                  )}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="px-6 sm:px-8 py-5 hover:bg-[#f7f9e8]/30 transition-all group"
                  >
                    <div className="flex items-start gap-5">
                      <img
                        src={user.profilePicture || 'https://via.placeholder.com/150'}
                        alt={user.userName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-bold text-gray-800 text-lg">
                              {user.userName}
                            </span>
                            <span
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                user.isActive
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              user.role === 'superAdmin' 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : user.role === 'admin' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.role === 'superAdmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Store Manager'}
                            </span>
                            <span
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                user.customPermissions
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {getPermissionModeLabel(user)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#8fa31e]/10 hover:bg-[#8fa31e]/20 text-[#6b7d18] rounded-xl transition-all font-semibold text-sm"
                            >
                              <HiPencilAlt className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-semibold text-sm"
                            >
                              <HiTrash className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-center text-sm text-[#6b7d18]/60 py-4">
            Only super admin can manage privileged users
          </div>
        </div>
      </div>

      <FloatingPagination
        totalItems={totalUsers}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        label="users"
      />

      <PremiumUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineExclamationCircle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Delete User?
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-700">
                  {selectedUser?.userName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-red-500/25"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
