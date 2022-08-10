import * as React from 'react'; 
import { Col, Row } from 'react-bootstrap';
import MainHeader from '../MainHeader/MainHeader';
import FooterBottom from '../Footer/footer';
import Select from 'react-select' 
import Button from '@mui/material/Button'; 
import ButtonGroup from '@mui/material/ButtonGroup'; 
import BgProfile from '../../images/bg-profile.png';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import BgSign from '../../images/sign-bg.png';


// import inboximg2 from '../../images/inboximg2.jpg';

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


export default function LoginPage({ children }) {
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
    
    <MainHeader />
 
    <div className='bodymain my-0 px-0'> 
      <div className='sign-main'>
      <img className='bgsigner' src={BgSign} />
      
      <div className='sm-container pt-5'>
      <h2>Login</h2>
      <Row> 
        <Col sm={4}>
            <div className='input-box'>
              <input type='email' placeholder='Email' />
            </div>
        </Col>
      </Row> 
      <Row>
        <Col sm={4}>
            <div className='input-box'>
              <input type='Password' placeholder='Password' />
            </div>
        </Col>  
        <Col> 
        </Col>
      </Row> 
      <Row>
        <Col sm={4}>
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" /> 
          </FormGroup>
        </Col> 
        <Col sm={4}>
          <a href=''>Forgot Password?</a>
        </Col> 
      </Row> 
      </div>

      <div className='sm-container my-4'>
      <Row> 
      <Col sm={4}>
        <div className='btnprofile left'> 
          <ButtonGroup variant="text" aria-label="text button group"> 
            <Button variant="contained btn btn-primary smallbtn">Login</Button>
            {/* <Button variant="contained btn btn-orang smallbtn"> Cancel</Button> */}
          </ButtonGroup> 
        </div>
        </Col> 
        </Row>
      </div>

      <div className='sm-container'>
        <Row> 
          <Col sm={4}>
          Not account At? <a href='/Register'>Register</a> here. 
          </Col> 
        </Row>
        </div>

      </div>
    </div>

     

    </>
    );
}