import React, { useState, useEffect } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import Navigation from '../Navigation/Navigation'; 
import ListInbox from '../ListInbox/ListInbox'; 



export default function NewInboxPage() {
   
  // Login method start
  return (
    <>
      <div className='lefter'>
        <Navigation />
      </div>
      <div className='righter'> 
        <ListInbox />
      </div>
       
  

    </>
  );
}