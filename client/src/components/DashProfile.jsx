import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { app } from '../firebase';
import ImageCircleLoader from '../components/ImageCircleLoader';
import { DashboardContent } from '../components/DashboardLayout';
import { useToast } from '../components/Toast';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
  clearError
} from '../redux/user/userSlice';
import { logoutUser, updateUserInJson, deleteUserFromJson } from '../services/userApi';
import { HiOutlineExclamationCircle, HiTrash } from 'react-icons/hi';
import { VscSignOut } from 'react-icons/vsc';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();

  useEffect(() => {
    if (imageFileUploadingError) {
      toast.error(imageFileUploadingError)
      setImageFileUploadingError(null)
    }
  }, [imageFileUploadingError, toast])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error, toast])

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageFileUploadingError('Only image files are allowed.');
      e.target.value = null;
      return;
    }

    const limitInBytes = 2 * 1024 * 1024;

    if (file.size > limitInBytes) {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      try {
        setIsUploading(true);
        setImageFileUploadingError(null);

        const compressedFile = await imageCompression(file, options);

        setImageFile(compressedFile);
        setImageFileUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error(error);
        setImageFileUploadingError('Compression failed. Try a smaller photo.');
      } finally {
        setIsUploading(false);
      }
    } else {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadingError(null);
    }
    setImageFileUploadingError(null);
  };

  const uploadImage = useCallback(() => {
    if (!imageFile) return;
    setIsUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
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
        setImageFileUrl(null);
        setImageFileUploadingError("couldn't upload image (image size exceeds 2MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setIsUploading(false);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  }, [imageFile]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile, uploadImage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      toast.error('Please wait for the image upload to complete');
      return;
    }

    if (Object.keys(formData).length === 0) {
      toast.error('No changes made to update');
      return;
    }

    try {
      dispatch(clearError());
      dispatch(updateUserStart());
      const updatedUser = await updateUserInJson(currentUser._id, formData);
      dispatch(updateUserSuccess(updatedUser));
      toast.success('User Profile updated successfully!');
      setFormData({});
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      await deleteUserFromJson(currentUser._id);
      dispatch(deleteUserSuccess());
      dispatch(signOutSuccess());
      toast.success('Account deleted successfully');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      dispatch(signOutSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardContent>
      <div className="p-3 w-full max-w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-10 items-start relative">
            <div
              className="relative w-36 h-36 flex-shrink-0 cursor-pointer group"
              onClick={() => filePickerRef.current.click()}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />

              <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#DEF7EC] shadow-inner relative">
                {isUploading && (
                  <div className="absolute inset-0 z-10">
                    <ImageCircleLoader progress={imageFileUploadingProgress || 0} />
                  </div>
                )}
                <img
                  src={imageFileUrl || currentUser?.profilePicture || 'https://via.placeholder.com/150'}
                  alt="user"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-medium">
                    Change Photo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Name</label>
                <input
                  type="text"
                  id="userName"
                  placeholder="Enter name"
                  defaultValue={currentUser?.userName}
                  onChange={handleChange}
                  className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@gmail.com"
                  defaultValue={currentUser?.email}
                  onChange={handleChange}
                  className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  onChange={handleChange}
                  className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Role</label>
                <select
                  id="role"
                  defaultValue={currentUser?.role}
                  disabled
                  className="w-full border-gray-200 p-3 !rounded-[5px] bg-white focus:!ring-[#8fa31e] focus:!border-[#8fa31e]"
                >
                  <option value="superAdmin">SuperAdmin</option>
                  <option value="admin">Admin</option>
                  <option value="storeManager">Store Manager</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mt-4 border-t pt-6">
                <Button
                  type="submit"
                  className={`w-full lg:w-[30%] !rounded-[4px] border-none text-white font-medium transition-all duration-300 ${
                    isUploading || loading
                      ? '!bg-[#8fa31e]/60 cursor-not-allowed opacity-70'
                      : '!bg-[#8fa31e] hover:!bg-[#7a8c1a] hover:shadow-lg hover:scale-[1.02]'
                  }`}
                  disabled={loading || isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update'
                  )}
                </Button>

                <div className=" w-full flex gap-3 lg:w-[30%] lg:gap-5">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className=" w-1/2 flex items-center justify-center gap-2 !bg-[#CC0001] hover:!bg-[#ea2020] text-white px-4 py-2 rounded-[4px] font-medium transition-colors"
                  >
                    <HiTrash className="text-lg" />
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-1/2 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-[4px] font-medium hover:bg-gray-50 transition-colors"
                  >
                    <VscSignOut className="text-lg text-red-500" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500">
                Are you sure you want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </DashboardContent>
  );
}
