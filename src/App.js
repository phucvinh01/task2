import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout';
import About from './pages/About';
import Tours from './pages/Tours';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tour from './pages/Tour';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from './Context/UserContext';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { FloatButton } from 'antd';
import Cart from './pages/Cart';
import { getBooking } from './Api/Auth';
import _ from 'lodash'
function App() {

  const { loginContext, user } = useContext(UserContext);

  const [data, setData] = useState([])


  useEffect(() => {

    getCart()

    if (localStorage.getItem('token')) {
      loginContext((localStorage.getItem('name')), (localStorage.getItem('token')), (localStorage.getItem('id')), dataSource, (localStorage.getItem('role')))
      if (user.role == "admin") {
        navigate('/tours')
      }
    }



  }, [])

  //clear localStogare when browers off
  window.onbeforeunload = function () {
    if (localStorage.getItem('token ')) {
      localStorage.clear()
    }
  };
  const getCart = async () => {
    let res = await getBooking(user.id)
    setData(res.data)
  }

  const asArray = data && Object.entries(data);

  const filtered = asArray && asArray.filter(([key, value]) => value.userId == user.id);

  const Source = filtered && _.flattenDeep(filtered)

  const dataSource = Source && _.remove(Source, function (n) {
    return _.isObject(n);
  });


  const navigate = useNavigate()

  const handleOnClick = () => {
    navigate('/cart')
  }





  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="tours" element={<Tours />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="tours/:id" element={<Tour />} />
          <Route path="cart" element={<Cart dataSource={dataSource} />} />

        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      <ToastContainer />
      {
        user.auth && user.role != 'admin' && <FloatButton
          icon={<i className="fa-solid fa-cart-shopping"></i>}
          onClick={handleOnClick}
          badge={{
            count: dataSource.length,
            color: 'blue',
          }}
        />
      }

    </>
  );
}

export default App;
