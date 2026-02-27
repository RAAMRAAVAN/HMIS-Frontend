'use client';
import { Box } from "@mui/material";
import Content from './Content';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'; // App Router
import { selectNewseID } from "@/redux/features/newsSlice";

export default function Page() {
  const newsID = useSelector(selectNewseID);
  const router = useRouter();

  useEffect(() => {
    if (!newsID) {
      router.replace('/news'); // Redirects to the newsAndEvents route
    }
  }, [newsID, router]);

  if (!newsID) return null;
  return (
    <Box display="flex" width="100%" flexDirection='column'>
      <Content />
    </Box>
  );
}
