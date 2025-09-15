import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

// Firebase configuration (you'll need to add your own config)
const firebaseConfig = {
  apiKey: "AIzaSyBGQi9qZFMH8AetnLyuUUjIsGuDskCEvuU",
  authDomain: "climatehub-sg.firebaseapp.com",
  projectId: "climatehub-sg",
  storageBucket: "climatehub-sg.firebasestorage.app",
  messagingSenderId: "715949078105",
  appId: "1:715949078105:web:7cf8e74ebcb59096de6348",
  measurementId: "G-RP7CSSBQCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send user data to backend
      const response = await axios.post('/api/auth/login', {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Successfully signed in!');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Send user data to backend
      const response = await axios.post('/api/auth/login', {
        firebaseUid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Successfully signed in!');
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      toast.error('Failed to sign in');
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Send user data to backend
      const response = await axios.post('/api/auth/login', {
        firebaseUid: user.uid,
        email: user.email,
        displayName: displayName || user.email,
        photoURL: user.photoURL
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      console.error('Email sign-up error:', error);
      toast.error('Failed to create account');
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Get user profile from backend
  const getUserProfile = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return null;

      const response = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return response.data.user;
      }
    } catch (error) {
      console.error('Get profile error:', error);
    }
    return null;
  };

  // Refresh user profile and update state
  const refreshUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await axios.put('/api/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return response.data.user;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user profile from backend
        const profile = await getUserProfile();
        if (profile) {
          setUser(profile);
        } else {
          // Fallback to Firebase user data
          setUser({
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    getUserProfile,
    refreshUserProfile,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 