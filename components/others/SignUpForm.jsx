"use client";
import { useDispatch } from "react-redux";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { registerUser, socialLogin } from "@/store/authSlice/authSlice";

export default function SignUpForm() {
  const dispatch = useDispatch();
  const [role, setRole] = useState(""); // State for selected role
  const [loading, setLoading] = useState(false); // State for loading status
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value) => {
    setRole(value);
    localStorage.setItem("role", value); // Store the role in local storage
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { duration: 3000 });
      return;
    }

    if (!role) {
      toast.error("Please select a role to proceed", { duration: 3000 });
      return;
    }

    setLoading(true);
    dispatch(registerUser({ ...formData, role }))
      .unwrap()
      .then(() => {
        toast.success("Account created successfully!");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.message || "Sign-up failed");
        setLoading(false);
      });
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const { provider, accessToken } = session; // Get provider and token from session
      dispatch(socialLogin({ provider, role, token: accessToken })).unwrap();
    }
  }, [session, dispatch, role]);

  const handleLogin = async (provider) => {
    if (!role) {
      toast.error("Please select a role to proceed", { duration: 3000 });
      return;
    }

    setLoading(true);

    try {
      const response = await signIn(provider, { redirect: false, popup: true });
      if (response?.error) {
        throw new Error(response.error);
      }
      toast.success(`Logged in via ${provider}`);
    } catch (error) {
      toast.error(error?.message || `Login via ${provider} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page__content lg:py-50">
      <Toaster />
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-8 col-lg-9">
            <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">Sign Up</h3>
              <p className="mt-10">
                Already have an account? <Link href="/login" className="text-purple-1">Log in</Link>
              </p>

              {/* Step 1: Role Selector */}
              {role === "" ? (
               <div className="col-12 mt-4">
               <label className="text-16 lh-1 fw-500 text-dark-1 mb-10" style={{fontWeight:"bolder !important"}}>
                 Select Your Role *
               </label>
               <div className="flex gap-4">
                 <div className="flex align-items-center justify-content-center">
                   <input
                     type="radio"
                     id="student"
                     name="role"
                     value="student"
                     checked={role === "student"}
                     onChange={(e) => handleRoleChange(e.target.value)}
                     style={{
                       appearance: 'none',
                       width: '20px',
                       height: '20px',
                       borderRadius: '50%',
                       border: '2px solid #34D399', // Green accent for 'student'
                       backgroundColor: '#fff',
                       position: 'relative',
                       cursor: 'pointer',
                       marginRight: '10px',
                       marginTop:"5px",
          
                       transition: 'all 0.3s ease', // Smooth transition
                     }}
                   />
                   <label
                     htmlFor="student"
                     className="ml-2 text-16 lh-1 fw-500 text-dark-1 "
                     style={{
                       fontSize: '16px',
                       fontWeight: '500',
                       color: '#333',
                       transition: 'color 0.3s ease', // Smooth label transition
                     }}
                   >
                     Student
                   </label>
                 </div>
                 <div className="flex items-center">
                   <input
                     type="radio"
                     id="instructor"
                     name="role"
                     value="instructor"
                     checked={role === "instructor"}
                     onChange={(e) => handleRoleChange(e.target.value)}
                     style={{
                       appearance: 'none',
                       width: '20px',
                       height: '20px',
                       borderRadius: '50%',
                       border: '2px solid #3B82F6', // Blue accent for 'instructor'
                       backgroundColor: '#fff',
                       position: 'relative',
                       cursor: 'pointer',
                       marginRight: '10px',
                       transition: 'all 0.3s ease', // Smooth transition
                     }}
                   />
                   <label
                     htmlFor="instructor"
                     className="ml-2 text-16 lh-1 fw-500 text-dark-1"
                     style={{
                       fontSize: '16px',
                       fontWeight: '500',
                       color: '#333',
                       transition: 'color 0.3s ease', // Smooth label transition
                     }}
                   >
                     Instructor
                   </label>
                 </div>
               </div>
             </div>
             
              ) : (
                // Step 2: Form Fields
                <form
                  className="contact-form respondForm__form row y-gap-20 pt-30"
                  onSubmit={handleSubmit}
                >
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Email address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Username *
                    </label>
                    <input
                      required
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Password *
                    </label>
                    <input
                      required
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Confirm Password *
                    </label>
                    <input
                      required
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                      disabled={loading}
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : "Register"}
                    </button>
                  </div>
                </form>
              )}
              {!role ? <>
              </> :<>
              <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                Or sign in using
              </div>

              <div className="d-flex x-gap-20 items-center justify-between pt-20">
                <button
                  onClick={() => handleLogin("facebook")}
                  className="button -sm px-24 py-20 -outline-blue-3 text-blue-3 text-14"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Log In via Facebook"}
                </button>
                <button
                  onClick={() => handleLogin("google")}
                  className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Log In via Google+"}
                </button>
              </div>
              </> }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
