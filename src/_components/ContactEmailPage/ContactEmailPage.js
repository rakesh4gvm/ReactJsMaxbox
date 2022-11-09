import React, { useRef, useEffect } from 'react';
import Axios from "axios";

import { Col, Row } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FooterBottom from '../Footer/footer'; 
import InputLabel from '@mui/material/InputLabel'; 
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';
import { history } from "../../_helpers";
import Emailinbox from '../../images/email_inbox_img.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import EditIcon from '@material-ui/icons/Edit';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MaxboxLoading from '../../images/Maxbox-Loading.gif';
import { MenuItem } from '@mui/material';
 
import OutlinedInput from '@mui/material/OutlinedInput';   
import ListItemText from '@mui/material/ListItemText'; 
import Checkbox from '@mui/material/Checkbox';


toast.configure();
 
function createData(email) {
  return { email };
}
  
const rows = [
  createData('shubham55gvm@gmail.com'),
  createData('bham55gvm@gmail.com'),
  createData('sbham55gvm@gmail.com'),
  createData('shham55gvm@gmail.com'),
  createData('ham55gvm@gmail.com'), 
];

 


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'ham55gvm@gmail.com',
  'hqwqam55gvm@gmail.com',
  'haasdm55gvm@gmail.com',
  'ham55gvm@gmail.com',
  'hamasq55gvm@gmail.com',
  'hamasd55gvm@gmail.com',
  'ham55gvm@gmail.com',
  'haqwqwm55gvm@gmail.com',
  'haqwqqwdsasdm55gvm@gmail.com',
];
 

export default function ContactEmailPage() {  
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
    <>
 

      <div className='bodymain min-100vh'>
        <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
          <Col className='py-4'>
            <h5 className='my-0'>Email Contacts</h5>
          </Col>
        </Row> 


        <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col sm={6}>     
              <FormControl className='dropemailbox'> 
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={personName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

               
                {/* <FormControl className='dropemailbox'>
                  <Select
                    value={age}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">
                      Select Contacts Email
                    </MenuItem>
                    <MenuItem value={10}>shubham55gvm@gmail.com</MenuItem>
                    <MenuItem value={20}>shubhamhsd55gvm@gmail.com</MenuItem>
                    <MenuItem value={30}>shubham55asdgvm@gmail.com</MenuItem>
                    <MenuItem value={30}>shubham55asdgvm@gmail.com</MenuItem>
                    <MenuItem value={30}>shubham55asdgvm@gmail.com</MenuItem>
                    <MenuItem value={30}>shubham55asdgvm@gmail.com</MenuItem>
                    <MenuItem value={30}>shubham55asdgvm@gmail.com</MenuItem>
                  </Select>
                </FormControl>  */} 
            </Col>
            <Col sm={6} align="right">
              <Button className='btnaccount'>
                <AddIcon /> Add Contact
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
             
            <TableContainer className='tablename' component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell> 
                    <TableCell align="right">Action</TableCell> 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell align="right">
                          <Button className='iconbtntable'>
                            <img src={DeleteIcon} />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
 
            </Col>
          </Row>
        </div>


      </div>

      <FooterBottom />
    </>
  );
}