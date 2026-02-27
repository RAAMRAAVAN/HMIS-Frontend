'use client'
import { Button, Typography } from "@mui/material";
import { useState } from "react";

const ReadMoreText = ({ ShortText, LongText, ReadMoreOption, scrollBack, showReadmore = false, Expand = false }) => {
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
      <Typography style={{ whiteSpace: "pre-line", padding: '10px' }}>
        {expand ? LongText : ShortText}
      </Typography>

      {ReadMoreOption? (
        <>
          {!expand ? (
            <Button sx={{ my: 1, padding:0 }} onClick={() => setExpand(true)}>
              Read More
            </Button>
          ) : (
            <Button sx={{ my: 1, padding:0 }} onClick={handleShowLess}>
              Show Less
            </Button>
          )}
        </>
      ): <></>}
    </>
  );
};

export default ReadMoreText;
