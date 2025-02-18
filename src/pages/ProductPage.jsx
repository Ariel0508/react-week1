import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';

const api_url = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

function ProductPage() {
  const [products, setProducts] = useState([]);

  const defaultState = {
    imageUrl: '',
    title: '',
    category: '',
    unit: '',
    origin_price: '',
    price: '',
    description: '',
    content: '',
    is_enabled: 0,
    imagesUrl: [''],
  };

  const [tempProduct, setTempProduct] = useState(defaultState);
  const [modalState, setModalState] = useState('');
  const [pagination, setPagination] = useState({});

  const productModalRef = useRef(null);
  const delModalRef = useRef(null);
  const myProductModal = useRef(null);
  const myDelModal = useRef(null);

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (productModalRef.current) {
      myProductModal.current = new Modal(productModalRef.current, {
        backdrop: "static", 
        keyboard: false,
      });
    }
    if (delModalRef.current) {
      myDelModal.current = new Modal(delModalRef.current, {
        backdrop: "static", 
        keyboard: false,
      });
    }
  }, []);

  const openModal = (state, product = defaultState) => {
    setModalState(state);
    setTempProduct({ ...product });

      if (state === 'delete') {
        myDelModal.current?.show();
      } else {
        myProductModal.current?.show();
      };
  };
  const [fileKey, setFileKey] = useState(Date.now()); 
  const closeModal = () => {
    if (modalState === 'delete') {
      myDelModal.current?.hide();
    } else {
      myProductModal.current?.hide();
    }
    setModalState('');
    setFileKey(Date.now());
  };

  const getProduct = async (page = 1) => {
    try {
      const res = await axios.get(
        `${api_url}/api/${api_path}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert(error.message);
    }
  };


  const handlePageChange = (page) => {
    getProduct(page);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="text-end">
              <button
                onClick={() => openModal('new')}
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>
            <h2>產品列表</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">分類</th>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                    <td>
                      <button
                        onClick={() => openModal('edit', product)}
                        type="button"
                        className="btn btn-outline-primary me-2"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => openModal('delete', product)}
                        type="button"
                        className="btn btn-outline-danger "
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      </div>
      <ProductModal
        getProduct={getProduct}
        modalState={modalState}
        modalRef={productModalRef}
        myModal={myProductModal}
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        closeModal={closeModal}
        fileKey={fileKey}
      />
      <DelProductModal
        getProduct={getProduct}
        modalRef={delModalRef}
        myModal={myDelModal}
        tempProduct={tempProduct}
        closeModal={closeModal}
      />
    </>
  );
}

export default ProductPage;
