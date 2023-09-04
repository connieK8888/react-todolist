import { useForm } from 'react-hook-form';
import InputGroup from '../components/InputGroup';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        getValues,
    } = useForm({
        initialValues: {
            email: '',
            nickname: '',
            password: '',
            passwordCheck: '',
        },
        mode: 'onTouched',
    });
    const [togglePasswordType, setTogglePasswordType] = useState('password');
    const [toggleCheckPasswordType, setToggleCheckPasswordType] = useState('password');
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitData = async (data) => {
        try {
            const { email, password, nickname } = data;
            Swal.fire({
                icon: 'info',
                title: `註冊中`,
                showConfirmButton: false,
                allowEscapeKey: false,
                didOpen: async () => {
                    try {
                        Swal.showLoading();
                        const result = await axios.post('/users/sign_up', {
                            email,
                            password,
                            nickname,
                        });
                        Swal.hideLoading();
                        Swal.fire({
                            icon: 'success',
                            title: `註冊成功`,
                            text: '即將前往登入頁面',
                            showConfirmButton: false,
                            timer: 1200,
                        });
                        setIsSuccess(result?.data?.status);
                        reset();
                        setTimeout(() => {
                            navigate('/');
                        }, 1200);
                    } catch (error) {
                        Swal.hideLoading();
                        Swal.update({
                            icon: 'error',
                            title: '註冊失敗',
                            text: error?.response?.data?.message,
                            showConfirmButton: true,
                        });
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
        } catch (error) {
            throw new Error(error);
        }
    };

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
                    <legend className='text-center fw-bolder fs-3'>會員註冊</legend>

                    <InputGroup
                        register={register}
                        errors={errors}
                        id='email'
                        type='email'
                        groupClass='mb-3'
                        labelText='電子信箱'
                        labelClass='form-label fw-bolder'
                        inputClass='form-control'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: '未符合電子信箱格式',
                            },
                        }}
                        placeholder='請輸入電子信箱'
                    ></InputGroup>

                    <InputGroup
                        register={register}
                        errors={errors}
                        id='nickname'
                        type='text'
                        groupClass='mb-3'
                        labelText='暱稱'
                        labelClass='form-label fw-bolder'
                        inputClass='form-control'
                        rules={{ required: { value: true, message: '此欄位必填' } }}
                        placeholder='請輸入暱稱'
                    ></InputGroup>

                    <InputGroup
                        register={register}
                        errors={errors}
                        id='password'
                        type={togglePasswordType}
                        groupClass=' mb-3 '
                        labelText='密碼'
                        labelClass='form-label  fw-bolder position-relative w-100'
                        inputClass='form-control  '
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            minLength: { value: 6, message: '密碼長度最少6碼' },
                            maxLength: { value: 18, message: '密碼長度最18碼' },
                        }}
                        placeholder='請輸入密碼 6-18 碼'
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
                    <InputGroup
                        register={register}
                        errors={errors}
                        id='password-check'
                        type={toggleCheckPasswordType}
                        groupClass=' mb-3'
                        labelText='再次輸入密碼'
                        labelClass='form-label fw-bolder position-relative w-100'
                        inputClass='form-control'
                        rules={{
                            required: { value: true, message: '此欄位必填' },
                            validate: (value) => value === getValues('password') || '兩次密碼不相同，請在確認',
                            minLength: { value: 6, message: '密碼長度最少6碼' },
                            maxLength: { value: 18, message: '密碼長度最18碼' },
                        }}
                        placeholder='請再次輸入密碼'
                    >
                        <button
                            type='button'
                            className='btn btn-none btn-sm icon-position'
                            onClick={() =>
                                setToggleCheckPasswordType((pre) => (pre === 'password' ? 'text' : 'password'))
                            }
                        >
                            {toggleCheckPasswordType === 'password' ? (
                                <AiOutlineEyeInvisible className='icon' />
                            ) : (
                                <AiOutlineEye className='icon' />
                            )}
                        </button>
                    </InputGroup>

                    <input type='submit' value='註冊' className='btn btn-primary w-100 mt-2' />

                    <div className='text-center mt-4'>
                        已經有帳號了?{' '}
                        <Link to='/' className='fw-bolder'>
                            前往登入
                        </Link>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
export default Register;
