import React from 'react';
import { Button } from 'flowbite-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { AiFillGoogleCircle } from 'react-icons/ai';

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        await preloadImage(data.profilePicture);
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        console.error('OAuth sign-in failed:', data);
      }
    } catch (error) {
      console.log('Google sign-in error:', error);
    }
  };

  return (
    <Button
      type="button"
      outline
      className=" uppercase !bg-[#8fa31e] hover:!bg-[#7a8c1a] text-white !rounded-lg border-none"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Signup with Google
    </Button>
  );
}
