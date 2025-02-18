import axios from 'axios';
import PropTypes from 'prop-types';

const api_url = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

function ProductModal({
  getProduct,
  modalState,
  modalRef,
  myModal,
  tempProduct,
  setTempProduct,
  closeModal,
  fileKey,
}) {
  const handleChangeProduct = (e) => {
    const { name, value, checked, type } = e.target;

    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleChangeImage = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value.trim();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };
  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const updateProduct = async (id) => {
    let product;
    if (modalState === 'edit') {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const productData = {
      data: {
        ...tempProduct,
        origin_price: +tempProduct.origin_price,
        price: +tempProduct.price,
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: tempProduct.imagesUrl,
      },
    };
    const url = `${api_url}/api/${api_path}/admin/${product}`;
    try {
      if (modalState === 'edit') {
        const res = await axios.put(url, productData);
        alert(res.data.message);
      } else {
        const res = await axios.post(url, productData);
        alert(res.data.message);
      }
      myModal.current.hide();
      getProduct();
    } catch (error) {
      console.log(error.response?.data);
      if (modalState === 'edit') {
        alert(error.response?.data);
      } else {
        alert(error.response?.data);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(`${api_url}/api/${api_path}/admin/upload`, formData);
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct((prevProduct) => ({
          ...prevProduct,
          imageUrl: uploadImageUrl,
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="modal" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">編輯產品</h2>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="fileInput" className="form-label">
                    圖片上傳
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                    key={fileKey} 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mainImage" className="form-label">
                    主圖
                  </label>
                  <input
                    value={tempProduct.imageUrl}
                    onChange={handleChangeProduct}
                    type="text"
                    className="form-control"
                    name="imageUrl"
                    id="mainImage"
                    placeholder="請輸入圖片連結"
                  />

                  {tempProduct.imageUrl?.trim() !== '' && (
                    <img
                      src={tempProduct.imageUrl}
                      alt="主圖"
                      className="img-fluid mt-2"
                    />
                  )}
                </div>
                <div className="border rounded-3 p-3">
                  {tempProduct.imagesUrl?.map((image, index) => {
                    const imageId = `imagesUrl-${index + 1}`;
                    return (
                      <div key={imageId} className="mb-2">
                        <label htmlFor={imageId} className="form-label">
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleChangeImage(e, index)}
                          name="imagesUrl"
                          id={imageId}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    );
                  })}

                  <div className="btn-group w-100">
                    {tempProduct.imagesUrl.length < 5 &&
                      tempProduct.imagesUrl[
                        tempProduct.imagesUrl.length - 1
                      ]?.trim() !== '' && (
                        <button
                          onClick={handleAddImage}
                          className="btn btn-outline-primary"
                        >
                          新增圖片
                        </button>
                      )}
                    {tempProduct.imagesUrl.length > 1 && (
                      <button
                        onClick={handleRemoveImage}
                        className="btn btn-outline-danger"
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={tempProduct.title}
                    onChange={handleChangeProduct}
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="請輸入標題"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={tempProduct.category}
                    onChange={handleChangeProduct}
                    type="text"
                    className="form-control"
                    name="category"
                    id="category"
                    placeholder="請輸入分類"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={tempProduct.unit}
                    onChange={handleChangeProduct}
                    type="text"
                    className="form-control"
                    name="unit"
                    id="unit"
                    placeholder="請輸入單位"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleChangeProduct}
                        type="number"
                        className="form-control"
                        name="origin_price"
                        id="origin_price"
                        placeholder="請輸入原價"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleChangeProduct}
                        type="number"
                        className="form-control"
                        name="price"
                        id="price"
                        placeholder="請輸入售價"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={tempProduct.description}
                    onChange={handleChangeProduct}
                    rows="4"
                    className="form-control"
                    name="description"
                    id="description"
                    placeholder="請輸入產品描述"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={tempProduct.content}
                    onChange={handleChangeProduct}
                    rows="4"
                    className="form-control"
                    name="content"
                    id="content"
                    placeholder="請輸入說明內容"
                  />
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={tempProduct.is_enabled}
                    onChange={handleChangeProduct}
                    name="is_enabled"
                    id="is_enabled"
                  />
                  <label className="form-check-label" htmlFor="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button
              onClick={() => updateProduct(tempProduct.id)}
              type="button"
              className="btn btn-primary"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  getProduct: PropTypes.func.isRequired,
  modalState: PropTypes.string.isRequired,
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
  setTempProduct: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  fileKey: PropTypes.number.isRequired,
};

export default ProductModal;
