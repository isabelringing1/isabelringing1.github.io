import { useRef, useEffect, useState } from "react";

export default function Hoverbox(props) {
  const { data, getTag } = props;

  const [boxTop, setBoxTop] = useState(0);
  const [ready, setReady] = useState(false);
  const divRef = useRef(null);

  useEffect(() => {
    if (!data) {
      return;
    }
    var t = data.y;
    if (data.flipped && divRef.current) {
      var height = divRef.current.getBoundingClientRect().height;

      t -= height;
    }
    setReady(true);
    setBoxTop(t);
  }, [data]);

  return (
    ready && (
      <div
        className="hoverbox"
        ref={divRef}
        style={{ opacity: data ? 1 : 0, left: data ? data.x : 0, top: boxTop }}
      >
        {data && (
          <div>
            <div className="hoverbox-title">{data.item.title}</div>
            <div className="hoverbox-gif-div">
              <img
                className="hoverbox-gif"
                src={window.location.origin + data.item.gif}
              />
            </div>
            <div className="hoverbox-desc">{data.item.desc}</div>
            <div className="tag-container">
              {data.item.tags &&
                data.item.tags.map((tag, i) => {
                  return (
                    <div className={"hoverbox-tag tag-" + tag} key={"tag-" + i}>
                      {getTag(tag)}
                    </div>
                  );
                })}
            </div>
            <div
              className={"hoverbox-tail " + (data.flipped ? " flipped" : "")}
            ></div>
          </div>
        )}
      </div>
    )
  );
}
