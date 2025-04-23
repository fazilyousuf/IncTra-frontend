import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import { navbarData } from "./Data";


const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h1 className="logo">IncTra.</h1>
      <div className="nav-menu">
        {navbarData.map((data,index) => (
          <NavLink
            key={index}
            to={data.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {data.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
