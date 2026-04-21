import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Builder from './pages/Builder'
import FormFill from './pages/FormFill'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/fill/:formId" element={<FormFill />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
