import React, { useState } from "react";
import style from "../styles/Chat.module.css";
import ECL from "./ECL";
import Input from "./Input";
import Sidebar from "./Sidebar";
import { data } from "@/utils/constant";

export default function Chat({ name }) {
  const [list, setList] = useState([]);

  const listFunction = (value) => {
    setList(...list, value);
  };

  return (
    <div className={style.chat}>
      <div className={style.sidebar}>
        <Sidebar name={name}></Sidebar>
      </div>
      <div className={style.main}>
        {/* {list.length !== 0 ? (
          
        ) : (
          <> */}
        <div className={style.first}>
          <h1>ChatGPT</h1>
        </div>
        <div className={style.second}>
          {data.map((d) => {
            return (
              <>
                <ECL data={d}></ECL>
              </>
            );
          })}
        </div>
        {/* </>
        )} */}
        <div className={style.third}>
          <Input listFunction={listFunction}></Input>
        </div>
      </div>
    </div>
  );
}
