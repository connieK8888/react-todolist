import { useForm } from 'react-hook-form';
import InputGroup from '../components/InputGroup';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserContext from '../context/userContext';

const Login = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        mode: 'onTouched',
    });
    const [togglePasswordType, setTogglePasswordType] = useState('password');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { state, handleUserLogin } = useContext(UserContext);

    const handleSubmitData = async (data) => {
        try {
            const { email, password } = data;
            Swal.fire({
                icon: 'info',
                title: `登入中`,
                showConfirmButton: false,
                allowEscapeKey: false,
                didOpen: async () => {
                    try {
                        Swal.showLoading();
                        const result = await axios.post('/users/sign_in', {
                            email,
                            password,
                        });
                        Swal.hideLoading();
                        Swal.fire({
                            icon: 'success',
                            title: `登入成功`,
                            text: '即將前往待辦事項頁面',
                            showConfirmButton: false,
                            timer: 1000,
                        });
                        document.cookie = `token=${result.data.token};exp=${result.data.exp}`;
                        axios.defaults.headers.common['Authorization'] = result.data.token;
                        handleUserLogin(result.data);
                        setIsSuccess(true);
                        reset();
                        setTimeout(() => {
                            navigate('/todolist');
                        }, 2000);
                    } catch (error) {
                        Swal.hideLoading();
                        Swal.update({
                            icon: 'error',
                            title: '登入失敗',
                            text: error?.response?.data?.message,
                            showConfirmButton: true,
                        });
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: `登入失敗`,
                text: `${error}`,
            });
        }
    };

    useEffect(() => {
        if (state.isLogin) {
            navigate('/todolist');
        }
    }, [state.isLogin]);

    return (
        <div className='container d-flex justify-content-center align-items-center mt-5'>
            <form
                onSubmit={handleSubmit(handleSubmitData)}
                className=' bg-white shadow-lg border border-2 w-100 p-3 '
                style={{
                    maxWidth: `400px`,
                }}
            >
                <fieldset className='p-3'>
                    <legend className='text-center fw-bolder fs-3'>待辦清單登入</legend>

                    <InputGroup
                        register={register}
                        errors={errors}
                        id='email'
                        type='text'
                        groupClass='mb-3'
                        labelText='帳號'
                        labelClass='form-label fw-bolder'
                        inputClass='form-control'
                        rules={{ required: { value: true, message: '此欄位必填' } }}
                        placeholder='請輸入電子信箱'
                    ></InputGroup>

                    <InputGroup
                        register={register}
                        errors={errors}
                        id='password'
                        type={togglePasswordType}
                        groupClass='mb-3'
                        labelText='密碼'
                        labelClass='form-label fw-bolder position-relative w-100'
                        inputClass='form-control'
                        rules={{ required: { value: true, message: '此欄位必填' } }}
                        placeholder='請輸入密碼'
                    >
                        <button
                            type='button'
                            className='btn btn-none btn-sm icon-position'
                            onClick={() => setTogglePasswordType((pre) => (pre === 'password' ? 'text' : 'password'))}
                        >
                            {togglePasswordType === 'password' ? (
                                <AiOutlineEyeInvisible className='icon' />
                            ) : (
                                <AiOutlineEye className='icon' />
                            )}
                        </button>
                    </InputGroup>

                    <input type='submit' value='登入' class="btn btn-outline-primary w-100 mt-2"  />

                    <div className='text-center mt-4'>
                        還沒有註冊?{' '}
                        <Link to='register' className='fw-bolder'>
                            前往註冊
                        </Link>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
export default Login;

