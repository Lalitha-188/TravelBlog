import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from './Modal';
import Form from './Form';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  const checkLogin = () => {
    if (isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLogin(false);
      setUser(null);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header>
        <h2 className="logo">Travel Blog</h2>
        <nav>
          <ul>
            <li><NavLink to="/" end>Home</NavLink></li>

            <li>
              <NavLink
                to={isLogin ? "/places" : "#"}
                onClick={(e) => {
                  if (!isLogin) {
                    e.preventDefault();
                    setIsOpen(true);
                  }
                }}
              >
                Places
              </NavLink>
            </li>

            <li>
              <NavLink
                to={isLogin ? "/favourites" : "#"}
                onClick={(e) => {
                  if (!isLogin) {
                    e.preventDefault();
                    setIsOpen(true);
                  }
                }}
              >
                Favourites
              </NavLink>
            </li>

            <li onClick={checkLogin}>
              <p className="login">
                {isLogin ? "Logout" : "Login"} {user?.email ? `(${user.email})` : ""}
              </p>
            </li>
          </ul>
        </nav>
      </header>
      {isOpen && (
  <Modal onClose={() => setIsOpen(false)}>
    <Form
      onLoginSuccess={(token, user) => {
        if (user) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setIsLogin(true);
          setUser(user);
          setIsOpen(false);
        } else {
          console.warn("Login successful, but user data is missing!");
        }
      }}
      onClose={() => setIsOpen(false)} 
    />
  </Modal>
)}


      
    </>
  );
}
