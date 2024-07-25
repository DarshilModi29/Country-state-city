import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./login.css"
import Swal from 'sweetalert2';

export default function Login(props) {
    useEffect(() => {
        document.title = props.heading;

        const container = document.getElementById("container");
        const overlayBtn = document.getElementById("overlayBtn");

        const handleOverlayClick = () => {
            if (container) {
                container.classList.toggle('right-panel-active');
            }

            if (overlayBtn) {
                overlayBtn.classList.remove('btnScaled');

                window.requestAnimationFrame(() => {
                    overlayBtn.classList.add('btnScaled');
                });
            }
        };

        if (overlayBtn) {
            overlayBtn.addEventListener('click', handleOverlayClick);
        }
        return () => {
            if (overlayBtn) {
                overlayBtn.removeEventListener('click', handleOverlayClick);
            }
        };
    }, [props.heading]);

    const [user, setUser] = useState({ signup_name: "", signup_email: "", signup_password: "" });

    const navigate = useNavigate();

    const onChangeSignUp = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const createUser = async (e) => {
        const userData = { name: user.signup_name, email: user.signup_email, password: user.signup_password }
        try {
            e.preventDefault();
            const resp = await fetch("http://localhost:5000/createUser", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await resp.json();
            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message
                })
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: data.message
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error Occurred!',
                text: error.toString()
            })
        }
    }

    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resp = await fetch("http://localhost:5000/loginUser", {
            method: "POST",
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await resp.json();
        if (!data.success) {
            alert("Enter Valid Credentials");
        }
        if (data.success) {
            localStorage.setItem("jwt", data.authToken);
            navigate("/");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="body">
                <div className='container-class' id="container">
                    <div className="form-container sign-up-container">
                        <form className='form' onSubmit={createUser}>
                            <h1 className="heading1">Create Account</h1>
                            <div className="social-container">
                                <a href="https://www.facebook.com" className="social anchor"><i className="bi bi-google"></i></a>
                                <a href="https://www.google.com" className="social anchor"><i className="bi bi-facebook"></i></a>
                            </div>
                            <span className='span'>or use your email for registration</span>
                            <div className="infield">
                                <input className='inputTag' type="text" placeholder="Name" name='signup_name' value={user.name} onChange={onChangeSignUp} />
                                <label className="label"></label>
                            </div>
                            <div className="infield">
                                <input className='inputTag' type="email" placeholder="Email" name="signup_email" value={user.email} onChange={onChangeSignUp} />
                                <label className="label"></label>
                            </div>
                            <div className="infield">
                                <input className='inputTag' type="password" placeholder="Password" name='signup_password' value={user.password} onChange={onChangeSignUp} />
                                <label className="label"></label>
                            </div>
                            <button className='btnGroup'>Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form className='form' onSubmit={handleSubmit}>
                            <h1 className="heading1">Sign in</h1>
                            <div className="social-container">
                                <a href="https://www.facebook.com" className="social anchor"><i className="bi bi-facebook"></i></a>
                                <a href="https://www.google.com" className="social anchor"><i className="bi bi-google"></i></a>
                            </div>
                            <span className='span'>or use your account</span>
                            <div className="infield">
                                <input className='inputTag' type="email" placeholder="Email" name="email" value={credentials.email} onChange={onChange} />
                                <label className="label"></label>
                            </div>
                            <div className="infield">
                                <input className='inputTag' type="password" placeholder="Password" name='password' value={credentials.password} onChange={onChange} />
                                <label className="label"></label>
                            </div>
                            <a href="/login" className="forgot anchor">Forgot your password?</a>
                            <button className='btnGroup'>Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container" id="overlayCon">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1 className="heading1">Welcome Back</h1>
                                <p className='para'>To keep connected with us please login with your personal info</p>
                                <button className='btnGroup'>Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1 className="heading1">Hello, Friend!</h1>
                                <p className='para'>Enter your personal details and start journey with us</p>
                                <button className='btnGroup'>Sign Up</button>
                            </div>
                        </div>
                        <button id="overlayBtn"></button>
                    </div>
                </div>
            </div>
        </>
    )
}
