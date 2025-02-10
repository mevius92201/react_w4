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
      setProductModal(state);
      if (state === 'add'){
        setProductModal({...defaultModal})
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
    )
}

export default ProductPage;
