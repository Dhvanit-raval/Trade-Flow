import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://backend-cbjp.onrender.com/user", {
          withCredentials: true,
        });
        if (data.status) {
          setUsername(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const getMenuClass = (path) => {
    return currentPath === path ? "menu selected" : "menu";
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="menu-container">
      <img src="/logo.png" alt="logo" style={{ width: "50px" }} />
      <div className={`menus ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/" onClick={() => setIsMenuOpen(false)}>
              <p className={getMenuClass("/")}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/orders" onClick={() => setIsMenuOpen(false)}>
              <p className={getMenuClass("/orders")}>Orders</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings" onClick={() => setIsMenuOpen(false)}>
              <p className={getMenuClass("/Holdings")}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/positions" onClick={() => setIsMenuOpen(false)}>
              <p className={getMenuClass("/positions")}>Positions</p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/funds" onClick={() => setIsMenuOpen(false)}>
              <p className={getMenuClass("/funds")}>Funds</p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" >
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <p className="username">{username}</p>
        </div>
      </div>
      <div className="menu-toggle" onClick={handleMenuClick}>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
      </div>
    </div>
  );
};

export default Menu;
