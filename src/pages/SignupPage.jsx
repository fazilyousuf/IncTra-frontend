import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'; 

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://inctra-backend-00di.onrender.com/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Signup Success:', result);
        navigate('/'); // Redirect to login
      } else {
        console.error('Signup Failed:', result);
        navigate('/auth/signup')
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Sign up</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label className="label">Username</label>
            <input
              type="text"
              placeholder="JohnDoe"
              {...register("username", { required: "Name is required" })}
              className="input"
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="input-group">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              {...register("email", { required: "Email is required" })}
              className="input"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
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
            Sign up
          </button>
        </form>

        <div className="switch-text">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate('/auth/login')}>log in</span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
