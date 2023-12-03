import { React, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Lobby from "./pages/lobby";
import CodeBlock from './pages/codeblock';

function App() {

    return (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Lobby/>} />
              <Route path="/code-block/:id" element={<CodeBlock />} />
            </Routes>
          </BrowserRouter>
    );
}

export default App;
