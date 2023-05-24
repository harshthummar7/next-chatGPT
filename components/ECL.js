import React from "react";
import style from "../styles/ELC.module.css";

export default function ECL({ data }) {
  return (
    <div className={style.main}>
      <div className={style.first}>
        <i className={data.i}></i>
        <h2>{data.h2}</h2>
      </div>
      <div className={style.second}>
        <div className={style.s1}>
          <p>{data.p[0]}</p>
        </div>
        <div className={style.s2}>
          <p>{data.p[1]}</p>
        </div>
        <div className={style.s3}>
          <p>{data.p[2]}</p>
        </div>
      </div>
    </div>
  );
}
