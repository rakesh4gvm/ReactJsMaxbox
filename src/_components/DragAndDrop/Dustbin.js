import React, { useState } from 'react';
import { useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes.js'

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
}

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return 'darkgreen'
  } else if (canDrop) {
    return 'darkkhaki'
  } else {
    return '#222'
  }
}
export const Dustbin = ({ allowedDropEffect, accountId, isLabel, labelId, isOtherInbox, isFollowUpLater, isSpam }) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop: () => ({
        name: allowedDropEffect,
        isLabel: isLabel == "true" ? true : false,
        isOtherInbox: isOtherInbox == "true" ? true : false,
        isFollowUpLater: isFollowUpLater == "true" ? true : false,
        isSpam: isSpam == "true" ? true : false,
        allowedDropEffect,
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      }),
    }),
    [allowedDropEffect, accountId, isLabel, labelId],
  )
  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)

  const handleDrop = (item) => {
    // Handle the drop event here, you can access the dropped item's data (item.id, item.text)
    // console.log(`Dropped: ${item.text}`);
  };

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} accountId={accountId} isLabel={isLabel} labelId={labelId} onDrop={handleDrop}>
      {/* {`Works with ${allowedDropEffect} drop effect`} */}
      {`${allowedDropEffect}`}
      <br />
      <br />
      {/* {isActive ? 'Release to drop' : 'Drag a box here'} */}
    </div>
  )
}
