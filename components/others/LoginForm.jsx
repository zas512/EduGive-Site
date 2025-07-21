"use client";
import { useDispatch } from "react-redux";
import { signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";
import { loginUser, socialLogin } from "@/store/authSlice/authSlice";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter hook for redirection
  const [role, setRole] = useState(""); // State for selected role
  const [loading, setLoading] = useState(false); // State for loading status
  const[isadminRole,setIsAdminRole] = useState(""); // State to check if admin role is selected
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value) => {
    setRole(value);
    localStorage.setItem("role", value); // Store the role in local storage
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setIsAdminRole(savedRole); // Set role from localStorage if it exists
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role to proceed", { duration: 3000 });
      return;
    }
    setLoading(true);

    try {
      const response = await dispatch(loginUser({ ...formData, role }));

      if (loginUser.fulfilled.match(response)) {
        // Redirect based on user role
        if (response.payload.user.role === "admin" || response.payload.user.role === "instructor") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }

    } catch (error) {
      toast.error(error.message || "Login failed", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
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
      dispatch(socialLogin({ provider, role, token: response?.accessToken }));

      if (role === "student") {
        router.push("/"); // Redirect student to homepage
      } else {
        router.push("/dashboard"); // Redirect instructor/admin to dashboard
      }
    } catch (error) {
      toast.error(error?.message || `Login via ${provider} failed`, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page__content lg:py-50">
      <Toaster />
      <div className="container">
        <div className="row justify-center items-center">
          <div className="col-xl-6 col-lg-8">
            <div className="px-50 py-50 md:px-25 md:py-25 bg-white shadow-1 rounded-16">
              <h3 className="text-30 lh-13">Login</h3>
              <p className="mt-10">
                Don't have an account yet? <Link href="/signup" className="text-purple-1 ml-2">
                  Sign up for free
                </Link>
              </p>

              {/* Role selection step */}
              {!role ? (
                <div>
                  <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                    Select Your Role *
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="student"
                        name="role"
                        value="student"
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="accent-green-500"
                      /> <label htmlFor="student" className="ml-4 text-16 lh-1 fw-500 text-dark-1">
                        Student
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="instructor"
                        name="role"
                        value="instructor"
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="accent-blue-500 px-4"
                      /> <label htmlFor="instructor" className="ml-2 text-16 lh-1 fw-500 text-dark-1">
                        Instructor
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="admin"
                        name="role"
                        value="admin"
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="accent-red-500"
                      /> <label htmlFor="admin" className="ml-2 text-16 lh-1 fw-500 text-dark-1">
                        Admin
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  className="contact-form respondForm__form row y-gap-20 pt-30"
                  onSubmit={handleSubmit}
                >
                  <div className="col-12">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Username or Email *
                    </label>
                    <input
                      required
                      type="text"
                      name="email"
                      placeholder="Username or Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
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
                  <div className="col-12">
                    <button
                      type="submit"
                      className="button -md -green-1 text-dark-1 fw-500 w-1/1"
                      disabled={loading}
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : "Login"}
                    </button>
                  </div>
                </form>
              )}

              {/* OAuth login buttons should not appear if the role is admin */}
              {role && role !== "admin" && (
                <>
                  <div className="lh-12 text-dark-1 fw-500 text-center mt-20">
                    Or sign in using
                  </div>

                  <div className="d-flex x-gap-20 items-center justify-between pt-20">
                    <div>
                      <button
                        onClick={() => handleSocialLogin("facebook")}
                        className="button -sm px-24 py-20 -outline-blue-3 text-blue-3 text-14"
                        disabled={loading}
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Log In via Facebook"}
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => handleSocialLogin("google")}
                        className="button -sm px-24 py-20 -outline-red-3 text-red-3 text-14"
                        disabled={loading}
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Log In via Google+"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
