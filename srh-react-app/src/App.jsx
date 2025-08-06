import { useState } from 'react'
import TicketList from './app/department/ticket-list/ticketList'
import TicketComment from './app/department/ticket-comment/ticketComment'
import TicketStatus from './app/department/ticket-status/ticketStatus'
import TicketWork from './app/department/ticket-work/ticketWork'
import Home from './app/department/Home/home'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />  &nbsp;&nbsp;&nbsp;
        <Route path="/ticketList" element={<TicketList />} />&nbsp;&nbsp;&nbsp;
        <Route path="/ticketStatus" element={<TicketStatus />} />&nbsp;&nbsp;&nbsp;
        <Route path="/ticketWork" element={<TicketWork />} />&nbsp;&nbsp;&nbsp;
        <Route path='/ticketComment' element={<TicketComment/>} />
      </Routes>
    </BrowserRouter>
    </div>

  )
}

export default App
