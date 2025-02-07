import axios from "axios";
import './assets/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { useState, useEffect, useRef } from 'react';
import LoginPage from './component/Pages/LoginPage';

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
  const modalRef = useRef(null);
  const myModalRef = useRef(null);
  const [modalState, setModalState] = useState(null);
  const [productModal, setProductModal] = useState(defaultModal);
  const deleteModalRef = useRef(null);
  const myDeleteModalRef = useRef(null);
  const [inputImageValue, setInputImageValue] = useState({
    imageUrl: "",
    images: []
  })
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages){
      getProducts(newPage)
  }
  }

//  const getPaginationProducts = () => {
//     const perPage = 10
//     //const pageTotal = Math.ceil(productNum/perPage)  
//     //const currentPage = page > pageTotal ? pageTotal : page
//     const minData = (currentPage * perPage) - perPage + 1
//     const maxData = (currentPage * perPage) 
//     return products.slice(minData, maxData)
//   }

  const renderPaginationButtons = () => {
    const totalPages = pagination.total_pages;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li className={`page-item ${i === pagination.current_page ? 'active' : ''}`} key={i}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };
  
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
    const {value, id} = e.target
    setInputImageValue((pre) =>({
      ...pre,
      [id]: value
    }))
    console.log(inputImageValue)
  }

  const addImages = () => {
    const newImagesUrl = [...productModal.imagesUrl, inputImageValue]
    setProductModal({
      ...productModal,
      imagesUrl: newImagesUrl
    })
    setInputImageValue({imagesUrl: ""})
  }

  const addImage = () => {
    setProductModal({
      ...productModal,
      imageUrl: inputImageValue.imageUrl
    })
    setInputImageValue({imageUrl: ""})
  }
  
  const deleteImages = () => {
    const newImagesUrl = [...productModal.imagesUrl]
    newImagesUrl.pop()
    setProductModal({
      ...productModal,
      imagesUrl: newImagesUrl
    })
  }

  const deleteImage = () => {
    setProductModal({
      ...productModal,
      imageUrl: ""
    })
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file-to-upload', file)
      try{
        const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData) 
        setProductModal({
         ...productModal,
          imageUrl: res.data.imageUrl
        })
      }catch(err){
        console.log("upload failed")
      }
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
          {pagination.total_pages > 1 && (
          <div className="d-flex justify-content-center">
            <nav>
            <ul className="pagination">
            {pagination.has_pre && (
            <li className={`page-item ${pagination.has_pre ? "" : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.current_page - 1)}
            >
            上一頁
            </button>
            </li>
            )}
            {renderPaginationButtons()}
            {pagination.has_next && (
            <li className={`page-item ${pagination.has_next ? "" : "disabled"}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.current_page + 1)}
            >
            下一頁
            </button>
            </li>
            )}
            </ul>
            </nav>
          </div>
          )}
        </div>
      ) : <LoginPage getProducts={getProducts} setIsAuth={setIsAuth}/> }
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
                        主圖
                      </label>
                      <input
                        value={inputImageValue.imageUrl}
                        onChange={handleImageChange}
                        id="imageUrl"
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        {...(productModal.imageUrl ? {disabled: true} : {})}
                        required
                      />
                  </div>
                    <div className="mb-3">
                      <label htmlFor="fileInput" className="form-label"> </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={handleFileChange}
                        //value={productModal.imageUrl}
                      />
                    </div>
                    {productModal.imageUrl? <img
                        className="img-fluid"
                        src={productModal.imageUrl}
                        alt={productModal.title}
                      /> : null}
                    <div>
                      {inputImageValue.imageUrl && (<button 
                        className="btn btn-outline-primary btn-sm d-block w-100"
                        onClick={addImage}>
                        新增圖片
                      </button>)}
                  </div>
                  <div>
                    {productModal.imageUrl && (<button
                    className="btn btn-outline-danger btn-sm d-block w-100"
                    onClick={deleteImage}>
                      刪除圖片
                    </button>)}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="imagesUrl" className="form-label">
                      附圖
                    </label>
                    <input
                    value={inputImageValue.imagesUrl}
                    onChange={handleImageChange}
                    id="imagesUrl"
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <div className="mb-2">
                    {productModal.imagesUrl.map((url,index) => (
                    <img key={index} 
                    className="img-fluid" 
                    src={url} 
                    alt={productModal.title} />))}
                  </div>
                </div>
                <div>
                  {productModal.imagesUrl.length < 5 && inputImageValue.imagesUrl && (<button 
                  className="btn btn-outline-primary btn-sm d-block w-100"
                  onClick={addImages}>
                    新增圖片
                  </button>)}
                </div>
                <div>
                  {productModal.imagesUrl && productModal.imagesUrl.length >=1 && (<button
                  className="btn btn-outline-danger btn-sm d-block w-100"
                  onClick={deleteImages}>
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

export default App;
