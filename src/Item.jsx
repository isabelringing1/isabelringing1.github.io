import { useState, useEffect, useRef } from "react";

function Item(props) {
  const { item, index, getZIndex, setHoverData } = props;
  const [posTop, setPosTop] = useState(-300);
  const [posLeft, setPosLeft] = useState(-300);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [itemStyle, setItemStyle] = useState({});

  const dragTop = useRef(null);
  const dragLeft = useRef(null);
  const dragTimestamp = useRef(0);
  const divRef = useRef(null);

  useEffect(() => {
    setPosLeft(Math.random() * (window.innerWidth - 500) + 250);
    setPosTop(Math.random() * (window.innerHeight - 500) + 250);
  }, []);

  useEffect(() => {
    setItemStyle({
      top: posTop + "px",
      left: posLeft + "px",
      zIndex: getZIndex(posLeft + 20, posTop + 50),
    });
  }, [posLeft, posTop]);

  const startDrag = (e) => {
    if (e.targetTouches != null) {
      dragLeft.current = e.targetTouches[0].screenX;
      dragTop.current = e.targetTouches[0].screenY;
    } else {
      dragTop.current = e.clientY;
      dragLeft.current = e.clientX;
    }

    document.onmouseup = closeDragElement;
    document.onmousemove = itemDragged;
    setHoverData(null);
    setSelected(true);
    dragTimestamp.current = Date.now();
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    setSelected(false);
  };

  const itemDragged = (e) => {
    //e.preventDefault();
    // calculate the new cursor position:
    var leftDelta;
    var topDelta;
    if (e.targetTouches != null) {
      leftDelta = dragLeft.current - e.targetTouches[0].screenX;
      topDelta = dragTop.current - e.targetTouches[0].screenY;
    } else {
      leftDelta = dragLeft.current - e.clientX;
      topDelta = dragTop.current - e.clientY;
    }

    console.log(e);

    // set the element's new position:
    setPosTop(posTop - topDelta);
    setPosLeft(posLeft - leftDelta);
  };

  const startHover = () => {
    if (selected) {
      return;
    }
    setHover();
  };

  const setHover = () => {
    setHovered(true);
    var yPos = posTop + 100;
    var flipped = false;
    if (posTop > window.innerHeight / 2) {
      yPos = posTop - 100;
      flipped = true;
    }
    setHoverData({
      item: item,
      x: posLeft,
      y: yPos,
      flipped: flipped,
    });
  };

  const endHover = () => {
    setHoverData(null);
    setHovered(false);
  };

  const onClick = () => {
    if (Date.now() - dragTimestamp.current > 150) {
      //ms
      return;
    }
    window.open(item.url, "_blank").focus();
  };

  return (
    <div
      className={
        "item " + (selected ? "selected " : "") + (hovered ? "hovered" : "")
      }
      id={"item-" + item.id}
      ref={divRef}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onTouchMove={itemDragged}
      onTouchEnd={closeDragElement}
      onMouseOver={startHover}
      onMouseOut={endHover}
      onClick={onClick}
      style={itemStyle}
    >
      <img className="item-img" src={window.location.origin + item.path} />
    </div>
  );
}

export default Item;
