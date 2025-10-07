import React , {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    const {session, signUpNewUser} = UserAuth();
    const navigate = useNavigate()
    console.log(session);

    const handleSignUp =async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const result = await signUpNewUser(email, password)
            if(result.success){
                navigate('/dashboard');
            }
        } catch(error){
            setError("An error occured");
        }finally{
            setLoading(false);
        }
    }
 
  return (
    <div>
        <form onSubmit={handleSignUp} className='max-w-md m-auto pt-24'>
            <h2 className="font-bold pb-2 text-white">Sign up today!!</h2>
            <p className="text-white">Already have an account? <Link to="/signin">Sign in!</Link></p>
            <div className='flex flex-col py-4'>
                <input onChange={(e)=> setEmail(e.target.value)} className="p-3 mt-6" type="email" placeholder='Email'/>
                <input onChange={(e)=> setPassword(e.target.value)} className="p-3 mt-6" type="password" placeholder='Password'/>
                <button type="submit" disabled={loading} className='mt-6 w-full text-white'>Sign up</button>
                {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
            </div>
        </form>
    </div>
  )
}

export default Signup