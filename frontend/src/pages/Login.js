import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
onChange={handleChange}
style={styles.input}
placeholder="Enter your password"
required
/>
</div>
      <button
        type="submit"
        style={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <p style={styles.linkText}>
      Don't have an account?{' '}
      <Link to="/signup" style={styles.link}>
        Sign up here
      </Link>
    </p>
  </div>
</div>
);
};
const styles = {
container: {
minHeight: '100vh',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
backgroundColor: '#f5f5f5',
padding: '2rem',
},
formCard: {
backgroundColor: 'white',
padding: '2.5rem',
borderRadius: '8px',
boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
width: '100%',
maxWidth: '450px',
},
title: {
fontSize: '2rem',
fontWeight: 'bold',
color: '#2c3e50',
marginBottom: '0.5rem',
textAlign: 'center',
},
subtitle: {
color: '#7f8c8d',
textAlign: 'center',
marginBottom: '2rem',
},
error: {
backgroundColor: '#fee',
color: '#c33',
padding: '0.75rem',
borderRadius: '4px',
marginBottom: '1rem',
border: '1px solid #fcc',
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '1.25rem',
},
formGroup: {
display: 'flex',
flexDirection: 'column',
gap: '0.5rem',
},
label: {
fontWeight: '500',
color: '#2c3e50',
fontSize: '0.95rem',
},
input: {
padding: '0.75rem',
border: '1px solid #ddd',
borderRadius: '4px',
fontSize: '1rem',
transition: 'border-color 0.3s',
},
submitButton: {
backgroundColor: '#3498db',
color: 'white',
padding: '0.875rem',
border: 'none',
borderRadius: '4px',
fontSize: '1rem',
fontWeight: '500',
cursor: 'pointer',
marginTop: '0.5rem',
transition: 'background-color 0.3s',
},
linkText: {
textAlign: 'center',
marginTop: '1.5rem',
color: '#7f8c8d',
},
link: {
color: '#3498db',
textDecoration: 'none',
fontWeight: '500',
},
};
export default Login;