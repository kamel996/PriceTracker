import React from "react";
import { version } from "../package.json";

const Footer = () => {
  return (
    <div className="fixed bottom-2 w-full py-4 text-center color-red">
      By{" "}
      <span className="text-primary">
        <a
          href="https://kamelportfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          Kamel{" "}
        </a>
      </span>{" "}
      {version}
    </div>
  );
};

export default Footer;
