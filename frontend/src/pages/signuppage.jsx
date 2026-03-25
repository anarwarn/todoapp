function SignupPage() {
    return (
        <div className="signup">
            <h1>Sign Up</h1>
            <input type="text" className="name" placeholder="Name" />
            <input type="email" className="email" placeholder="Email" />
            <input type="password" className="password" placeholder="Password" />
            <button>Sign Up</button>
        </div>
    )
}

export default SignupPage