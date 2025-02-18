import axios from 'axios';
import PropTypes from 'prop-types';

const api_url = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

function DelProductModal({
  getProduct,
  modalRef,
  myModal,
  tempProduct,
  closeModal,
}) {
  const delProduct = async (id) => {
    const url = `${api_url}/api/${api_path}/admin/product/${id}`;
    try {
      const res = await axios.delete(url);
      alert(res.data.message);
      myModal.current.hide();
      getProduct();
    } catch (error) {
      alert(error.response?.data);
    }
  };

  return (
    <div className="modal" tabIndex="-1" ref={modalRef}>
      <div
        className="modal-dialog"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">刪除產品</h2>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <p>確定要刪除產品嗎?</p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                onClick={() => delProduct(tempProduct.id)}
                type="button"
                className="btn btn-danger"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

DelProductModal.propTypes = {
  getProduct: PropTypes.func.isRequired,
  modalRef: PropTypes.object.isRequired,
  myModal: PropTypes.object.isRequired,
    tempProduct: PropTypes.shape({
      id: PropTypes.string,
      imageUrl: PropTypes.string,
      title: PropTypes.string,
      category: PropTypes.string,
      unit: PropTypes.string,
      origin_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      content: PropTypes.string,
      is_enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      imagesUrl: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default DelProductModal;
