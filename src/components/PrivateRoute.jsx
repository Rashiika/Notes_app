import React from 'react'
import { UserAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {session} = UserAuth();
  if (session === undefined) {
    return <div className="text-white text-center pt-10">Loading...</div>;
  }
  if (!session) {
    return <Navigate to="/signin" replace />;
  }

   return children;
};

export default PrivateRoute