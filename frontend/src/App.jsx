import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import {useAuthStore} from './store/useAuthStore';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUser} = useAuthStore();
  const {theme} = useThemeStore();

  // console.log("userId:",authUser._id);

  console.log(onlineUser);
  useEffect(() => {
   useAuthStore.getState().checkAuth(); 
  }, []);


  useEffect(() => {
  if (authUser) {
    useAuthStore.getState().connectSocket(); 
  }
 }, [authUser]);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
// console.log("theme is:",theme);

  // console.log({authUser});

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  
  return (
    <div data-theme={theme}>

      <Navbar />


      <Routes>
        <Route path='/' element = {authUser ? <HomePage />: <Navigate to="/Login" />} />
        <Route path='/Signup' element = {!authUser ? <SignUpPage /> : <Navigate to="/Login" />} />
        <Route path='/Login' element = {!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/Setting' element = {<SettingsPage />} />
        <Route path='/Profile' element = {authUser ? <ProfilePage /> : <Navigate to="/Login" />} />
      </Routes>

      <Toaster />

    </div>
    
  );
};

export default App


