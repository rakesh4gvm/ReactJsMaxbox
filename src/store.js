// src/store.js
import { createStore } from 'redux';
import variableReducer from './_reducers/variableReducer';

const store = createStore(variableReducer);

export default store;
