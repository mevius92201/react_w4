
function Pagination ({getProducts, pagination}) {

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages){
          getProducts(newPage)
      }
    }
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

    
    if (pagination.total_pages > 1) {
     return(
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
        );  
    }return null;
}

export default Pagination;