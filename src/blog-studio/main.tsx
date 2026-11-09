import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BlogStudio from './BlogStudio';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlogStudio />
  </StrictMode>,
);
