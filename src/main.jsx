// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Redux Provider 추가
import { store } from './store/store'; // 설정한 store 가져오기
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Redux store를 제공 */}
      <App />
    </Provider>
  </React.StrictMode>
);
