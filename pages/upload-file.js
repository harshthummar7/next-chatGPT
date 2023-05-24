import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import Chat from "@/components/Chat";
import FileUploader from "@/components/FileUploader";

const uploadFile = () => {
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const secure = async () => {
      const session = await getSession();

      if (!session) {
        signIn();
      } else {
        setloading(false);
      }
    };

    secure();
  });

  if (loading) {
    return <h1>Loading.......................</h1>;
  }
  return <FileUploader />;
};

export default uploadFile;
