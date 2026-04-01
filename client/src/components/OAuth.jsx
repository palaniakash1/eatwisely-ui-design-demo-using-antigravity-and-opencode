import React from 'react';
import { Button } from 'flowbite-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDefaultRouteByRole } from '../utils/auth';
import { AiFillGoogleCircle } from 'react-icons/ai';

export default function OAuth() {
  const auth = getAuth(app);
  const { loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname.includes('sign-up');

  const preloadImage = (src) => {
    if (!src) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });
  };

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    if (isLoading) return;
    
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      const result = await loginWithGoogle({
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL
      });

      if (result.success) {
        await preloadImage(result.user.profilePicture);
        
        const userRole = result.user.role || result.user.userRole || 'user';
        const redirectPath = getDefaultRouteByRole(userRole);
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('OAuth sign-in failed:', error);
    }
  };

  return (
    <Button
      type="button"
      outline
      className=" uppercase !bg-[#8fa31e] hover:!bg-[#7a8c1a] text-white !rounded-lg border-none"
      onClick={handleGoogleClick}
      disabled={isLoading}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      {isLoading
        ? 'Please wait...'
        : isSignup
          ? 'Signup with Google'
          : 'Signin with Google'}
    </Button>
  );
}
