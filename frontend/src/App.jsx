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
import PdfUpload from './components/Book Upload/PdfUpload';
import Cart from './components/Cart/Cart.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderConfirmation from './pages/OrderConformation.jsx';
function App() {
  
  return (
    <Routes>
      <Route path = "/" 
      element = {<Home />}
      />
      <Route path = "/cart" 
        element = {<Cart />}
      /> 
      <Route path = "/checkout" 
      element = {<CheckoutPage />}
      /> 
      <Route path = "/order-confirmation" 
      element = {<OrderConfirmation />}
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
      <Route path = "/books/upload" 
        element = {<PrivateRoute><PdfUpload /></PrivateRoute>}/>
      
    </Routes>
  )
}

export default App;