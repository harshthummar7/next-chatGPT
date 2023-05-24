import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = React.memo(() => {
  const { data: session, status } = useSession();
  console.log("calling", { session, status });

  return (
    <nav className="header">
      <h1 className="logo">
        <a href="#">NextAuth</a>
      </h1>

      <ul className={`main-nav`}>
        {!session && (
          <li>
            <Link href="api/auth/signin" legacyBehavior>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                SignIn
              </a>
            </Link>
          </li>
        )}

        {session && (
          <>
            <li>
              <Link href="/" legacyBehavior>
                <a>Home</a>
              </Link>
            </li>

            <li>
              <Link href="/chat-gpt" legacyBehavior>
                <a>ChatGpt</a>
              </Link>
            </li>

            <li>
              <Link href="/upload-file" legacyBehavior>
                <a>UploadFile</a>
              </Link>
            </li>

            <li>
              <Link href="api/auth/signout" legacyBehavior>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  SignOut
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
});

export default Navbar;
