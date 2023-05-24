import React from "react";
import style from "../styles/Sidebar.module.css";

export default function Sidebar({ name }) {
  return (
    <div className={style.main}>
      <div className={style.first}>
        <i className="bi bi-plus"></i>
        <p>New Chat</p>
      </div>
      <div className={style.second}>
        <div className={style.s1}>
          <i className="bi bi-person"></i>
          <p>Upgrade to Plus</p>
          <button>New</button>
        </div>
        <div className={style.s2}>
          <img src="harsh.jpg" alt="Your image" />
          <p>{name}</p>
          <i className="bi bi-three-dots"></i>
        </div>
      </div>
    </div>
  );
}
