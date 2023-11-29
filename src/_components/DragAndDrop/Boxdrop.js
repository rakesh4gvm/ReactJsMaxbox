// Box.js
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Axios from "axios";
import { ItemTypes } from "./ItemTypes.js";
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { LoaderHide, LoaderShow } from "../../_helpers/Utility";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  float: "left"
};

export const Boxdrop = ({ name, accountid, messageid, subject }) => {
  const dispatch = useDispatch();
  const [, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { name },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        if (item && dropResult) {
          var AccountId = monitor.getItem()?.name?.props?.accountid ? monitor.getItem().name.props.accountid : "";
          var MessageId = monitor.getItem()?.name?.props?.messageid ? monitor.getItem().name.props.messageid : "";
          var MoveIn = dropResult.name;
          var islabel = dropResult.isLabel;
          var isOtherInbox = dropResult.isOtherInbox;
          var isFollowUpLater = dropResult.isFollowUpLater;
          var isSpam = dropResult.isSpam;
          
          // if (islabel) {
            var Data = {
              AccountID: AccountId,
              MessageID: MessageId,
              Islabel: islabel,
              MoveInLabel: MoveIn,
              IsOtherInbox: isOtherInbox,
              IsFollowUpLater: isFollowUpLater,
              IsSpam: isSpam
            };
            const ResponseApi = Axios({
              url: CommonConstants.MOL_APIURL + "/receive_email_history/DragAndDropMail",
              method: "POST",
              data: Data,
            });
            ResponseApi.then((Result) => {
              if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
                dispatch({ type: "refreshPageDetails", payload: true });
                toast.success(Result?.data?.Message);
              }
            });
          // }
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [name, accountid, messageid, subject]
  );

  const previewRef = useRef();

  // Set the preview ref for the drag preview
  preview(previewRef);

  return (
    <tr ref={drag} colSpan={6} style={{ ...style, opacity: 1, position: "relative", }} accountid={accountid} messageid={messageid}>
      {name}
      <tr
        ref={previewRef}
        style={{
          ...style,
          opacity: 1, // Set opacity to 1 for both the original and the cloned box
          position: "absolute",
          zIndex: 1000,
          background: "red",
          top: 1,
        }}
      >
        {subject}  ...
      </tr>

    </tr>
  );
};
