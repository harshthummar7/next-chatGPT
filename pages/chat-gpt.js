import React, { useState, useEffect } from "react";
import { signIn, signOut, getSession } from "next-auth/react";
import Chat from "@/components/Chat";

const ChatGpt = () => {
  const [loading, setloading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    const secure = async () => {
      const session = await getSession();

      if (!session) {
        signIn();
      } else {
        setloading(false);
        setName(session?.user?.name);
      }
    };

    secure();
  });

  if (loading) {
    return <h1>Loading.......................</h1>;
  }
  return <>{name && <Chat name={name}></Chat>}</>;
};

export default ChatGpt;
