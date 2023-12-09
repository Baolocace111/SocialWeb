import React from "react";
import "./post.scss";

const Description = ({ text }) => {
  const inputString = text;

  const processString = (str) => {
    const words = str ? splitStrings(str) : [];

    const processedWords = words.map((word, index) => {
      if (word.startsWith("#")) {
        const hashtag = word.substring(1); // Remove the '#' symbol
        return (
          <span
            style={{ cursor: "pointer", color: "blue" }}
            key={index}
            onClick={() =>
              (window.location.href = `/search/${hashtag}/hashtag`)
            }
          >
            {word}
          </span>
        );
      } else {
        return word;
      }
    });

    return processedWords;
  };

  const processedString = processString(inputString);

  return <div className="description">{processedString}</div>;
};
function splitStrings(input) {
  // Sử dụng biểu thức chính quy để tách chuỗi thành mảng các chuỗi con
  const regex = /(\S+|\s+)/g;
  return input.match(regex);
}

export default Description;
