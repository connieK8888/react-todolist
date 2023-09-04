import { useCallback, useContext, useEffect, useState } from 'react';
import UserContext from '../context/userContext';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { GrAdd } from 'react-icons/gr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { AiOutlineSave } from 'react-icons/ai';
import todolistBg from '../assets/list.svg';

const Todolist = () => {
    const { state } = useContext(UserContext);
    const navigate = useNavigate();
    const [todolist, setTodolist] = useState(null);
    const [content, setContent] = useState('');
    const [editToggle, setEditToggle] = useState(false);
    const [editTarget, setEditTarget] = useState('');
    const [filterTarget, setFilterTarget] = useState('全部');

    const handleFetchTodos = useCallback(async () => {
        try {
            const result = await axios.get('/todos');
            setTodolist(result?.data?.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: `獲取待辦清單失敗`,
                text: `${error}`,
            });
        }
    }, []);

    useEffect(() => {
        if (!state.isLogin) {
            navigate('/');
            return;
        }
        handleFetchTodos();
    }, [handleFetchTodos]);

    const handleAddTodolist = async () => {
        try {
            await toast.promise(axios.post('/todos/', { content }), {
                pending: '資料更新中',
                success: '🌟 新增代辦清單成功',
                error: '❗ 新增代辦清單失敗',
            });
            handleFetchTodos();
            setContent('');
            setFilterTarget('全部');
        } catch (error) {
            toast(`❗ 新增代辦清單失敗：${error?.response?.data?.message?.join(',')}`);
        }
    };

    const handleDeleteTodolist = async (id) => {
        try {
            Swal.fire({
                icon: 'question',
                title: `確認刪除待辦項目?`,
                text: '刪除完畢後資料將無法找回，確認刪除請點擊確認',
                showCancelButton: true,
                confirmButtonColor: '#d63031',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                preConfirm: async () => {
                    try {
                        return await axios.delete(`/todos/${id}`);
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            }).then((result) => {
                if (result.isConfirmed) {
                    toast(`⭕ 待辦清單 ${result.value.data.message}`);
                    handleFetchTodos();
                }
            });
        } catch (error) {
            toast(`❌ 待辦清單 ${error?.response?.data?.message?.join(',')}`);
        }
    };

    const handleCheckedTodolist = async (id) => {
        try {
            await toast.promise(axios.patch(`/todos/${id}/toggle`), {
                pending: '資料更新中',
                success: {
                    render({ data }) {
                        handleFetchTodos();
                        return `待辦清單：${data.data.message}`;
                    },
                    icon: '✅',
                },
                error: {
                    render({ data }) {
                        return `待辦清單：${data.response.data.message}`;
                    },
                    icon: '❌',
                },
            });
        } catch (error) {
            toast(`❌ 待辦清單 ${error?.response?.data?.message?.join(',')}`);
        }
    };

    const handleUpdateTodolist = async (id) => {
        try {
            if (!editToggle) {
                const filterId = todolist.filter((item) => item.id === id);
                setEditTarget(filterId);
                setEditToggle(true);
            } else {
                const check =
                    todolist.filter((item) => item.id === id)?.[0]?.content === editTarget?.[0]?.content ? true : false;
                // 判斷當修改內容沒有更動時。就不觸發 aip 呼叫
                if (check) {
                    setEditToggle(false);
                    return;
                } else {
                    toast.promise(
                        axios.put(`/todos/${editTarget?.[0]?.id}`, {
                            content: editTarget?.[0]?.content,
                        }),
                        {
                            pending: '資料更新中',
                            success: {
                                render({ data }) {
                                    return `待辦清單：${data.data.message}`;
                                },
                                icon: '✅',
                            },
                            error: {
                                render({ data }) {
                                    return `待辦清單：${data.response.data.message}`;
                                },
                                icon: '❌',
                            },
                        }
                    );
                    setEditToggle(false);
                    handleFetchTodos();
                }
            }
        } catch (error) {
            toast(`❌ 待辦清單 ${error?.response?.data?.message?.join(',')}`);
        }
    };

    const filterTodolist = todolist?.filter((item) =>
        filterTarget === '待完成' ? !item.status : filterTarget === '已完成' ? item.status : item
    );

    const handleDeleteAllItems = async () => {
        try {
            const deleteTarget = todolist.filter((item) => item.status);
            Swal.fire({
                icon: 'question',
                title: `確認刪除全部已完成的待辦項目?`,
                text: '刪除完畢後資料將無法找回，確認刪除請點擊確認',
                showCancelButton: true,
                confirmButtonColor: '#d63031',
                cancelButtonColor: '#b2bec3',
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                preConfirm: async () => {
                    try {
                        for (let i = 0; i < deleteTarget.length; i++) {
                            const result = await axios.delete(`/todos/${deleteTarget[i].id}`);
                            toast(`✅ 待辦清單 ${result?.data?.message}`);
                            handleFetchTodos();
                        }
                    } catch (error) {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
        } catch (error) {
            toast(`❌ 新增代辦清單失敗：${error?.response?.data?.message?.join(',')}`);
        }
    };

    return (
        <div className='container d-flex justify-content-center align-items-center mt-5'>
            <div
                className='d-flex flex-column w-100'
                style={{
                    maxWidth: `400px`,
                }}
            >
                <div className='input-group'>
                    <input
                        type='text'
                        placeholder='新增待辦項目'
                        className='form-control p-2'
                        value={content}
                        onChange={(e) => setContent(e.target.value.replace(' ', ''))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setContent(e.target.value.replace(' ', ''));
                                handleAddTodolist();
                            }
                        }}
                    />
                    <button type='button' className='btn btn-light btn-sm ms-2 ' onClick={() => handleAddTodolist()}>
                        <GrAdd className='icon' />
                    </button>
                </div>

                {todolist?.length === 0 ? (
                    <>
                        <div className='w-100 mt-3 '>
                            <p className='text-center text-white fs-5 fw-bolder mt-3'>目前尚無待辦事項</p>
                            <img
                                src={todolistBg}
                                alt='todolist'
                                className='d-block mx-auto w-75 '
                                style={{ opacity: 0.9 }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className=' bg-white shadow-lg border border-2 w-100 mt-3'
                            style={{
                                maxWidth: `400px`,
                            }}
                        >
                            <ul className='nav nav-tabs nav-pills nav-fill'>
                                {['全部', '待完成', '已完成'].map((item) => (
                                    <li className={`nav-item  ${filterTarget === item ? '' : ''}`} key={item}>
                                        <button
                                            className={`nav-link  ${filterTarget === item ? 'fw-bolder active' : ''} `}
                                            type='button'
                                            onClick={() => setFilterTarget(item)}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <ul className='list-unstyled mb-0 px-3 py-2'>
                                {filterTodolist?.map((item) => (
                                    <li key={item.id} className='border-bottom border-2 py-2'>
                                        <div className=' '>
                                            <div className='form-check d-flex justify-content-start align-items-center'>
                                                <input
                                                    type='checkbox'
                                                    id={item.id}
                                                    className='form-check-input items-checkbox-hover my-0 '
                                                    style={{ width: `20px`, height: `20px` }}
                                                    value={Boolean(item.status)}
                                                    checked={Boolean(item.status)}
                                                    onChange={(e) => handleCheckedTodolist(item.id)}
                                                />
                                                {editTarget?.[0]?.id === item.id && editToggle ? (
                                                    <input
                                                        type='text'
                                                        className='form-control w-75 fs-5 ms-3 py-0'
                                                        value={
                                                            editTarget?.[0]?.id === item.id
                                                                ? editTarget?.[0]?.content
                                                                : item.content
                                                        }
                                                        onChange={(e) => {
                                                            const newList = editTarget?.map((items) => ({
                                                                ...items,
                                                                content: e.target.value.replace(' ', ''),
                                                            }));
                                                            setEditTarget(newList);
                                                        }}
                                                    />
                                                ) : (
                                                    <label
                                                        htmlFor={item.id}
                                                        className={`form-check-label items-hover text-break w-75 fs-5 ms-3  ${
                                                            Boolean(item.status)
                                                                ? 'text-decoration-line-through text-muted'
                                                                : ''
                                                        }`}
                                                    >
                                                        {item.content}
                                                    </label>
                                                )}
                                                <div className='d-flex'>
                                                    <button
                                                        type='button'
                                                        className='btn btn-none btn-sm '
                                                        onClick={() => {
                                                            handleUpdateTodolist(item.id);
                                                        }}
                                                    >
                                                        {editTarget?.[0]?.id === item.id && editToggle ? (
                                                            <AiOutlineSave className='icon' />
                                                        ) : (
                                                            <BiEditAlt className='icon' />
                                                        )}
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='btn btn-none btn-sm'
                                                        onClick={() => handleDeleteTodolist(item.id)}
                                                    >
                                                        <FaRegTrashAlt className='icon' />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className='d-flex justify-content-between align-items-center p-3'>
                                <span className='fw-bolder'>
                                    {todolist?.filter((item) => !item.status).length}個待完成項目
                                </span>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-none text-muted'
                                    onClick={() => handleDeleteAllItems()}
                                >
                                    清除已完成項目
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer
                position='top-left'
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={false}
                theme='colored'
            />
        </div>
    );
};
export default Todolist;
