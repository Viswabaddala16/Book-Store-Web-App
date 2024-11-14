import React, { useState } from 'react';
import {Routes,Route} from 'react-router-dom';
import ShowBook from './pages/ShowBook';
import CreateBook from './pages/CreateBook';
import DeleteBook from './pages/DeleteBook';
import EditBook from './pages/EditBook';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const[isLoggedIn,setIsLoggedIn] = useState(false);
  return (
    <Routes>
      <Route path = "/" 
      element = {<Home isLoggedIn = {isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
      />
      <Route path='/signup' 
        element={<Signup setIsLoggedIn = {setIsLoggedIn} />} 
      />
      <Route path='/login' 
        element={<Login setIsLoggedIn = {setIsLoggedIn} />} />
      <Route path='/forgot-password' element = {<ForgotPassword/>}/>
      <Route path='/reset-password' element = {<ResetPassword/>}/>
      <Route path = "/books/details/:id" 
        element = {<ShowBook/>} />
      <Route path = "/books/create" 
        element = {<CreateBook/>}/>
      <Route path = "/books/delete/:id" 
        element = {<DeleteBook/>}/>
      <Route path = "/books/edit/:id" 
        element = {<EditBook/>}/>
      
    </Routes>
  )
}

export default App;