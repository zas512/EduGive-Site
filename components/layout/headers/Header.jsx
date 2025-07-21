"use client";
import React, { useEffect, useState } from "react";
import { HeaderExplore } from "../component/header-explore";
import SearchToggle from "../component/SearchToggle";
import CartToggle from "../component/CartToggle";
import Menu from "../component/Menu";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../component/MobileMenu";
import { useSession, signOut } from "next-auth/react";
import { socialLogin } from "@/store/authSlice/authSlice";
import { useDispatch } from "react-redux";

export default function Header() {
  const [role, setRole] = useState(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [iscustomuser,setiscustomuser]=useState("");
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const customUser=localStorage.getItem("user");

    if (savedRole) {
      setRole(savedRole); // Set role from localStorage if it exists
    }
    setiscustomuser(JSON.parse(customUser));
  }, []);
  console.log(role);
  // UseEffect hook to handle social login after session is created
  useEffect(() => {
    if (session) {
      const { user } = session; // Assuming session has user object with googleId and facebookId
      const socialData = {
        email: user.email,
        name: user.name,
        googleId: user?.googleId, // Assuming this is available in the session object
        facebookId: user?.facebookId, // Assuming this is available in the session object
        role // Add your role here
      };

      dispatch(socialLogin(socialData)).unwrap(); // Dispatch the action with socialData
    }
  }, [session, dispatch]); // Add role as dependency if necessary


  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    // Remove custom authentication data from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    // Clear NextAuth session cookies
    document.cookie = "next-auth.session-token=; Max-Age=0; path=/; domain=" + window.location.hostname;
    document.cookie = "__Secure-next-auth.session-token=; Max-Age=0; path=/; domain=" + window.location.hostname;

    // Redirect after sign-out
    signOut({ callbackUrl: '/' });
  };


  return (
    <header className="header -type-1">
      <div className="header__container">
        <div className="row justify-between items-center">
          <div className="col-auto">
            <div className="header-left">
              <div className="header__logo">
                <Link href="/">
                  <Image
                    width={140}
                    height={50}
                    src="/assets/img/general/edu-givelogo.png"
                    alt="logo"
                  />
                </Link>
              </div>

              {/* header explore start */}
              <HeaderExplore
                allClasses={"header__explore text-green-1 ml-60 xl:ml-30 xl:d-none"}
              />
              {/* header explore end */}
            </div>
          </div>

          <Menu allClasses={"menu__nav text-white -is-active"} />
          <MobileMenu
            setActiveMobileMenu={setActiveMobileMenu}
            activeMobileMenu={activeMobileMenu}
          />

          <div className="col-auto">
            <div className="header-right d-flex items-center">
              <div className="header-right__icons text-white d-flex items-center">
                {/* search toggle start */}
                <SearchToggle />
                {/* search toggle end */}

                {/* cart toggle start */}
                <CartToggle
                  parentClassess={"relative ml-30 xl:ml-20"}
                  allClasses={"d-flex items-center text-white"}
                />
                {/* cart toggle end */}

                <div className="d-none xl:d-block ml-20">
                  <button
                    onClick={() => setActiveMobileMenu(true)}
                    className="text-white items-center"
                    data-el-toggle=".js-mobile-menu-toggle"
                  >
                    <i className="text-11 icon icon-mobile-menu"></i>
                  </button>
                </div>
              </div>

              <div className="header-right__buttons d-flex items-center ml-30 md:d-none">
                {/* Display user info or login/signup buttons */}
                {!session && !iscustomuser ? (
                  <>
                    <Link href="/login" className="button -underline text-white">
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="button -sm -white text-dark-1 ml-30"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div className="user-info d-flex items-center space-x-2 " style={{gap:"4px"}}>
                    {/* Display user profile picture and name */}
                    <img
                      src={session?.user.image || "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"}
                      alt="User Image"
                      className="user-image rounded-full w-8 h-8 mr-2"
                      style={{width: '30px', height: '30px', cursor: 'pointer'}}
                    />
                    <span className="text-white" style={{cursor:'pointer'}}>{session?.user.name || iscustomuser?.username || "Guest"}</span>
                    <button
                      className="button -sm -white text-dark-1 ml-30"
                      onClick={handleLogout} // Trigger logout when clicked
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
