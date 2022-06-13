import React, { useState, useEffect } from "react";
import { Divider, Drawer } from "@mui/material";
import Box from "@mui/material/Box";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import AddchartOutlinedIcon from "@mui/icons-material/AddchartOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import getCookie from "./ GetCookie";
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';

// const allPage = [
//   {
//     text: "禮品主檔維護",
//     pageurl: "/stockmain",
//     icon: <WidgetsOutlinedIcon/>,
//   },
//   {
//     text: "禮品庫存管理",
//     pageurl: "/stockmana",
//     icon: <AddchartOutlinedIcon></AddchartOutlinedIcon>,
//   },
//   {
//     text: "禮品領用",
//     pageurl: "/",
//     icon: <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>,
//   },
//   {
//     text: "領用審核",
//     pageurl: "/checking",
//     icon: <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>,
//   },
// ];

function OpenDrawer(props) {
  const [allPage, setallpage] = useState([]);
  //利用權限辨識渲染列表
  useEffect(() => {
    fetch("http://localhost:3033/my/whoareyou", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 1) {
          setallpage([
            {
              text: "禮品領用",
              pageurl: "/",
              icon: <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>,
            },
          ]);
        } else {
          setallpage([
            {
              text: "禮品主檔維護",
              pageurl: "/stockmain",
              icon: <WidgetsOutlinedIcon />,
            },
            {
              text: "禮品庫存管理",
              pageurl: "/stockmana",
              icon: <AddchartOutlinedIcon></AddchartOutlinedIcon>,
            },
            {
              text: "禮品領用",
              pageurl: "/",
              icon: <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>,
            },
            {
              text: "領用審核",
              pageurl: "/checking",
              icon: <PlaylistAddCheckRoundedIcon></PlaylistAddCheckRoundedIcon>,
            },
          ]);
        }
      });
  }, []);
  // console.log(props.drawS)
  return (
    <>
      <Drawer
        variant="temporary"
        anchor="left"
        open={props.state}
        onClose={() => props.drawS()}
      >
        <Box
          sx={{ width: 250,height:"100%",bgcolor:"secondary.main" ,color:"secondary.contrastText"}}
          role="presentation"
          onClick={() => props.drawS()}
        >
          <List>
            {allPage.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component="a" href={item.pageurl}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default OpenDrawer;
