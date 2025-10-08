import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const Confirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        // Get session after email confirmation
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error(error);
          toast.error("Error verifying your email.");
          return;
        }

        if (data?.session) {
          toast.success("Email verified! Redirecting...");
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          toast("Email verified! Please sign in.");
          setTimeout(() => navigate('/signin'), 1500);
        }
      } catch (err) {
        console.error("Error confirming email:", err);
        toast.error("Something went wrong.");
      }
    };

    handleConfirm();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gray-900">
      <h1>Verifying your email...</h1>
    </div>
  );
};

export default Confirm;
