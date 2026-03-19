import React from 'react';
import { Button } from 'flowbite-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDefaultRouteByRole } from '../utils/auth';
import { AiFillGoogleCircle } from 'react-icons/ai';

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname.includes('sign-up');

  const [loading, setLoading] = React.useState(false);
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
    if (loading) return;
    setLoading(true);
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
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        await preloadImage(data.profilePicture);
        
        const userRole = data.role || data.userRole || 'user';
        
        dispatch(signInSuccess({
          user: data,
          role: userRole,
          token: data.token || null
        }));
        
        const redirectPath = getDefaultRouteByRole(userRole);
        navigate(redirectPath);
      } else {
        console.error('OAuth sign-in failed:', data);
      }
    } catch (error) {
      if (!res.ok) {
        throw new Error(data.message || 'OAuth failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      outline
      className=" uppercase !bg-[#8fa31e] hover:!bg-[#7a8c1a] text-white !rounded-lg border-none"
      onClick={handleGoogleClick}
      disabled={loading}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      {loading
        ? 'Please wait...'
        : isSignup
          ? 'Signup with Google'
          : 'Signin with Google'}
    </Button>
  );
}
