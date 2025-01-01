import { useState } from 'react'
import './App.css'

const products = [
    {
        category: "甜甜圈",
        content: "尺寸：14x14cm",
        description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
        id: "-L9tH8jxVb2Ka_DYPwng",
        is_enabled: 1,
        origin_price: 150,
        price: 99,
        title: "草莓莓果夾心圈",
        unit: "元",
        num: 10,
        imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8",
        imagesUrl: [
            "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a",
            "https://images.unsplash.com/photo-1559656914-a30970c1affd"
        ]
    },
    {
        category: "蛋糕",
        content: "尺寸：6寸",
        description: "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
        id: "-McJ-VvcwfN1_Ye_NtVA",
        is_enabled: 1,
        origin_price: 1000,
        price: 900,
        title: "蜂蜜檸檬蛋糕",
        unit: "個",
        num: 1,
        imageUrl: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
        imagesUrl: [
            "https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80",
        ]
    },
    {
        category: "蛋糕",
        content: "尺寸：6寸",
        description: "法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。",
        id: "-McJ-VyqaFlLzUMmpPpm",
        is_enabled: 1,
        origin_price: 700,
        price: 600,
        title: "暗黑千層",
        unit: "個",
        num: 15,
        imageUrl: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
        imagesUrl: [
            "https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
            "https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
        ]
    }
]


function App() {
    const [tempProduct, setTempProduct] = useState({});
    return (
        <div className="container mt-5">
            <div className="row row-cols-2">
                <div className="col">
                    <h2>產品列表</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">產品名稱</th>
                                <th scope="col">原價</th>
                                <th scope="col">售價</th>
                                <th scope="col">是否啟用</th>
                                <th scope="col">查看細節</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(product =>
                                (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary" onClick={() => setTempProduct(product)}>查看細節</button>
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="col">
                    <h2>單一產品細節</h2>
                    {
                        tempProduct.title ? (
                            <div className="card">
                                <img src={tempProduct.imageUrl} className="card-img-top object-fit-contain" alt={tempProduct.title} />
                                <div className="card-body">
                                    <h3 className="card-title d-flex">{tempProduct.title}
                                        <span className="badge text-bg-primary ms-3">{tempProduct.category}
                                        </span>
                                    </h3>
                                    <p className="card-text">商品描述：{tempProduct.description}</p>
                                    <p className="card-text">商品內容：{tempProduct.content}</p>
                                    <div>
                                        <del className="text-secondary">150</del>元 / <span>99 元</span>
                                    </div>
                                    <h5 className="mt-3">更多圖片：</h5>
                                    <div className="d-flex flex-wrap">
                                        {
                                            tempProduct?.imagesUrl.map((image, i) => (
                                                <img className="product-image object-fit-cover mt-3" key={i} src={image} alt="" />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>) : (<p className="text-secondary">請選擇一個商品查看</p>)
                    }

                </div>
            </div>
        </div>
    )
}

export default App
