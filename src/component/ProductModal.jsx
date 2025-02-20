import axios from "axios";
import { Modal } from 'bootstrap';
import { useState, useEffect, useRef } from "react";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius"; 
function ProductModal ({ modalState, productModal, getProducts, isOpen, setIsOpen, myModalRef}) {
    const [modalData, setModalData] = useState(productModal)
    const modalRef = useRef(null);
    const fileRef = useRef(null);
    useEffect(() => {
        setModalData({
            ...productModal
        })
    },[productModal])

    const [inputImageValue, setInputImageValue] = useState({
        image: "",
        images: []
      })

    useEffect(() => {
        if (modalRef.current !== null && myModalRef.current === null) {
          myModalRef.current = new Modal(modalRef.current, {
            keyboard: false,
            backdrop: "static"
          });
        }
    }, []);

    //const [inputFileValue , setInputFileValue] = useState({
    //     fileName: ""
    // })

useEffect(() => {
    if(isOpen){
        setInputImageValue({
          image: "",
          images: []
        });
        fileRef.current.value = null
        setModalData((pre) => ({
          ...pre,
          imagesUrl: (!pre.imagesUrl ? []: pre.imagesUrl)
        }))
        myModalRef.current.show()
    } 
},[isOpen])

    const hasModalHide = () =>{
        if (myModalRef.current !== null){
          //fileRef.current.value = null
          myModalRef.current.hide();
          setIsOpen(false)
        } else {
          console.log('modalRef.current is null')
        }
    }

    const handleImageChange = (e) => {
        const {value, id} = e.target
        setInputImageValue((pre) =>({
          ...pre,
          [id]: value
        }))
      //   setModalData((pre) => ({
      //     ...pre,
      //     [id]: value
      // }));
      console.log(e.target.value)
    };
  
    const addImages = () => {
    const newImagesUrl = [...modalData.imagesUrl || [], inputImageValue.images]
      setModalData({
      ...modalData,
      imagesUrl: newImagesUrl
    })
    setInputImageValue((pre) => ({
      ...pre,
      images: ""
    }));
    }

    const addImage = () => {
        setModalData({
        ...modalData,
        imageUrl: inputImageValue.image
        })
        setInputImageValue((pre) => ({
        ...pre,
        image: ""
        }));
        
    };
    
    const deleteImages = () => {
    const newImagesUrl = [...modalData.imagesUrl]
    newImagesUrl.pop()
    setModalData((pre) => ({
        ...pre,
        imagesUrl: newImagesUrl
    }))
    }

    const deleteImage = () => {
        setModalData({
        ...modalData,
        imageUrl: ""
    })
    fileRef.current.value = null
    }
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        console.log(file)
        const formData = new FormData()
        console.log(formData)
        formData.append('file-to-upload', file)
        try{
        const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData) 
        setModalData({
            ...modalData,
            imageUrl: res.data.imageUrl
        })
        return fileRef.current.value = file.name
        // console.log("fileName",fileRef.current)
        // setInputFileValue({
        //   fileName: file.name
        // })
        }catch(err){
        console.log("upload failed")
        }
    }
    const setModalContent = (e) => {
        const {value, name, checked, type} = e.target
        setModalData({
          ...modalData,
          [name]: type === "checkbox" ? checked : value
        })
    }
    
    const addProduct = async () => {
        try {
          await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{
            data: {
              ...modalData,
              origin_price: Number(modalData.origin_price),
              price: Number(modalData.price),
              is_enabled: modalData.is_enabled ? 1 : 0
        }})
        } catch(err){
          console.log("add failed", err.message)
        }
    }
    
    const editProduct = async () => {
    try {
        await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`,{
        data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0
    }})
    } catch(err){
        console.log("edit failed")
    }
    }
    
    const submitProduct = async () =>{
    const updateModal = modalState === 'add' ? addProduct : editProduct;
    try{
        //console.log(modalState)
        await updateModal();
        getProducts();
        hasModalHide()
        setModalData(productModal)
        } catch(error){
          alert(error.response.data.message)
          console.log("submit failed")
    }
    }

    return(
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
                      value={inputImageValue.image}
                      onChange={handleImageChange}
                      id="image"
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      {...(modalData.imageUrl ? {disabled: true} : {})}
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
                      ref={fileRef}
                      // value={inputFileValue.fileName}
                      //onClick={() => console.log(fileRef.current.value)}
                    />                  
                  </div>
                  {modalData.imageUrl? <img
                      className="img-fluid"
                      src={modalData.imageUrl}
                      alt={modalData.title}
                    /> : null}
                  <div>
                    {inputImageValue.image && (<button 
                      className="btn btn-outline-primary btn-sm d-block w-100"
                      onClick={addImage}>
                      新增圖片
                    </button>)}
                </div>
                <div>
                  {modalData.imageUrl && (<button
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
                    value={inputImageValue.images}
                    onChange={handleImageChange}
                    id="images"
                    type="text"
                    className="form-control"
                    placeholder="請輸入圖片連結"
                    />
                </div>
                <div className="mb-3">
                    {modalData.imagesUrl?.map((url,index) => (
                    <img key={index} 
                    className="img-fluid" 
                    src={url} 
                    alt={modalData.title} />))}
                </div>
              </div>
              <div>
                {inputImageValue.images.length > 0 && modalData.imagesUrl?.length < 5 && (<button 
                className="btn btn-outline-primary btn-sm d-block w-100"
                onClick={addImages}>
                  新增圖片
                </button>)}
              </div>
              <div>
                {modalData.imagesUrl?.length >=1 && (<button
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
                  value={modalData.title}
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
                      value={modalData.category}
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
                      value={modalData.unit}
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
                      value={modalData.origin_price}
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
                      value={modalData.price}
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
                    value={modalData.description}
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
                    value={modalData.content}
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
                      checked={modalData.is_enabled}
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
    )
}
export default ProductModal