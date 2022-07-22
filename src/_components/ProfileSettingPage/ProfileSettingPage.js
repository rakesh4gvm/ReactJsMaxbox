import * as React from 'react'; 
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';

import InboxList from '../InboxListPage/InboxListPage'
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TextareaAutosize } from '@mui/material'; 
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser2 from '../../images/avatar/2.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import inboxuser4 from '../../images/avatar/4.jpg';
import inboximg1 from '../../images/inboximg1.jpg';
import inboximg2 from '../../images/inboximg2.jpg';

import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg'; 
import replyall from '../../images/icons/reply_all.svg';
import attachment from '../../images/icons/attachment.svg'; 
import text_font from '../../images/icons/text_font.svg'; 
import image_light from '../../images/icons/image_light.svg'; 
import smiley_icons from '../../images/icons/smiley_icons.svg'; 
import signature from '../../images/icons/signature.svg'; 
import link_line from '../../images/icons/link_line.svg'; 
import google_drive from '../../images/icons/google_drive.svg'; 
import Emailinbox from '../../images/email_inbox_img.png'; 
import Emailcall from '../../images/email_call_img.png'; 

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


export default function ProfileSettingPage({ children }) {
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
      <Row className='bodsetting'>
        <Col className='text-center py-5'>
          <h4>Profile Setting</h4>
        
          <div className='imgupload'> 
          </div>
        </Col> 
      </Row>  
     
      <Row className='text-center mt-5'>
        <Col>
          <div className='mt-4'>
              <h5>Yash Donald</h5>  
              <a>yashdonald@gmail.com</a>
            </div>
        </Col> 
      </Row> 
    </div>

    </>
    );
}