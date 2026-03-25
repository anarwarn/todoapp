import { useState } from 'react';
import { Link } from "react-router-dom";

function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        
        <div className="login">
            <h1>Login</h1>
            <input type="email" className="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <div>
                 <button>Next</button>
                 <button >Sign Up</button>
            </div>

            
            <Link to="/signup">Don't have an account? Sign Up</Link>

            <a href="https://github.com/">Forgot my password</a>
        </div>
    )
}

export default LoginPage