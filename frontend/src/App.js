import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Email from './Email';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Email />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
