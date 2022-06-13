import React, { useState, useEffect } from "react";
import getCookie from "./ GetCookie";
import usePagination from "./Pagination";
import Swal from "sweetalert2";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Icon,
  Pagination,
} from "@mui/material";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

function Accpet(props) {
  //console.log(props)
  (async () => {
    await Swal.fire({
      title: "請確認",
      text: `是否要讓${props.username}領${props.giftname}${props.volume}個？`,
      imageUrl: `http://localhost:3000/image/${props.giftid}.png`,
      imageHeight: 300,
      imageWidth: 300,
      showConfirmButton: true,
      showDenyButton: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (props.stock + 1 > props.volume) {
          fetch("http://localhost:3033/my/denyoraccpet", {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
              selopt: encodeURI("通過"),
              get_id: props.get_id,
            },
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.err) {
                alert(res.message);
              } else {
                Swal.fire({
                  title: `${res.message}`,
                  text: "請務必將禮品交給申請人",
                  icon: "success",
                }).then((ok) => {
                  if (ok.isConfirmed) {
                    window.location.href = "/checking";
                  }
                });
              }
            });
        } else {
          Swal.fire({
            title: "庫存不足",
            text: "請告知申請人",
            icon: "warning",
          });
        }
      } else if (result.isDenied) {
        fetch("http://localhost:3033/my/denyoraccpet", {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
            selopt: encodeURI("不通過"),
            get_id: props.get_id,
          },
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.err) {
              alert(res.message);
            } else {
              Swal.fire({
                title: "審核完畢",
                text: "請告知申請人拒絕理由",
                icon: "success",
              }).then((ok) => {
                if (ok.isConfirmed) {
                  window.location.href = "/checking";
                }
              });
            }
          });
      }
    });
  })();
}

function Checking() {
  // console.log(props.drawS)
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
          alert("你無權進入此頁面！");
          window.location.href = "/";
          //console.log(res.status)
        }
      });
  }, []);
  //
  // settmp(e)
  //console.log(document.cookie); //我把token存在cookie
  if (getCookie("token") === "") {
    alert("請先登入");
    window.location.href = "/login";
  }
  //從資料庫抓取禮品資訊，call getgift api，注意前綴
  const [giftlist, setgiftlist] = useState({ data: [] });
  useEffect(() => {
    console.log("重新渲染！");
    async function fetchData() {
      fetch("http://localhost:3033/my/waitforaccpet", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error) {
            //檢查token是否過期！
            alert(json.error);
            window.location.href = "/login";
          }
          if (json.error2) {
            alert(json.error2);
          }
          if (json.data.length === 0) {
            alert(json.message);
            window.location.href = "/checking";
          } else {
            setgiftlist(json);
          }
        });
      //使用usestate把拿到的資料寫進來
    }
    fetchData();
  }, []);

  let [page, setPage] = useState(1);
  const Per_Page = 10; //每頁幾筆資料
  const count = Math.ceil(giftlist.data.length / Per_Page); //相除取整，代表總頁數
  const _DATA = usePagination(giftlist.data, Per_Page);
  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <Container sx={{ minWidth: "100%", p: 1, backgroundColor: "primary.main" }}>
      <Typography variant="h4" sx={{ p: 1, color: "secondary.contrastText" }}>
        禮品領用審查
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(20,1fr)" gap={2}>
        {_DATA.currentData().map((item) => {
          return (
            // 利用cardcontent將卡片設立區塊，以達版面一致
            <Box gridColumn="span 4" sx={{ p: 1 }} key={item.get_id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ height: 35, bgcolor: "secondary.dark" }}>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    gutterBottom
                    variant="body1"
                    component="div"
                  >
                    {item.giftname}
                  </Typography>
                </CardContent>
                <CardContent
                  sx={{
                    height: 280,
                    p: 0,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    // 垂直致中的語法
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`../public/image/${item.giftid}.png`.replace(
                      "public",
                      ""
                    )}
                    sx={{
                      maxWidth: 1 / 1,
                      maxHeight: 1 / 1,
                      objectFit: "contain",
                    }}
                  ></CardMedia>
                </CardContent>
                <CardContent sx={{ height: 150, bgcolor: "secondary.dark" }}>
                  {/* <Typography variant="body2">
                        編號:{item.giftid}
                      </Typography> */}
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    申請人：{item.username}
                  </Typography>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    金額：{item.giftprice}
                  </Typography>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    申請數量：{item.volume}
                  </Typography>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    庫存：{item.stock}
                  </Typography>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    事由:{item.getreason}
                  </Typography>
                </CardContent>
                {/* cardActionArea是帶有button屬性的，所以裡面不可以再包button*/}
                <CardActionArea onClick={() => Accpet(item)}>
                  <Icon
                    size="small"
                    color="secondary"
                    className="main"
                    aria-label="checkbtn"
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      fontSize: 40,
                    }}
                  >
                    <PlaylistAddCheckRoundedIcon sx={{ fontSize: 40 }}/>
                  </Icon>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Box>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          sx={{ alignItems: "center" }}
          count={count}
          size="Large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </div>
    </Container>
  );
}

export default Checking;
