import React, { useState, useEffect } from 'react';
import Axios from "axios"
import { Col, Row } from 'react-bootstrap';

import Navigation from '../Navigation/Navigation'; 
import ListInbox from '../ListInbox/ListInbox'; 
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import AllInboxComposePage from '../AllInboxComposePage/AllInboxComposePage';
import { GetUserDetails, LoaderShow, LoaderHide } from "../../_helpers/Utility";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();


export default function NewInboxPage() {

  const [AllInBoxList, SetInBoxList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [StarSelected, SetStarSelected] = React.useState(false);
  const [InboxChecked, SetInboxChecked] = React.useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
  const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
  const [FromEmailDropdownListChecked, SetFromEmailDropdownListChecked] = React.useState([-1]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [TotalCount, SetTotalCount] = React.useState(0);
  const [ResponseData, SetResponseData] = useState([])
  const [HasMore, SetHasMore] = useState(true)
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [temopen, setTemOpen] = React.useState(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [ClientData, SetClientData] = useState()

  // Start Get AllInBoxList
  const GetInBoxList = async (CID, UID, PN, Str, IDs) => {

    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      IsInbox: false,
      IsStarred: false,
      IsFollowUp: false,
      IsSpam: false,
      IsOtherInbox: false,
      AccountIDs: IDs
    };
    const ResponseApi = await Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryAllInboxGet",
      method: "POST",
      data: Data,
    });
    // ResponseApi.then((Result) => {
    if (ResponseApi.data.StatusMessage == ResponseMessage.SUCCESS) {
      if (ResponseApi.data.PageData.length > 0) {
        SetResponseData(ResponseApi.data.PageData)
        SetHasMoreData(ResponseApi.data.PageData)
        // SetInBoxList([...AllInBoxList, ...ResponseApi.data.PageData]);
        if (Str == "checkbox") {
          SetInBoxList(ResponseApi.data.PageData);
        } else if (Str == "scroll") {
          SetInBoxList([...AllInBoxList, ...ResponseApi.data.PageData]);
        } else {
          SetInBoxList(ResponseApi.data.PageData);
        }
        OpenMessageDetails(ResponseApi.data.PageData[0]._id);
        SetMailNumber(1)
        LoaderHide()
      }
      else if (ResponseApi.data.PageData?.length === 0 && Str == "checkbox") {
        SetInBoxList([])
        OpenMessageDetails('')
        LoaderHide()
      }
      else {
        SetResponseData([])
        SetHasMoreData(ResponseApi.data.PageData)
        if (AllInBoxList && AllInBoxList?.length > 1) {
          SetInBoxList([...AllInBoxList]);
          let LastElement = AllInBoxList?.slice(-1)
          OpenMessageDetails(LastElement[0]?._id, 0);
        } else {
          OpenMessageDetails('');
          SetInBoxList([]);
        }
        LoaderHide()
        if (OpenMessage == "") {
          toast.error(<div>All Inbox <br />No Data.</div>)
        }
      }
      GetTotalRecordCount(CID, UID);
    }
    else {
      SetInBoxList([]);
      OpenMessageDetails('');
      toast.error(ResponseApi?.data?.Message);

    }

  };

  const SetHasMoreData = (arr) => {
    if (arr.length === 0) {
      SetHasMore(false)
    } else if (arr.length <= 9) {
      SetHasMore(false)
    } else if (arr.length === 10) {
      SetHasMore(true)
    }
  }

  
  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {
    LoaderShow();
    if (ID != '') {
      SetMailNumber(index + 1)
      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
            LoaderHide();
          } else {
            SetInBoxList([])
            SetOpenMessageDetails([]);
            LoaderHide();
          }
        }
        else {
          SetOpenMessageDetails([]);
          toast.error(Result?.data?.Message);
          LoaderHide();

        }
      });
    }
    else {
      SetOpenMessageDetails([]);
      LoaderHide();
    }
  };

    // Get Total Total Record Count
    const GetTotalRecordCount = (CID, UID) => {
      const Data = {
        ClientID: CID,
        UserID: UID,
        IsInbox: false,
        IsStarred: false,
        IsFollowUp: false,
        IsSpam: false,
        IsOtherInbox: true,
      }
      Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/AllInboxTotalRecordCount",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.TotalCount >= 0) {
            SetTotalCount(Result.data.TotalCount);
          } else {
            SetTotalCount(0);
            toast.error(Result?.data?.Message);
          }
  
        }
      })
    }
   
  // Login method start
  return (
    <>
      <div className='lefter'>
        {/* <Navigation /> */}
      </div>
      <div className='righter'> 
        <ListInbox />
      </div>
      <AllInboxComposePage GetInBoxList={GetInBoxList} /> 
  

    </>
  );
}