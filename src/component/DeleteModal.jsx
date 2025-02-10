import {useState, useEffect, useRef} from 'react'
import axios from "axios";
import { Modal } from 'bootstrap';

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius"; 

function DeleteModal({productModal, getProducts, myDeleteModalRef, isOpen, setIsOpen}){
    const [modalData, setModalData] = useState(productModal);
    const deleteModalRef = useRef(null);
    
    useEffect(() => {
        setModalData({
            ...productModal
        })
    },[productModal])

    useEffect (()=>{
        if (deleteModalRef.current !== null && myDeleteModalRef.current === null){
          myDeleteModalRef.current = new Modal(deleteModalRef.current, {
            keyboard: false,
            backdrop: "static"
          });
        }
    },[])

    useEffect(() => {
        if(isOpen){
            myDeleteModalRef.current.show()
        } 
    },[isOpen])

    const hasDeleteModalHide = () =>{
        if (myDeleteModalRef.current !== null){
            myDeleteModalRef.current.hide();
            setIsOpen(false)
        } else {
          console.log('deleteModalRef.current is null')
        }
    }

    const deleteProduct = async () => {
    try{
        await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`);
        getProducts();
        hasDeleteModalHide()

    } catch (error) {
        console.log("delete failed");
    }
    };  

    return(
        <div className="modal fade" id="deleteModal" ref={deleteModalRef} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteModalLabel">Notice</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
            onClick={hasDeleteModalHide}></button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete {modalData.title}?
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
    )
}
export default DeleteModal