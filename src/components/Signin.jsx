import React , {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import toast from 'react-hot-toast';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    const {session, signInUser} = UserAuth();
    const navigate = useNavigate()
    console.log(session);

    const handleSignIn =async (e) => {
        e.preventDefault();
         const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        try{
            const result = await signInUser(email, password)
            if (!result.success) {
                toast.error(result.error || 'Invalid credentials. Please try again.')
                return
            }
            toast.success('Sign-in successful! Redirecting...')
            setTimeout(() => navigate('/dashboard'), 1500)
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Unexpected error during sign in.')
          } finally{
            setLoading(false);
            }
    }
 
  return (
    <div>
        <h1 className="text-center pt-4 text-3xl text-white">Authorization</h1> 
        <form onSubmit={handleSignIn} className='max-w-md m-auto pt-24'>
            <h2 className="font-bold pb-2 text-white">Sign In</h2>
            <p className="text-white">Don't have an account? <Link to="/signup">Sign up!</Link></p>
            <div className='flex flex-col py-4'>
                <input onChange={(e)=> setEmail(e.target.value)} className="p-3 mt-6" type="email" placeholder='Email'/>
                <input onChange={(e)=> setPassword(e.target.value)} className="p-3 mt-6" type="password" placeholder='Password'/>
                <button type="submit" disabled={loading} className='mt-6 w-full text-white'>Sign in</button>
                {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
            </div>
        </form>
    </div>
  )
}

export default Signin