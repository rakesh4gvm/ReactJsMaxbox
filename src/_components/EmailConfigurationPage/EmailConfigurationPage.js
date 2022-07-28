import * as React from 'react'; 
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header'; 
import FooterBottom from '../Footer/footer'; 

 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'; 
import ButtonGroup from '@mui/material/ButtonGroup';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '../../images/icons/icon_wh_delete.svg';
import LoaderCircle from '../../images/icons/icon_loader_circle.svg';
import BgProfile from '../../images/bg-profile.png';


 
function createData(Email, FirstName, LastName) {
  return { Email, FirstName, LastName };
}

const rows = [
  createData('fannydonald@gmail.com', 'Fanny', 'Donald'), 
  createData('jameswalt@gmail.com', 'James', 'Walt'), 
  createData('kristinadisoza@gmail.com', 'Kristina', 'Disoza'), 
  createData('sannyhetlin@gmail.com', 'Sanny', 'Hetlin'), 
  createData('heematrust@gmail.com', 'Heema', 'Trust'), 
  createData('johnydancer@gmail.com', 'Johny', 'Dancer'), 
  createData('diyawashington@gmail.com', 'Diya', 'Washington'), 
  createData('leenajosheph@gmail.com', 'Leena', 'Josheph'),  
];


export default function EmailConfigurationPage({ children }) {
     

return (
    <>
    <HeaderTop />  
 
    <div className='bodymain'> 
      <Row className='bodsetting'><div className='imgbgset'><img src={BgProfile} /></div>
        <Col className='py-4'>
          <h5 className='my-0'>Email Configuration</h5> 
        </Col> 
      </Row>  
      
      

      <div className='sm-container mt-5'>
          <Row className='mb-5'>
            <Col align="right">
                <Button className='btnaccount'>
                  <AddIcon /> Add Account
                </Button> 
            </Col>
          </Row>
          <Row>
            <Col>
                <TableContainer className='tablename' component={Paper}>
                  <Table sx={{ minWidth: 750 }} aria-label="caption table"> 
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">First Name</TableCell>
                        <TableCell align="right">Last Name</TableCell>
                        <TableCell align="right">Working</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell scope="row">
                            {row.Email}
                          </TableCell>
                          <TableCell align="right">{row.FirstName}</TableCell>
                          <TableCell align="right">{row.LastName}</TableCell>
                          <TableCell align="right">
                            <ButtonGroup className='table-btn' variant="text" aria-label="text button group"> 
                              <Button className='btn-success'>
                               Yes
                              </Button>
                              {/* <Button className='btn-cancel'>
                                No
                              </Button> */}
                            </ButtonGroup>
                          </TableCell>
                          <TableCell align="right">
                            <Button className='btnauthenticate'>
                              <img src={LoaderCircle} className="mr-1" /> Re Authenticate
                            </Button> 
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

                <Stack className='my-4 page-dec' spacing={2}> 
                  <Pagination count={3} variant="outlined" shape="rounded" />
                </Stack>
            </Col>
          </Row>
      </div>

    </div>

    <FooterBottom />  

    </>
    );
}