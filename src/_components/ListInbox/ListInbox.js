

import * as React from 'react';
import { makeStyles, styled, useTheme, alpha  } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar'; 

import InputBase from '@mui/material/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
 
import SplitPane from "react-split-pane";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconleftright from '../../images/icon_left_right.svg';
import iconmenu from '../../images/icon_menu.svg';
import iconstar from '../../images/icon_star.svg'; 
import ReplyIcon from '@material-ui/icons/Reply';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
 

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
})); 


function createData(name, correspondents, date) {
  return { name, correspondents, date };
}

const rows = [
  createData('Frozen yoghurt', 'Charles Byrd', '11:12 AM'),
  createData('Lorem Ipsum is simply dummy text of the printing', '3DLook Team', '9:59 AM'),
  createData('containing Lorem Ipsum passages', '3DLook Team', '9:59 AM'),
  createData(' looked up one of the more obscure Latin words', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" by Cicero are also reproduced', '3DLook Team', '9:59 AM'), 
  createData(' looked up one of the more obscure Latin words', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero', '3DLook Team', '9:59 AM'),
  createData('Finibus Bonorum et Malorum" by Cicero are also reproduced', '3DLook Team', '9:59 AM'), 
  createData('Frozen yoghurt', 'Charles Byrd', '11:12 AM'),
  createData('Lorem Ipsum is simply dummy text of the printing', '3DLook Team', '9:59 AM'),
  createData('containing Lorem Ipsum passages', '3DLook Team', '9:59 AM'),
];


export default function ListInbox() { 
  
  return ( 
      <> 
        <header className='minisearchhed'> 
          <Row> 
            <Col sm={8}>
              <Search className='serchinbox'>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…" 
                />
              </Search>
            </Col>

            <Col sm={4}> 
              <div className="dropdatebox">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={0}>
                    <DesktopDatePicker
                      inputFormat="MM/dd/yyyy"  
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </Col> 
          </Row>
        </header>


        <div className='bodyview'>
          <SplitPane
            split="horizontal "
            minSize={150}
            maxSize={-200}
            defaultSize={"40%"}
          >
            <div className="simulationDiv">
              <Table className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell component="th" width={'30px'}><StarBorderIcon /></TableCell>
                    <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell>
                    <TableCell component="th">Subject</TableCell>
                    <TableCell component="th">Correspondents</TableCell> 
                    <TableCell component="th">Date</TableCell> 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell width={'35px'}><StarBorderIcon /></TableCell>
                      <TableCell width={'35px'}></TableCell>
                      <TableCell scope="row"> {row.name} </TableCell>
                      <TableCell>{row.correspondents}</TableCell>
                      <TableCell>{row.date}</TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>




            </div>
            <div className="statisticsDiv">
                  <div className='composehead px-3'>
                    <Row>
                      <Col sm={6}>
                          <div className='lablebox'>
                            <label><b>From</b> Brendan Burnett brendansaleshive.com  </label>
                            <label><b>To</b> Chase Demelio chasesaleshive.com </label>
                            <label><b>Subject</b> This is my Subject line</label>
                          </div>
                      </Col>
                      <Col sm={6}>
                          <div className='lablebox text-right'>
                            <lable> 11/13/22 - 11:15 AM </lable> 
                          </div>

                          <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group"> 
                              <Button>
                                <label>2 / 15</label>
                              </Button>
                              <Button>
                                <a><img src={iconstar} title={"Starred"} /></a>
                              </Button>
                              <Button>
                                <a><img src={iconsarrow2} /></a>
                              </Button>
                              <Button>
                                <a><img src={iconsarrow1} /></a>
                              </Button>
                              {<Button>
                                <a><img src={icondelete} /></a>
                              </Button>}
                              <Button>
                                <a><img src={iconmenu} /></a>
                              </Button>
                            </ButtonGroup>

                      </Col>
                    </Row>
                  </div>
              
                  <div className='emailbodybox'>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                  </div>


            </div>
          </SplitPane>


        </div>
         
      </> 
  );
}













