import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { loginUser } from './helper';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  const [errors, setErrors] = useState({
    emailError: '',
    passwordError: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name === 'email' ? 'emailError' : 'passwordError']: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      emailError: '',
      passwordError: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!formData.email) {
      newErrors.emailError = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.emailError = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.passwordError = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.passwordError = 'Password must be at least 6 characters long and include at least one special character';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await loginUser(formData);


          localStorage.setItem('token', res.data.token);
          navigate('/home');

      } catch (error) {
        setErrors({
          emailError: error.emailError ,
          passwordError: error.passwordError 
        });
      }
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h2>Login Form</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.emailError && <div className="error">{errors.emailError}</div>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.passwordError && <div className="error">{errors.passwordError}</div>}

        <button type="submit">Submit</button>
      </form>

      <div className="register-link">
        <p>Not registered yet? <button onClick={() => navigate('/')}>Register here</button></p>
      </div>
    </div>
  );
}

export default Login;
