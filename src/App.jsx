import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Todolist from './pages/Todolist';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Login />}></Route>
                    <Route path='register' element={<Register />}></Route>
                    <Route path='todolist' element={<Todolist />}></Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
