import  React from 'react'
import {useNavigate} from 'react-router-dom'
import {Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,Container} from '@mui/material/'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'




//登入介面
function Login (){
    const navigate = useNavigate();
    const handleSubmit = (event) =>{
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      if(data.get('userid')!=="" && data.get('password')!==""){   
        fetch("http://localhost:3033/api/signin",{
          method:"POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: data.get('userid'),
            password : data.get('password')
          })
      }).then((response)=>response.json())
      .then((res)=>{
            if(res.error2){
              alert('帳號或密碼錯誤')
            }else{
              alert(res.message)
              navigate('/')
              document.cookie = `token=${res.token}` //把token存進cookie
              //console.log(res)
              
            }
          }).catch((err)=>{
            alert(err)
          })
      }else if(data.get('userid') ===""){
        alert('請輸入帳號')
      }else{
        alert('請輸入密碼')
      }
    }
    return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          港勤禮品管理系統
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userid"
            label="帳號"
            name='userid'
            sx={{bgcolor:'secondary.main'}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            sx={{bgcolor:'secondary.main'}}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 ,bgcolor:'secondary.dark'}}
          >
            登入
          </Button>
        </Box>
      </Box>
    </Container>
);
}

export default Login