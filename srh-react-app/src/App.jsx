import "bootstrap/dist/css/bootstrap.min.css"
import React from 'react'
import Admin_dashboard from './app/admin/admin-dashboard/Admin_dashboard'
import Admin_login from "./app/admin/admin-login/Admin_login"
import Admin_cancel from "./app/admin/admin-cancel/Admin_cancel"
import {Routes, Route, BrowserRouter} from 'react-router-dom'
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Admin_dashboard />} />
                    <Route path="/admin_login" element={<Admin_login/>} />
                    <Route path="/admin_cancel" element={<Admin_cancel/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
