import React, { useState } from "react";
import { Inter } from "next/font/google";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [editorState, setEditorState] = useState(null);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          p: "1rem",
        }}
      >
        <Button
          sx={{
            p: "10px",
            backgroundColor: "#0681bd",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "10px",
          }}
        >
          Connect Wallet
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // width: "100%",
          // p:"1rem",
          // backgroundColor:"red"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            width: "20%",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "#0681bd",
              fontSize: "28px",
              pb: "10px",
            }}
          >
            Users
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography>user 1</Typography>
            <Typography>user 2</Typography>
            <Typography>user 3</Typography>
            <Typography>user 4</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // height: "100vh",
            flexDirection: "column",
            width: "38%",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontSize: "28px", pb: "10px" }}
          >
            Book Tracker
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#204d63",
              p: "3rem",
              // width: "38%",
              // gap: "14px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#a0b3bd",
                p: "1rem",
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ textAlign: "center", color: "#0681bd" }}>
                Readers
              </Typography>
              <Typography>Name</Typography>
              <TextField />
              <Typography>Age</Typography>
              <TextField />
              <Button
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                Add
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#a0b3bd",
                p: "1rem",
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ textAlign: "center", color: "#0681bd" }}>
                Books
              </Typography>
              <Typography>Title</Typography>
              <TextField />
              <Typography>Author</Typography>
              <TextField />
              <Button
                sx={{
                  backgroundColor: "#0681bd",
                  p: "8px",
                  color: "#fff",
                  mt: "8px",
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // height: "100vh",
            width: "20%",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "#0681bd",
              fontSize: "28px",
              pb: "10px",
            }}
          >
            Books
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography>book 1</Typography>
            <Typography>book 2</Typography>
            <Typography>book 3</Typography>
            <Typography>book 4</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            width: "60%",
            // backgroundColor: "red",
            height: "300px",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "28px" }}>Susan Sunan</Typography>
          <Typography sx={{ fontSize: "20px" }}>Books Read:</Typography>
          <Typography>book 1</Typography>
          <Typography>book 2</Typography>
          <Typography>book 3</Typography>
          <Typography>book 4</Typography>
        </Box>
      </Box>
    </Box>
  );
}
