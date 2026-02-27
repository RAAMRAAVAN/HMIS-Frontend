'use client';
import { Button, Typography } from "@mui/material";
import { useState } from "react";

const ReadMoreText = ({
  ShortText,
  LongText,
  ReadMoreOption,
  scrollBack,
  showReadmore = false,
  Expand = false,
}) => {
  const [expand, setExpand] = useState(Expand);

  const handleShowLess = () => {
    setExpand(false);
    if (scrollBack) {
      const target = document.getElementById(scrollBack);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <Typography
        
        dangerouslySetInnerHTML={{
          __html: expand ? LongText : ShortText,
        }}
      />

      {ReadMoreOption && (
        <>
          {!expand ? (
            <Button sx={{ m: 1 }} onClick={() => setExpand(true)}>
              Read More
            </Button>
          ) : (
            <Button sx={{ m: 1 }} onClick={handleShowLess}>
              Show Less
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default ReadMoreText;
