import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const api_url = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

function App() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isAuth, setIsAuth] = useState(false);
    const [products, setProducts] = useState([]);
    const modalRef = useRef(null);
    const myModal = useRef(null);
    const defaultState = {
        imageUrl: "",
        title: "",
        category: "",
        unit: "",
        origin_price: "",
        price: "",
        description: "",
        content: "",
        is_enabled: 0,
        imagesUrl: [""]
    };

    const [tempProduct, setTempProduct] = useState(defaultState);
    const [modalState, setModalState] = useState(null);
    const openModal = (state, product = defaultState) => {
        myModal.current.show();
        setModalState(state);
        setTempProduct({ ...product });
    };
    const closeModal = () => {
        myModal.current.hide();
    }

    useEffect(() => {
        myModal.current = new Modal(modalRef.current)
    }, [])
    const checkUser = async () => {
        try {
            await axios.post(`${api_url}/api/user/check`);
            await getProduct();
            setIsAuth(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const getProduct = async () => {
        try {
            const res = await axios.get(
                `${api_url}/api/${api_path}/admin/products`
            );
            setProducts(res.data.products);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)arielToken\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        if (token) {
            axios.defaults.headers.common.Authorization = `${token}`;
            checkUser();
        }
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((preData) => ({
            ...preData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${api_url}/admin/signin`, formData);
            const { token, expired } = res.data;
            document.cookie = `arielToken=${token}; expires=${new Date(
                expired
            )}`;
            axios.defaults.headers.common.Authorization = `${token}`;
            checkUser();
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    const handleChangeProduct = (e) => {
        const { name, value, checked, type } = e.target;

        setTempProduct({
            ...tempProduct,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleChangeImage = (e, index) => {
        const { value } = e.target;
        const newImages = [...tempProduct.imagesUrl];
        newImages[index] = value.trim();
        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    const handleAddImage = () => {
        const newImages = [...tempProduct.imagesUrl, ""];
        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }
    const handleRemoveImage = () => {
        const newImages = [...tempProduct.imagesUrl];
        newImages.pop();
        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    const updateProduct = async (id) => {
        let product;
        if (modalState === "edit") {
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
            if (modalState === "edit") {
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
            if (modalState === "edit") {
                alert(error.response?.data);
            } else {
                alert(error.response?.data);
            }
        }
    }
    // 新增 10 筆產品
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
    }

    return (
        <>
            {!isAuth ? (
                <div className="container login">
                    <div className="row d-flex justify-content-center align-items-center vh-100">
                        <div className="col-md-6 col-lg-4">
                            <h1 className="text-center fw-medium">請先登入</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mt-3">
                                    <label htmlFor="username">Email</label>
                                    <input
                                        onChange={handleInputChange}
                                        type="text"
                                        value={formData.username}
                                        className="form-control"
                                        id="username"
                                        placeholder="email@example.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        onChange={handleInputChange}
                                        type="password"
                                        value={formData.password}
                                        className="form-control"
                                        id="password"
                                        placeholder="password"
                                        required
                                    />
                                </div>
                                <div className="mt-3 text-center">
                                    <button
                                        type="submit"
                                        className="btn w-100 btn-primary mb-3"
                                    >
                                        登入
                                    </button>
                                </div>
                            </form>
                            <p className="mt-5 mb-3 text-muted text-center">
                                &copy; 2024~∞ - 六角學院
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mt-5">
                    <div className="row">
                        <div className="col">
                            <div className="text-end">
                                <button onClick={() => openModal("new")} className="btn btn-primary">建立新的產品</button>
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
                                            <td>
                                                {product.is_enabled
                                                    ? "啟用"
                                                    : "未啟用"}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => openModal("edit", product)}
                                                    type="button"
                                                    className="btn btn-outline-primary me-2"
                                                >
                                                    編輯
                                                </button>
                                                <button
                                                    onClick={() => openModal("delete", product)}
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
                </div>

            )}
            <div className="modal" tabIndex="-1" ref={modalRef}>
                <div className={`modal-dialog ${modalState === "delete" ? "" : "modal-xl"}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{modalState === "delete" ? "刪除產品" : modalState === "new" ? "新增產品" : "編輯產品"}</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                modalState === "delete" ? (
                                    <p>確定要刪除產品嗎?</p>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="mainImage" className="form-label">主圖</label>
                                                <input value={tempProduct.imageUrl} onChange={handleChangeProduct} type="text" className="form-control" name="imageUrl" id="mainImage" placeholder="請輸入圖片連結" />

                                                {
                                                    tempProduct.imageUrl?.trim() !== "" && <img src={tempProduct.imageUrl} alt="主圖" className="img-fluid mt-2" />
                                                }
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
                                                            {image && <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-2" />}
                                                        </div>
                                                    )
                                                })}

                                                <div className="btn-group w-100">
                                                    {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]?.trim() !== "" && (
                                                        <button onClick={handleAddImage} className="btn btn-outline-primary">新增圖片</button>
                                                    )
                                                    }
                                                    {
                                                        tempProduct.imagesUrl.length > 1 && (
                                                            <button onClick={handleRemoveImage} className="btn btn-outline-danger">刪除圖片</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                <label htmlFor="title" className="form-label">標題</label>
                                                <input value={tempProduct.title} onChange={handleChangeProduct} type="text" className="form-control" name="title" id="title" placeholder="請輸入標題" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="category" className="form-label">分類</label>
                                                <input value={tempProduct.category} onChange={handleChangeProduct} type="text" className="form-control" name="category" id="category" placeholder="請輸入分類" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="unit" className="form-label">單位</label>
                                                <input value={tempProduct.unit} onChange={handleChangeProduct} type="text" className="form-control" name="unit" id="unit" placeholder="請輸入單位" />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="origin_price" className="form-label">原價</label>
                                                        <input value={tempProduct.origin_price} onChange={handleChangeProduct} type="number" className="form-control" name="origin_price" id="origin_price" placeholder="請輸入原價" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="price" className="form-label">售價</label>
                                                        <input value={tempProduct.price} onChange={handleChangeProduct} type="number" className="form-control" name="price" id="price" placeholder="請輸入售價" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">產品描述</label>
                                                <textarea value={tempProduct.description} onChange={handleChangeProduct} rows="4" className="form-control" name="description" id="description" placeholder="請輸入產品描述" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="content" className="form-label">說明內容</label>
                                                <textarea value={tempProduct.content} onChange={handleChangeProduct} rows="4" className="form-control" name="content" id="content" placeholder="請輸入說明內容" />
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" checked={tempProduct.is_enabled} onChange={handleChangeProduct} name="is_enabled" id="is_enabled" />
                                                <label className="form-check-label" htmlFor="is_enabled">
                                                    是否啟用
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>取消</button>
                            {
                                modalState === "delete" ? (
                                    <button onClick={() => delProduct(tempProduct.id)} type="button" className="btn btn-danger">確定</button>
                                ) : (
                                    <button onClick={() => updateProduct(tempProduct.id)} type="button" className="btn btn-primary">確定</button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
