import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const Navbar = () => {
    const [toggle, setToggle] = useState(false);
    const showRef = useRef(null);
    const buttonRef = useRef(null);
    const { state, handleUserLogout } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggle = () => {
        setToggle(buttonRef.current.ariaExpanded);
    };

    useEffect(() => {}, [toggle]);

    const handleLogout = async (e) => {
        try {
            e.preventDefault();
            const result = await axios.post('/users/sign_out');
            Swal.fire({
                icon: 'success',
                title: `登出成功`,
                text: `${result?.data?.message}`,
                showConfirmButton: true,
                confirmButtonColor: '#6c5ce7',
                confirmButtonText: '確認',
            }).then((result) => {
                if (result.isConfirmed) {
                    document.cookie = 'token=;';
                    handleUserLogout();
                    navigate('/');
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: `登出失敗`,
                text: `${error}`,
            });
        }
    };

    return (
        <header className='sticky-top '>
            <nav className='home-base-bg navbar navbar-expand-lg  py-2 px-4' role='navigation'>
                <div className='container-fluid align-items-center '>
                    <Link
                        to='/'
                        className='navbar-brand p-0'
                        onClick={(e) => (state.isLogin ? e.preventDefault() : null)}
                    >
                        <h1 className='fs-3 fw-bolder text-white m-0 '>TODO LIST</h1>
                    </Link>
                    <button
                        className='navbar-toggler bg-white'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        ref={buttonRef}
                        onClick={(e) => handleToggle(e)}
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent' ref={showRef}>
                        <ul className='list-unstyled d-flex justify-content-end align-items-center flex-column flex-lg-row w-100 mb-0'>
                            {[
                                { title: '登入/註冊', path: '/' },
                                { title: '登出', path: '/login' },
                                { title: `管理待辦`, path: '/todolist' },
                            ].map((item, i) => (
                                <li key={i} style={{ color: toggle ? 'black' : '' }}>
                                    <NavLink
                                        to={item.path}
                                        role='button'
                                        className='nav-link fw-bolder  me-2 py-3 px-2'
                                        style={({ isActive }) => ({
                                            color: isActive ? 'white' : toggle ? 'black' : '#b2bec3',
                                            display:
                                                state.isLogin && item.title === '登入/註冊'
                                                    ? 'none'
                                                    : (!state.isLogin && item.title === '登出') ||
                                                      (!state.isLogin && item.title === '管理待辦')
                                                    ? 'none'
                                                    : '',
                                        })}
                                        // onClick={() => navbarToggle()}
                                        aria-label={`前往${item.title}頁面`}
                                        onClick={(e) => (item.title === '登出' ? handleLogout(e) : null)}
                                    >
                                        {item.title === '管理待辦' ? `${state.name}的待辦` : item.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};
export default Navbar;
