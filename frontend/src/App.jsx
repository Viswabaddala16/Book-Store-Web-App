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
import PrivateRoute from './components/PrivateRoute';

function App() {
  
  return (
    <Routes>
      <Route path = "/" 
      element = {<Home />}
      />  
      <Route path='/signup' 
        element={<Signup />} 
      />
      <Route path='/login' 
        element={<Login  />} />
      <Route path='/forgot-password' element = {<ForgotPassword/>}/>
      <Route path='/reset-password' element = {<ResetPassword/>}/>
      <Route path = "/books/details/:id" 
        element = {<PrivateRoute><ShowBook/></PrivateRoute>} />
      <Route path = "/books/create" 
        element = {<PrivateRoute><CreateBook/></PrivateRoute>}/>
      <Route path = "/books/delete/:id" 
        element = {<PrivateRoute><DeleteBook/></PrivateRoute>}/>
      <Route path = "/books/edit/:id" 
        element = {<PrivateRoute><EditBook/></PrivateRoute>}/>
      
    </Routes>
  )
}

export default App;