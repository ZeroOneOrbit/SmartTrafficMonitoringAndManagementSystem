import { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import { auth } from '../firebase/firebase.config'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: 'Md Shahariar Islam Rafi',
    email: 'rafi@example.com',
    password: '',
    confirmPassword: '',
    phone: '01712345678',
    role: 'user',
  })
  const [statusMessage, setStatusMessage] = useState('')
  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')

  // 1. Fetch Users List via GET on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
          // Fixed: Removed the empty broken 'body:' property
        })
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        setUsersError(error.message)
      }
    }

    fetchUsers()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  // 2. Handle Form Submission (Login or POST Registration)
  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatusMessage('') // Reset message

    // Client-side validation for matching passwords
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setStatusMessage('Passwords do not match. Please try again.')
      return
    }

    if (isLogin) {
      // Handle Login via GET /api/user/:email with password in body
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      if (!userCredential.user) {
        throw new Error('Firebase authentication failed')
      }

      const Token = await userCredential.user.getIdToken()



        const response = await fetch(`http://localhost:5000/api/user/me`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${Token}`,
            'Content-Type': 'application/json',
          }
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Login failed')
        }
        console.log('Login successful:', data)

        setStatusMessage(`Login successful! Welcome, ${data.data.name}`)
        // Clear sensitive fields after successful login
        setFormData(prev => ({ ...prev, password: '' }))

      } catch (error) {
        setStatusMessage(`Error: ${error.message}`)
      }
      return
    }

    // Prepare payload for Registration POST request
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password, 
      phone: formData.phone,
      role: formData.role || 'user',
    }

    try {
      // Execute POST request to your backend API
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setStatusMessage('Account created successfully! Switching to Login...')
      
      // Clear sensitive fields and redirect to login panel after 2 seconds
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      setTimeout(() => setIsLogin(true), 2000)

      // Optional: Refresh the user list to show the newly added user right away
      const refreshedResponse = await fetch('http://localhost:5000/api/user/admin',)
      if (refreshedResponse.ok) {
        const refreshedData = await refreshedResponse.json()
        setUsers(Array.isArray(refreshedData) ? refreshedData : [])
      }

    } catch (error) {
      setStatusMessage(`Error: ${error.message}`)
    }
  }

  const handleSocialLogin = async (provider) => {
    
    
    const socialProvider = provider === 'Google' ? new GoogleAuthProvider() : null; // Extend for other providers like Facebook if needed
    try {
      const res= await signInWithPopup(auth, socialProvider);

      const Token = await res.user.getIdToken();
      
      
      const response = await fetch(`http://localhost:5000/api/user/firebase`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${Token}`,
          'Content-Type': 'application/json',
        }
      } )

      const data = await response.json();
      console.log(data);
    


    }
     catch (error) {
      setStatusMessage(`Error: ${error.message}`)
    }
   
  }


  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome</p>
          <h1>{isLogin ? 'Sign in to continue' : 'Create your account'}</h1>
          <p>
            Access your dashboard with a secure email flow or continue with your
            favorite social provider.
          </p>
        </div>

        <div className="toggle-row" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setStatusMessage('')
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setStatusMessage('')
            }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="field">
              <span>Full name</span>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>
          )}

          <label className="field">
            <span>Email address</span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          {!isLogin && (
            <label className="field">
              <span>Phone number</span>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01712345678"
                required
              />
            </label>
          )}

          {!isLogin && (
            <label className="field">
              <span>Role</span>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="driver">Driver</option>
              </select>
            </label>
          )}

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </label>

          {!isLogin && (
            <label className="field">
              <span>Confirm password</span>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </label>
          )}

          <button type="submit" className="primary-btn">
            {isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-btn google"
            onClick={() => handleSocialLogin('Google')}
          >
            Continue with Google
          </button>
         
        </div>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        <div className="users-section">
          <div className="users-header">
            <h2>Users from API</h2>
            <p>Fetched from http://localhost:5000/api/user</p>
          </div>

          {usersError ? (
            <p className="users-error">{usersError}</p>
          ) : users.length === 0 ? (
            <p className="users-empty">No users loaded yet.</p>
          ) : (
            <ul className="users-list">
              {users.map((user) => (
                <li key={user._id || user.email} className="user-item">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.role || 'user'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App