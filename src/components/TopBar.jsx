import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const TopBar = ({ title }) => (
  <AppBar position="static" sx={{ backgroundColor: "#6A1B9A" }}>
    <Toolbar>
      <Typography variant="h6">{title}</Typography>
    </Toolbar>
  </AppBar>
);

export default TopBar;