import React, { useState, useEffect } from "react";
import style from "../styles/Input.module.css";

export default function Input({ listFunction }) {
  const [inputValue, setInputValue] = useState("");
  const handleChange = (e) => {
    setInputValue(e.target.value);
    // console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputValue;
    console.log("1", value);
    setInputValue("");
    listFunction(value);
    console.log("2", value);
  };

  return (
    <div className={style.main}>
      <form onSubmit={handleSubmit}>
        <div className={style.inputContainer}>
          <textarea
            value={inputValue}
            placeholder="Send message"
            onChange={handleChange}
          ></textarea>
          <button type="submit">Send</button>
        </div>
        <span>
          "Free Research Preview. ChatGPT may produce inaccurate information
          about people, places, or facts."
          <a
            href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes"
            target="_blank"
            rel="noreferrer"
            class="underline"
          >
            ChatGPT May 12 Version
          </a>
        </span>
      </form>
    </div>
  );
}
