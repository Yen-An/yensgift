import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login';
import GetGift from './GetGift';
import MainStock from './MainStock';
import StockManagement from './StockManagement';
import Layout from './Layout';
import OpenDrawer from './Drawer';
import Checking from './Checking';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout></Layout>} >
          <Route index element={<GetGift/>}></Route>
          <Route path='/stockmain' element={<MainStock/>} ></Route>
          <Route path='/stockmana' element={<StockManagement/>} ></Route>
          <Route path='/checking' element={<Checking/>} ></Route>
          <Route path='/drawer' element={<OpenDrawer></OpenDrawer>} ></Route>
          </Route>
          <Route path='/login' element={<Login/>}></Route>

        </Routes>
      
      
      
      </BrowserRouter>

    </div>
  );
}

export default App;
