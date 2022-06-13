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
  Input,
  Button,
  Paper,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import usePagination from "./Pagination";
import getCookie from "./ GetCookie";

function getApply(props) {
  (async () => {
    await Swal.fire({
      title: "申請領用禮品",
      text: "請注意庫存量",
      imageUrl: `http://localhost:3000/image/${props.giftid}.png`,
      imageHeight: 300,
      imageWidth: 300,
      html:
        '申請數量<input id="input1" type="number" class="swal2-input" placeholder="請輸入數量">' +
        '</br>事由<input id="remark" class="swal2-input">',
      showCloseButton: true,
      preConfirm: () => {
        return [
          {
            newvolume: document.getElementById("input1").value, //異動數量
            giftid: props.giftid,
            remark: document.getElementById("remark").value, //備註
            stockvol: props.stock,
          },
        ];
      },
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(result.value[0]);
        //console.log(result.value[0].newvolume + result.value[0].selopt);
        if (
          result.value[0].newvolume > 0 &&
          result.value[0].stockvol > result.value[0].newvolume
        ) {
          //如果都有選且輸入的數量大於0 call api進行庫存更新！
          fetch("http://localhost:3033/my/getapplygift", {
            method: "GET",
            headers: {
              Accept: "application/json, text/plain, */*",
              Authorization: `Bearer ${getCookie("token")}`,
              newvolume: result.value[0].newvolume,
              giftid: result.value[0].giftid,
              remark: encodeURI(result.value[0].remark),
            },
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.err) {
                Swal.fire({
                  title: "申請失敗",
                  text: res.message,
                  icon: "error",
                });
              } else {
                Swal.fire({
                  title: "申請成功囉",
                  text: "請通知管理人員審核",
                  icon: "success",
                }).then((result) => {
                  if (result.isConfirmed) window.location.href = "/";
                });
                //可以做到返回新庫存嗎？
              }
            });
        }else if (result.value[0].stockvol < result.value[0].newvolume) {
          Swal.fire({
            title: "庫存不足！",
            text: "你要的數量不夠！",
            icon: "warning",
          });
        }
        else {
          Swal.fire({
            title: "不要亂輸入！",
            text: "只能輸入正整數！",
            icon: "warning",
          });
        }
      }
    });
  })();
}

function GetGift() {
  const [tmp, settmp] = useState("");
  const [searchindex, setsearchindex] = useState("");
  //header傳中文需要經過encode編碼
  const encodedindex = encodeURI(searchindex);
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
      fetch("http://localhost:3033/my/giftstock", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
          searchindex: encodedindex,
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
            window.location.href = "/";
          } else {
            setgiftlist(json);
          }
        });
      //使用usestate把拿到的資料寫進來
    }
    fetchData();
  }, [encodedindex]);

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
        禮品領用
      </Typography>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 550,
          bgcolor: "secondary.main",
        }}
      >
        <SearchIcon
          sx={{ p: "10px", color: "secondary.contrastText" }}
        ></SearchIcon>
        <Input
          sx={{ pr: 2, bgcolor: "secondary.main" }}
          type="text"
          onChange={(e) => {
            settmp(e.target.value);
          }}
          defaultValue=""
          placeholder="以名稱搜尋"
        ></Input>
        <Button
          onClick={() => {
            setsearchindex(tmp);
          }}
          sx={{ color: "secondary.contrastText" }}
        >
          搜尋
        </Button>
        <Typography variant="caption">
          ＊如無法搜尋，請先進行重新整理後再搜尋
        </Typography>
      </Paper>
      <Box display="grid" gridTemplateColumns="repeat(20,1fr)" gap={2}>
        {_DATA.currentData().map((item) => {
          return (
            // 利用cardcontent將卡片設立區塊，以達版面一致
            <Box gridColumn="span 4" sx={{ p: 1 }} key={item.giftid}>
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
                    編號：{item.giftid}
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
                    庫存：{item.stock}
                  </Typography>
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    有效日期：{item.ectdate}
                  </Typography>
                  {/*TODO: 要做日期格式處理 */}
                  <Typography
                    sx={{ color: "secondary.contrastText" }}
                    variant="subtitle2"
                    component="div"
                  >
                    備註：{item.remark}
                  </Typography>
                </CardContent>
                {/* cardActionArea是帶有button屬性的，所以裡面不可以再包button*/}
                <CardActionArea onClick={() => getApply(item)}>
                  <Icon
                    size="small"
                    color="secondary"
                    className="main"
                    aria-label="AddRoundedIcon"
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      fontSize: 40,
                    }}
                  >
                    <AddRoundedIcon sx={{ fontSize: 40 }}></AddRoundedIcon>
                  </Icon>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Box>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          variant="outlined"
          sx={{ alignItems: "center" }}
          count={count}
          size="Large"
          page={page}
          shape="rounded"
          onChange={handleChange}
        />
      </div>
    </Container>
  );
}

export default GetGift;
