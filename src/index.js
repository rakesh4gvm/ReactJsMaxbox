import React from 'react';
import Axios from "axios"
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GetUserDetails, Logout } from '../src/_helpers/Utility'
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

Axios.interceptors.request.use(
  config => {
    var Objdata = GetUserDetails();
    if (Objdata != null) {
      config.headers['authorization'] = 'Bearer ' + Objdata.Token + ' ' + Objdata.StaticToken
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)
Axios.interceptors.response.use(
  response => {
    return response
  },
  function (error) {
    if (error.response.status === 400) {
      Logout();
      return Promise.reject(error)
    }
    Logout()
    return Promise.reject(error)
  }
)


root.render(
  <DndProvider backend={HTML5Backend}> 
    <Provider store={store}>
      <App />
    </Provider>
        {/* <DraggableComponent name="Item 1" />
        <DroppableComponent /> */} 
    </DndProvider>
  // <React.StrictMode>
  // <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
