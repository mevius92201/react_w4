import axios from "axios";
import './assets/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import LoginPage from './component/Pages/LoginPage';
import ProductModal from './component/ProductModal';
import DeleteModal from "./component/DeleteModal";
import ProductPage from "./component/Pages/ProductPage";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius"; 


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const myModalRef = useRef(null);
  const myDeleteModalRef = useRef(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalState, setModalState] = useState(null); 
  const [products, setProducts] = useState([]);
  const defaultModal = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: 0,
    price: 0,
    id: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: []
}
  const [productModal, setProductModal] = useState(defaultModal);
  //const [inputImageValue, setInputImageValue] = useState("");
  //const [inputImagesValue, setInputImagesValue] = useState("");
 //const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total_pages: 1,
    current_page: 1,
    has_pre: false,
    has_next: false,
  });

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProducts();
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const getProducts = async (page=1) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination)
    } catch (error) {
      console.log(error.response.message);
    }
  };

  // const hasModalHide = () =>{
  //   if (myModalRef.current !== null){
  //     myModalRef.current.hide();
  //   } else {
  //     console.log('modalRef.current is null')
  //   }
  // }
  return (
    <>
      {isAuth ? (
        <ProductPage 
        myModalRef={myModalRef}
        setIsProductModalOpen={setIsProductModalOpen}
        getProducts={getProducts}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        pagination={pagination}
        myDeleteModalRef={myDeleteModalRef}
        setModalState={setModalState}
        setProductModal={setProductModal}
        defaultModal={defaultModal}
        products={products}
        />
      ) : <LoginPage getProducts={getProducts} setIsAuth={setIsAuth}/> }
      <ProductModal 
      modalState={modalState}
      productModal={productModal} 
      getProducts={getProducts} 
      isOpen={isProductModalOpen} 
      setIsOpen={setIsProductModalOpen}
      myModalRef={myModalRef} 
      />
      <DeleteModal 
      productModal={productModal} 
      getProducts={getProducts}
      myDeleteModalRef={myDeleteModalRef}
      isOpen={isDeleteModalOpen} 
      setIsOpen={setIsDeleteModalOpen}
      />
    </>
  );
}

export default App;
