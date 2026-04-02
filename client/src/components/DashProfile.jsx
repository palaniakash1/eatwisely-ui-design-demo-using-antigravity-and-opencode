import React, { useCallback, useEffect } from 'react';
import { Button, Alert } from 'flowbite-react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { app } from '../firebase';
import ImageCircleLoader from '../components/ImageCircleLoader';
import ImageUploadCropper from '../components/ImageUploadCropper';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineExclamationCircle,
  HiTrash,
  HiUser,
  HiMail,
  HiShieldCheck,
  HiCalendar,
  HiPencilAlt
} from 'react-icons/hi';
import { VscSignOut } from 'react-icons/vsc';
import { updateUserInJson, deleteUserFromJson } from '../services/userApi';

const ROLE_CONFIG = {
  superAdmin: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', label: 'Super Admin' },
  admin: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Admin' },
  storeManager: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Store Manager' },
  user: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: 'User' },
};

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

export default function DashProfile() {
  const toast = useToast();
  const { user: authUser, logout, updateUser: updateAuthUser } = useAuth();

  const [formData, setFormData] = React.useState({
    userName: '',
    email: '',
    password: '',
    role: '',
    profilePicture: ''
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [imageFileUrl, setImageFileUrl] = React.useState('');
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        userName: authUser.userName || '',
        email: authUser.email || '',
        password: '',
        role: authUser.role || '',
        profilePicture: authUser.profilePicture || ''
      });
      setImageFileUrl(authUser.profilePicture || '');
    }
  }, [authUser]);

  const handleCroppedImage = useCallback((croppedFile) => {
    setImageFile(croppedFile);
    const previewUrl = URL.createObjectURL(croppedFile);
    setImageFileUrl(previewUrl);
    setFormData((prev) => ({ ...prev, profilePicture: previewUrl }));
  }, []);

  const uploadImage = useCallback(() => {
    if (!imageFile) return;
    setIsUploading(true);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, `profiles/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(Math.round(progress));
      },
      (error) => {
        setIsUploading(false);
        setImageFileUploadingProgress(null);
        setImageFile(null);
        toast.error("Couldn't upload image. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFile(null);
          setIsUploading(false);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  }, [imageFile, toast]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile, uploadImage]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      toast.error('User data not loaded. Please refresh the page.');
      return;
    }

    if (isUploading) {
      toast.error('Please wait for the image upload to complete');
      return;
    }

    const hasChanges =
      formData.userName !== (authUser.userName || '') ||
      formData.email !== (authUser.email || '') ||
      formData.password !== '' ||
      formData.profilePicture !== (authUser.profilePicture || '');

    if (!hasChanges) {
      toast.error('No changes made to update');
      return;
    }

    const updateData = {
      userName: formData.userName,
      email: formData.email,
      profilePicture: formData.profilePicture
    };

    if (formData.password && formData.password.trim() !== '') {
      updateData.password = formData.password;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserInJson(authUser._id, updateData);
      updateAuthUser(updatedUser);
      toast.success('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!authUser) return;

    setShowDeleteModal(false);
    try {
      await deleteUserFromJson(authUser._id);
      toast.success('Account deleted successfully');
      await logout();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const getDisplayImage = () => {
    if (imageFileUrl) return imageFileUrl;
    if (authUser?.profilePicture) return authUser.profilePicture;
    return null;
  };

  const getRoleDisplayName = (role) => {
    return ROLE_CONFIG[role]?.label || role || 'User';
  };

  const roleConfig = ROLE_CONFIG[formData.role] || ROLE_CONFIG.user;

  if (!authUser) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-[#f7f9e8] via-[#fafcf3] to-[#f4f7e8]">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] flex items-center justify-center mb-5 shadow-xl shadow-[#8fa31e]/20 animate-pulse">
                <HiUser className="w-10 h-10 text-white" />
              </div>
              <p className="text-[#6b7d18] font-semibold text-lg">Loading profile...</p>
            </div>
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
            <div className="bg-gradient-to-r from-[#6b7d18] via-[#8fa31e] to-[#a5b82e] px-6 sm:px-8 py-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                    <HiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">My Profile</h1>
                    <p className="text-green-100 text-sm">Manage your account settings and information</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                    {getRoleDisplayName(formData.role)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Member Since</div>
                    <div className="text-sm font-bold text-gray-800">
                      {authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Account Status</div>
                    <div className="text-sm font-bold text-emerald-600">Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <HiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Email</div>
                    <div className="text-sm font-bold text-gray-800 truncate">{authUser.email || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <HiPencilAlt className="w-5 h-5 text-[#8fa31e]" />
                    Personal Information
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex flex-col items-center lg:w-56">
                    <ImageUploadCropper
                      onCropComplete={handleCroppedImage}
                      aspectRatio={1}
                      maxFileSizeMB={2}
                      modalTitle="Edit Profile Photo"
                    >
                      <div className="relative cursor-pointer group">
                        <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-[#d4de8a]/50 shadow-xl shadow-[#8fa31e]/10 relative bg-gray-100">
                          {isUploading && (
                            <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden">
                              <ImageCircleLoader progress={imageFileUploadingProgress || 0} />
                            </div>
                          )}
                          {getDisplayImage() ? (
                            <img
                              src={getDisplayImage()}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-gradient-to-br from-[#8fa31e] to-[#a5b82e] flex items-center justify-center hidden">
                            <span className="text-4xl font-bold text-white">
                              {formData.userName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                            <div className="text-center">
                              <svg className="w-8 h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-white text-xs font-medium">Change Photo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ImageUploadCropper>
                    <p className="text-xs text-gray-500 mt-3 text-center">Click to change photo</p>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <HiUser className="w-4 h-4 text-[#8fa31e]" />
                          Username
                        </label>
                        <input
                          type="text"
                          id="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          placeholder="Enter name"
                          className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <HiMail className="w-4 h-4 text-[#8fa31e]" />
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@gmail.com"
                          className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#8fa31e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Password
                          <span className="text-gray-400 font-normal text-xs">(leave blank to keep current)</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-[#f7f9e8]/50 focus:bg-white focus:border-[#8fa31e] focus:ring-2 focus:ring-[#d8e89d]/50 transition-all outline-none text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <HiShieldCheck className="w-4 h-4 text-[#8fa31e]" />
                          Role
                        </label>
                        <div className={`w-full border-2 px-4 py-3 rounded-xl text-sm font-semibold ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
                          {getRoleDisplayName(formData.role)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-semibold text-sm border border-red-200"
                    >
                      <HiTrash className="w-4 h-4" />
                      Delete Account
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
                    >
                      <VscSignOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || isUploading}
                    className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#6b7d18] to-[#8fa31e] hover:from-[#4a5c10] hover:to-[#6b7d18] shadow-lg shadow-[#8fa31e]/25 transition-all font-semibold rounded-xl"
                  >
                    {loading || isUploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="text-center text-sm text-[#6b7d18]/60 py-4">
            Profile updates are saved automatically. Changes take effect immediately.
          </div>
        </div>
      </div>

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
              <h3 className="text-xl font-bold text-gray-800 mb-3">Delete Account?</h3>
              <p className="text-gray-500 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
                <strong>Warning:</strong> This will delete your profile, settings, and all associated data.
              </div>
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
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
