import axios from "axios";
import './assets/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { useState, useEffect, useRef } from 'react';
import LoginPage from './component/Pages/LoginPage';
import Pagination from './component/Pagination';
import ProductModal from './component/ProductModal';
import DeleteModal from "./component/DeleteModal";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius"; 

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
function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const myModalRef = useRef(null);
  const [modalState, setModalState] = useState(null);
  const [productModal, setProductModal] = useState(defaultModal);
  const myDeleteModalRef = useRef(null);
 
 
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const hasDeleteModalShow = (item) =>{
    setProductModal({
      ...item,
      imagesUrl: [],
    });
    if (myDeleteModalRef.current !== null){
      //myDeleteModalRef.current.show();
      setIsDeleteModalOpen(true);
    } else {
      console.log('modalRef.current is null')
    }
  }

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const hasModalShow = (state, item) =>{
    setProductModal(state);
    if (state === 'add'){
      setProductModal(
        {...defaultModal})
        setModalState('add')
    } else {
      setProductModal(item)
      setModalState('edit')
    }
    if (myModalRef.current !== null){
      setIsProductModalOpen(true);
    } else {
      console.log('modalRef.current is null')
    }
}

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" 
              onClick={() => 
                {hasModalShow('add');
                setProductModal(defaultModal);
                }
                }>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td className="text-end">{item.origin_price}</td>
                    <td className="text-end">{item.price}</td>
                    <td>
                      {item.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>{hasModalShow(`edit`, item);}}
                          
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>{hasDeleteModalShow(item)}}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          < Pagination getProducts={getProducts} pagination={pagination}/>
        </div>
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
