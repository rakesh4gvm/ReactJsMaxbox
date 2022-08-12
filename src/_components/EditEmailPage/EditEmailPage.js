import * as React from 'react'; 
import ReactDOM from 'react-dom';
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import FooterBottom from '../Footer/footer';
import Select from 'react-select' 
import Button from '@mui/material/Button'; 
import ButtonGroup from '@mui/material/ButtonGroup'; 
import BgProfile from '../../images/bg-profile.png';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'; 
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';

import inboximg2 from '../../images/inboximg2.jpg'; 
import 'froala-editor/js/froala_editor.pkgd.min.js';
  
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditor from 'react-froala-wysiwyg';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const options = [
  { value: 'v1', label: 'Country' },
  { value: 'v2', label: 'Country 1' },
  { value: 'v3', label: 'Country 2' }
]
 

export default function EditEmailPage({ children }) {
    const [selected, setSelected] = React.useState(false);

    const addShowCompose = () => {
      const element = document.getElementById("UserCompose")
      if(element.classList.contains("show")){
        element.classList.remove("show");
      }
      else{
        element.classList.add("show");
      }
    };
    const [open, setOpen] = React.useState(false);
    const [openone, setOpenone] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenOne = () => setOpenone(true);
    const handleCloseOne = () => setOpenone(false);

    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
      setValue(newValue);
    }; 
     
    

return (
    <>
    <HeaderTop />  
 
    <div className='bodymain'> 
      <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div> 
        <Col className='py-4'> 
          <h5 className='my-0'><a href='' className='mr-2 iconwhite'><ArrowBackIcon /></a> Edit Email Configuration</h5> 
        </Col> 
      </Row>  
       

      <div className='sm-container mt-5'>
      <Row>
        <Col>
            <Row>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='text' placeholder='First Name' id='firstName' name="firstName" />
                </div>
              </Col>
              <Col sm={4}>
                <div className='input-box'>
                  <input type='text' placeholder='Last Name' id='lastName' name="lastName"/>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={8}>
                <div className='input-box'>
                  <input type='email' placeholder='Email' id='email' />
                </div>
              </Col>
              <Col sm={4}>
              <Button className='btnauthenticate mt-4'><img src={LoaderCircle} className="mr-1" ></img> Re Authenticate</Button>
              </Col>
            </Row>
            
        </Col>   
      </Row>  
      <Row>
         <Col sm={2}>  
        </Col>
        <Col>
        <div className='btnprofile my-5 left'>
          <ButtonGroup variant="text" aria-label="text button group">
            {/* <Button variant="contained btn btn-primary smallbtn"> Edit</Button> */}
            <Button variant="contained btn btn-primary smallbtn mx-4 ml-0"> Save</Button>
            <Button variant="contained btn btn-orang smallbtn"> Cancel</Button>
          </ButtonGroup>
        </div>
        </Col>
      </Row>
      </div>

       

    </div>

    <FooterBottom />  

    </>
    );
}