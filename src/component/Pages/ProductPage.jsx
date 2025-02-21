import Pagination from '../Pagination';
function ProductPage({
    myModalRef,
    myDeleteModalRef,
    setIsProductModalOpen,
    setIsDeleteModalOpen,
    getProducts,
    pagination,
    setModalState,
    setProductModal,
    defaultModal,
    products}){
    
    const hasModalShow = (state, item) =>{
      setModalState(state);
      if (state === 'add'){
        setProductModal({...defaultModal})
        setModalState('add')
        
      }
      if (state === 'copy'){
        setProductModal({
          ...item,
          title: `copy of ${item.title}`,
          id: null
        })
        setModalState('add') 
       
      }if (state === 'edit'){
        setProductModal({
          ...item,
        })
        setModalState('edit')
        //console.log(item)
      }if (myModalRef.current !== null){
        setIsProductModalOpen(true);
      } else {
        console.log('modalRef.current is null')
      }
    }
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

    return(
        <div>
            <div className="container">
            <div className="text-end mt-4">
                <button className="btn btn-primary" 
                onClick={() => 
                {hasModalShow(`add`, defaultModal);
                //setProductModal(defaultModal);
                }
                }>Create</button>
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
                    <div className="d-grid gap-1 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() =>{hasModalShow(`edit`, item);}}     
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() =>{hasModalShow(`copy`, item);}}     
                        >
                            Copy
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() =>{hasDeleteModalShow(item)}}
                        >
                            Delete
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
    )
}
export default ProductPage;
