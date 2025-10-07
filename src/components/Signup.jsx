import React , {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'; 

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    // const [error, setError] = useState('');

    const {session, signUpNewUser} = UserAuth();
    const navigate = useNavigate()
    console.log(session);

    const handleSignUp =async (e) => {
        e.preventDefault();
        setLoading(true);
        // setError('');
        try{
            const result = await signUpNewUser(email, password);

      if (!result.success) {
        if (result.error.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(result.error || 'An error occurred during sign up.');
        }
        return;
      }
        toast.success('Signup successful! Please sign in.');
    setTimeout(() => navigate('/signin'), 1500);

    //   if (result.data?.user) {
    //     toast.success('Signup successful! Redirecting...');
    //     setTimeout(() => navigate('/dashboard'), 1500);
    //   }
    } catch (error) {
      console.error(error);
      toast.error(error.message||'Unexpected error during sign up.');
    } finally {
      setLoading(false);
    }
    };
 
  return (
    <div>
        <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
            <h2 className="font-bold pb-2 text-white">Sign up today!!</h2>
            <p className="text-white">Already have an account? <Link to="/signin">Sign in!</Link></p>
            <div className='flex flex-col py-4'>
                <input onChange={(e)=> setEmail(e.target.value)} className="p-3 mt-6" type="email" placeholder='Email' required/>
                <input onChange={(e)=> setPassword(e.target.value)} className="p-3 mt-6" type="password" placeholder='Password' required/>
                <button type="submit" disabled={loading} className='mt-6 w-full text-white'>Sign up</button>
                 {loading ? 'Signing up...' : 'Sign up'}
                {/* {error && <p className='text-red-600 text-center pt-4'>{error}</p>} */}
            </div>
        </form>
    </div>
  )
}

export default Signup