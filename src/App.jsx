import axios from "axios";
import './assets/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { useState, useEffect, useRef } from 'react';

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
  imagesUrl: [""]
}
function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);

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
      setisAuth(true);
      getProducts();
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `access_token=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setisAuth(true);
      getProducts();
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error.response.message);
    }
  };

  const modalRef = useRef(null);
  const myModalRef = useRef(null);
  const [modalState, setModalState] = useState(null);
  const [productModal, setProductModal] = useState(defaultModal);
  const deleteModalRef = useRef(null);
  const myDeleteModalRef = useRef(null);
  const [inputImageValue, setInputImageValue] = useState("");

  useEffect(() => {
    if (modalRef.current !== null && myModalRef.current === null) {
      myModalRef.current = new Modal(modalRef.current, {
        keyboard: false,
        backdrop: "static"
      });
    }
  }, []);
  
  const hasModalShow = (state, item) =>{
    setModalState(state);
    if (state === 'add'){
      setProductModal(
        {...defaultModal})
    } else {
      setProductModal(item)
    }
    if (myModalRef.current !== null){
      myModalRef.current.show();
    } else {
      console.log('modalRef.current is null')
    }
  }

  const hasModalHide = () =>{
    if (myModalRef.current !== null){
      myModalRef.current.hide();
    } else {
      console.log('modalRef.current is null')
    }
  }
  useEffect (()=>{
    if (deleteModalRef.current !== null && myDeleteModalRef.current === null){
      myDeleteModalRef.current = new Modal(deleteModalRef.current, {
        keyboard: false,
        backdrop: "static"
      });
    }
  },[])

const hasDeleteModalShow = (item) =>{
  setProductModal(item);
  if (myDeleteModalRef.current !== null){
    myDeleteModalRef.current.show();
  } else {
    console.log('modalRef.current is null')
  }
}
  const hasDeleteModalHide = () =>{
    if (myDeleteModalRef.current !== null){
      myDeleteModalRef.current.hide();
    } else {
      console.log('deleteModalRef.current is null')
    }
  }
  const handleImageChange = (e) => {
    const {value} = e.target
    setInputImageValue(value)
  }

  const addImage = () => {
    const newImagesUrl = [...productModal.imagesUrl, inputImageValue]
    setProductModal({
      ...productModal,
      imagesUrl: newImagesUrl
    })
    setInputImageValue("")
  }

  const deleteImage = () => {
    const newImagesUrl = [...productModal.imagesUrl]
    newImagesUrl.pop()
    setProductModal({
      ...productModal,
      imagesUrl: newImagesUrl
    })
  }
  
  const setModalContent = (e) => {
    const {value, name, checked, type} = e.target
    setProductModal({
      ...productModal,
      [name]: type === "checkbox" ? checked : value
    })
  }

const addProduct = async () => {
  try {
    await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{
      data: {
        ...productModal,
        origin_price: Number(productModal.origin_price),
        price: Number(productModal.price),
        is_enabled: productModal.is_enabled ? 1 : 0
  }})
  } catch(err){
    console.log("add failed")
  }
}

const editProduct = async () => {
  try {
    await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${productModal.id}`,{
      data: {
        ...productModal,
        origin_price: Number(productModal.origin_price),
        price: Number(productModal.price),
        is_enabled: productModal.is_enabled ? 1 : 0
  }})
  } catch(err){
    console.log("edit failed")
  }
}

const submitProduct = async () =>{
  const updateModal = modalState === 'add' ? addProduct : editProduct;
  try{
      await updateModal();
      getProducts();
      hasModalHide()
    } catch(error){
    console.log("submit failed")
  }
}
  const deleteProduct = async () => {
    try{
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${productModal.id}`);
      getProducts();
      hasDeleteModalHide()
    } catch (error) {
      console.log("delete failed");
    }
  };

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" 
              onClick={() => 
                {hasModalShow('add')}
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
                          onClick={() =>{hasModalShow(`edit`, item)}}
                          
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
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2025~∞</p>
        </div>
      )}
      <div
        id="productModal"
        ref={modalRef}
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalState === 'add' ? "新增產品" : "編輯產品"}</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hasModalHide}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                      value={inputImageValue}
                      onChange={handleImageChange}
                      name="imageUrl"
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    {productModal.imagesUrl.map((url,index) => (
                      <img key={index} 
                      className="img-fluid" 
                      src={url} 
                      alt={productModal.title} />))}
                  </div>
                  <div>
                    {productModal.imagesUrl.length < 5 && (<button 
                    className="btn btn-outline-primary btn-sm d-block w-100"
                    onClick={addImage}>
                      新增圖片
                    </button>)}
                  </div>
                  <div>
                    {productModal.imagesUrl && productModal.imagesUrl.length >1 && (<button
                    className="btn btn-outline-danger btn-sm d-block w-100"
                    onClick={deleteImage}>
                      刪除圖片
                    </button>)}
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={productModal.title}
                      onChange={setModalContent}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                      value={productModal.category}
                      onChange={setModalContent}
                      name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                      value={productModal.unit}
                      onChange={setModalContent}
                      name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                      value={productModal.origin_price}
                      onChange={setModalContent}
                      name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                      value={productModal.price}
                      onChange={setModalContent}
                      name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={productModal.description}
                      onChange={setModalContent}
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={productModal.content}
                      onChange={setModalContent}
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        checked={productModal.is_enabled}
                        onChange={setModalContent}
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={hasModalHide}
              >
                取消
              </button>
              <button type="button" className="btn btn-primary"
              onClick={submitProduct}>
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteModal" ref={deleteModalRef} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="deleteModalLabel">Notice</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
        onClick={hasDeleteModalHide}></button>
      </div>
      <div className="modal-body">
        Are you sure you want to delete {productModal.title}?
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
        onClick={hasDeleteModalHide}>Cancel</button>
        <button type="button" className="btn btn-primary"
        onClick={deleteProduct}>Confirm</button>
      </div>
    </div>
  </div>
</div>
    </>
  );
}

export default App
