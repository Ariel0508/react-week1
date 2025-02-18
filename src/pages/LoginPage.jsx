import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const api_url = import.meta.env.VITE_BASE_URL;

function LoginPage({setIsAuth}) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const checkUser = async () => {
    try {
      await axios.post(`${api_url}/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)arielToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
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
      document.cookie = `arielToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common.Authorization = `${token}`;
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
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
              <button type="submit" className="btn w-100 btn-primary mb-3">
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
  );
}

LoginPage.propTypes = {
    setIsAuth: PropTypes.func
};

export default LoginPage;
