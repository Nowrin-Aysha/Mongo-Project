import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { registerUser } from './helper';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formError, setFormError] = useState(''); 
  const [errors, setErrors] = useState({
    nameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  });
const token=localStorage.getItem('token')
useEffect(()=>{
  if(token){
    navigate('/home')
  }
},[])
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    };

    
    if (!formData.name) {
      newErrors.nameError = 'Name is required';
      isValid = false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.emailError = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.emailError = 'Invalid email format';
      isValid = false;
    }

    
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!formData.password) {
      newErrors.passwordError = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.passwordError = 'Password must be at least 6 characters long and include at least one special character';
      isValid = false;
    }

    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    setFormError('');
  
    
    if (validateForm()) {
      try {
        await registerUser(formData);
        navigate('/login');
      } catch (error) {
        console.error('Error occurred during registration:', error);
  
        
        if (error.error && error.error.includes('Email already in use')) {
          setErrors(prevErrors => ({
            ...prevErrors,
            emailError: 'Email is already in use'
          }));
        } else {
         
          setFormError('Email already in use');
        }
      }
    }
  };
  

  return (
    <div className="App">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <div className={`error ${errors.nameError ? '' : 'hidden'}`}>{errors.nameError}</div>

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className={`error ${errors.emailError ? '' : 'hidden'}`}>{errors.emailError}</div>

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className={`error ${errors.passwordError ? '' : 'hidden'}`}>{errors.passwordError}</div>

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <div className={`error ${errors.confirmPasswordError ? '' : 'hidden'}`}>{errors.confirmPasswordError}</div>

        <button type="submit">Register</button>
      </form>

      <div className="login-link">
        <p>Already have an account? <button onClick={() => navigate('/login')}>Login here</button></p>
      </div>
    </div>
  );
}

export default Register;
