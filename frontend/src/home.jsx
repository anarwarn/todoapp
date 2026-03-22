import { useState } from 'react';

function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        
        <div className="login">
            <h1>Login</h1>
            <input type="email" className="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <div>
                 <button >Next</button>
                 <button >Sign Up</button>
            </div>
            <a href="https://github.com/">Forgot my password</a>
        </div>
    )
}

export default LoginPage