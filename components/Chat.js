import React, { useState, useCallback, useEffect } from "react";
import style from "../styles/Chat.module.css";
import ECL from "./ECL";
import Input from "./Input";
import Sidebar from "./Sidebar";
import { data } from "@/utils/constant";
import axios from "axios";

export default function Chat({ name }) {
  const [list, setList] = useState([]);
  const [result, setResult] = useState([]);
  const generateAnswer = async (inputText) => {
    try {
      const response = await axios.post("/api/generateResponse", {
        text: inputText,
      });

      const answer = response.data.answer;
      setResult((prevAnswer) => [...prevAnswer, answer]);
      console.log("Generated answer:", answer);

      // Perform any further operations with the generated answer
    } catch (error) {
      console.error("Error generating answer:", error);
    }
  };

  const listFunction = useCallback(
    (value) => {
      console.log("3", value);
      console.log("oldlist", list);
      //setList(value);
      setList((prevList) => [...prevList, value]);
      generateAnswer(value);
    },
    [list]
  );

  useEffect(() => {
    console.log("newlist", list);
  }, [list]);

  return (
    <div className={style.chat}>
      <div className={style.sidebar}>
        <Sidebar name={name}></Sidebar>
      </div>
      <div className={style.main}>
        {list.length !== 0 ? (
          list.map((value, i) => {
            return (
              <div className={style.chat_message} key={i}>
                <div className={style.chat_question}>
                  <div className={style.logo}></div>
                  <h1>{value}</h1>
                </div>
                <div className={style.chat_answer}>
                  <div className={style.resultLogo}></div>
                  <h2>{result[i]}</h2>
                </div>
                <br></br>
              </div>
            );
          })
        ) : (
          <>
            <div className={style.first}>
              <h1>ChatGPT</h1>
            </div>
            <div className={style.second}>
              {data.map((d, i) => {
                return (
                  <React.Fragment key={i}>
                    <ECL data={d}></ECL>
                  </React.Fragment>
                );
              })}
            </div>
          </>
        )}

        <div className={style.third}>
          <Input listFunction={listFunction}></Input>
        </div>
      </div>
    </div>
  );
}
