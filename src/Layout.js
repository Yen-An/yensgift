import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import OpenDrawer from "./Drawer";
import Swal from "sweetalert2";


//登出 清空cookie
function LogOut() {
  Swal.fire({
    title: "你確定要登出嗎？",
    icon: "question",
    showCancelButton: true,
    showConfirmButton: true,
  }).then((res) => {
    if (res.isConfirmed) {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
      window.location.href = "/login";
    }
  });
}

function Layout() {
  /**
   * 寫一個把抽屜關掉的 function 傳入子組件 drawer,讓drawer可以用這個函數回傳false值，
   * 抽屜才能關掉
   */
  const [draw, setDraw] = useState(false);
  let drawS = () => {
    setDraw(false);
  };
  return (
    <>
      <OpenDrawer state={draw} drawS={drawS}></OpenDrawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar sx={{bgcolor:"primary.dark"}} position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2,color:"primary.contrastText" }}
              onClick={() => setDraw(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              TIPM禮品管理系統
            </Typography>
            <Button color="inherit" onClick={LogOut}>
              登出
            </Button>
          </Toolbar>
        </AppBar>
        <Outlet></Outlet>
      </Box>
    </>
  );
}

export default Layout;
