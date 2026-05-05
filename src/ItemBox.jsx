import { useState, useEffect, useRef } from "react";
export default function ItemBox(props) {
  const { item, getZIndex, getTag } = props;

  const divRef = useRef(null);
  const [boxStyle, setBoxStyle] = useState({ zIndex: 3000 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setZIndex();
  }, []);

  const setZIndex = () => {
    setBoxStyle({
      zIndex: getZIndex(
        divRef.current ? divRef.current.getBoundingClientRect().left : 0,
        divRef.current
          ? divRef.current.getBoundingClientRect().top +
              window.pageYOffset +
              divRef.current.getBoundingClientRect().height +
              30
          : 0
      ),
    });
  };

  return (
    <div
      ref={divRef}
      className="itembox"
      onClick={() => {
        window.open(item.url, "_blank").focus();
      }}
      style={boxStyle}
    >
      <div className="hoverbox-title">{item.title}</div>
      <div className="itembox-desc">{item.desc}</div>
      <div className="tag-container">
        {item.tags &&
          item.tags.map((tag, i) => {
            return (
              <div className={"hoverbox-tag tag-" + tag} key={"tag-" + i}>
                {getTag(tag)}
              </div>
            );
          })}
      </div>
      <div className="hoverbox-gif-div">
        <img
          className="hoverbox-gif"
          src={window.location.origin + item.gif}
          onLoad={setZIndex}
        />
      </div>
    </div>
  );
}
