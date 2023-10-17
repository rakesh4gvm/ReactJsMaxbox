// Box.js
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem", 
  float: "left"
};

export const Boxdrop = ({ name }) => {
  const [, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [name]
  );

  const previewRef = useRef();

  // Set the preview ref for the drag preview
  preview(previewRef);

  return (  
      <tr ref={drag} colSpan={6} style={{ ...style, opacity: 1, position: "relative",}}>
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
        Moving  ...
      </tr>

      </tr> 
  );
};
