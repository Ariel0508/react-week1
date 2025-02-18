import PropTypes from 'prop-types';

function Pagination({ pagination, handlePageChange }) {
  return (
    <>
    <nav className="mt-3">
      <ul className="pagination">
        <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            上一頁
          </a>
        </li>
        {[...Array(pagination.total_pages)].map((_, index) => {
          return (
            <li
              key={index}
              className={`${
                pagination.current_page === index + 1 ? 'active' : ''
              }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          );
        })}
        <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}>
          <a
            className="page-link"
            href="#"
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            下一頁
          </a>
        </li>
      </ul>
    </nav>
    </>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    has_pre: PropTypes.bool,
    current_page: PropTypes.number,
    total_pages: PropTypes.number,
    has_next: PropTypes.bool,
}).isRequired,
handlePageChange: PropTypes.func.isRequired,
};

export default Pagination;
