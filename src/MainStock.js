import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Fab,
  Icon,
  Pagination,
  Input,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import usePagination from "./Pagination";
import getCookie from "./ GetCookie";

//刪除禮品的function
function DeleteStock(props) {
  Swal.fire({
    title: `你確定要刪除${props.giftname}嗎?`,
    text: "此操作不可回復，請謹慎!",
    icon: "warning",
    imageUrl: `http://localhost:3000/image/${props.giftid}.png`,
    imageHeight: 300,
    imageWidth: 300,
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "是，刪除",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("http://localhost:3033/my/delgiftinfo", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Bearer ${getCookie("token")}`,
          colgiftid: `${props.giftid}`,
          colvalue: "stop",
          //請求頭不能帶中文字！
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.err) {
            Swal.fire({
              icon: "error",
              title: "糟糕...",
              text: res.message,
            });
          } else {
            Swal.fire({
              icon: "success",
              title: `${props.giftname}被刪除了`,
              text: res.message,
              showConfirmButton: true,
              showCancelButton: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/stockmain";
              }
            });
          }
        });
    }
  });
}

//上傳新禮品function
function fileUp() {
  (async () => {
    await Swal.fire({
      title: "新禮品入庫囉",
      html:
        '＊名稱<input id="swal-input1" class="swal2-input" placeholder="請輸入禮品名稱">' +
        '</br>請選擇類別<select id="selopt" class="swal2-input">' +
        '<option value="A">實用型</option>' +
        '<option value="B">高單價</option>' +
        '<option value="C">紀念品</option>' +
        '<option value="D">酒</option></select>' +
        '</br>有效日期<input class="swal2-input" type="date" id="ectdate"></input>' +
        '</br>＊價錢<input class="swal2-input"  type="number" id="giftprice"></input>' +
        '</br>備註<input class="swal2-input" type="text" id="remark"></input>' +
        '</br>＊照片<input class="swal2-file" type="file" id="file" accept="image/png" ></input>',
      preConfirm: () => {
        return [
          {
            filename: document.getElementById("swal-input1").value,
            selopt: document.getElementById("selopt").value,
            file: document.getElementById("file").files[0],
            ectdate: document.getElementById("ectdate").value,
            giftprice: document.getElementById("giftprice").value,
            remark: document.getElementById("remark").value,
          },
        ];
      },
      focusConfirm: false,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        //console.log(Object.keys(result.value[0].length))
        //console.log(result.value[0].file) //file blob
        if (
          result.value[0].file &&
          document.getElementById("swal-input1") &&
          result.value[0].giftprice
        ) {
          const formdata = new FormData();
          formdata.append("file", result.value[0].file);
          // formdata.append("selopt",result.value[0].selopt);
          // formdata.append("ectdate",result.value[0].ectdate)
          // formdata.append("filename",result.value[0].filename)
          console.log(formdata.get("file"));
          fetch("http://localhost:3033/my/newgift", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              //"Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("token")}`,
              selopt: result.value[0].selopt,
              ectdate: result.value[0].ectdate,
              filename: result.value[0].filename,
              giftprice: result.value[0].giftprice,
              remark: result.value[0].remark,
            },
            body: formdata,

            //上傳的檔案的blob
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.err) {
                Swal.fire({
                  title: "新增禮品失敗",
                  text: res.message,
                  icon: "error",
                });
              } else {
                //const formdata = new FormData();
                const reader = new FileReader();
                //call完新增api 如果insert成功，回傳禮品編號作為該張照片的檔名，並存在指定路徑
                //formdata.append("file", result.value[0].file, "uuuu");
                //必須要用formdata.get去取得append的資料！
                //console.log(formdata.get("file").name);
                //image Alt為圖片替代文字
                reader.onload = (e) => {
                  Swal.fire({
                    title: document.getElementById("swal-input1").value,
                    imageUrl: e.target.result,
                    imageAlt: "The uploaded picture",
                    text: res.message,
                  }).then((result) => {
                    if (result.isConfirmed) window.location.href = "/stockmain";
                  });
                };
                reader.readAsDataURL(result.value[0].file);
              }
            });
        }
        // else if (file === null)(
        //    Swal.fire({
        //     icon: 'error',
        //     title: '請上傳禮品照片！',
        //   })
        // )
        else
          Swal.fire({
            icon: "error",
            title: "有資訊未填入， 名稱＆價錢＆圖片為必填選項！",
          });
      }
    });

    //上傳的動作要寫在這邊
  })();
}

//試著做出篩選
//邏輯是監聽input內的值，用button onclick 去傳給useeffect，做重新渲染
//要把關鍵字放入headers 作為sql string

//禮品主檔維護
function MainStock() {
  //console.log(props)
  const [tmp, settmp] = useState("");
  const [searchindex, setsearchindex] = useState("");
  const encodedindex = encodeURI(searchindex);
  // settmp(e)
  //console.log(document.cookie); //我把token存在cookie
  if (getCookie("token") === "") {
    alert("請先登入");
    window.location.href = "/login";
  }
  //辨識權限
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
  //從資料庫抓取禮品資訊，call getgift api，注意前綴
  const [giftlist, setgiftlist] = useState({ data: [] });
  useEffect(() => {
    //console.log('重新渲染！')
    async function fetchData() {
      fetch("http://localhost:3033/my/giftinfo", {
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
            window.location.href = "/stockmain";
          } else {
            setgiftlist(json);
          }
        });
      //使用usestate把拿到的資料寫進來
    }
    fetchData();
  }, [encodedindex]);
  //console.log(giftlist); //所有禮品的object

  // //取得所有照片
  // const Pic = require.context("../public/image", true, /\.png$/);
  // //allpngFilePaths //所有照片位置的陣列
  // const allpngFilePaths = Pic.keys();
  //將照片名稱取出放入picName陣列，作為渲染card的key來獲取禮品資料
  // let picNames = []
  // for (let index = 0; index < allpngFilePath.length; index++) {
  //     picNames.push(allpngFilePath[index].replace('./','').replace('./png',''))  ;
  // }
  // console.log(picNames)

  //react-cli中，圖片需存放public方得存取，在靜態取得時需加入/public，但到了動態網頁上，須將public路徑幹掉
  // let picNames = allpngFilePaths.map((item) => (
  //   <ListItem
  //     key={item.replace(/.\//g, "").replace(".png", "")}
  //     value={`../public/image${item.replace(".", "")}`}
  //   />
  // ));

  // //console.log(picNames);
  //實現分頁瀏覽資料
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
        新禮品要先建檔，才管理庫存數量。
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
                    height: 300,
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
                <CardContent
                  sx={{ height: 150, bgcolor: "secondary.dark" }}
                >
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
                    備註：{item.remark}
                  </Typography>
                </CardContent>
                {/* cardActionArea是帶有button屬性的，所以裡面不可以再包button*/}
                <CardActionArea onClick={() => DeleteStock(item)}>
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
                    <DeleteOutlineIcon sx={{ fontSize: 40 }}></DeleteOutlineIcon>
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
      <Fab
        size="medium"
        className="Bgcustom"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, left: 16 }}
        onClick={fileUp}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default MainStock;
