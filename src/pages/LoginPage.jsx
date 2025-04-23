import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'; 

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        localStorage.setItem('token',result.access)
        navigate('/');
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Log in</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label className="label">Username</label>
            <input
              type="text"
              {...register("username", { required: "username is required" })}
              className="input"
            />
            {errors.username && <span className="error">{errors.username.message}</span>}
          </div>

          <div className="input-group">
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="input"
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="button">
            Log in
          </button>
        </form>

        <div className="switch-text">
           <span className="link" onClick={() => navigate('/auth/signup')}>sign up</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
