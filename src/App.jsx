import { useState } from "react";
import Field from "./Field";
import Title from "./Title";
import Item from "./Item";
import Hoverbox from "./HoverBox";
import ItemBox from "./ItemBox";
import About from "./About";
import Switch from "@mui/material/Switch";

import grassBg from "/grass_bg.jpg";
import itemsData from "./data/items.json";

import "./App.css";

function App() {
  const MAX_BLADES_PER_ROW = 50;
  const MAX_BLADES_PER_COLUMN = 40;

  const [hoverData, setHoverData] = useState(null);
  const [grassMotion, setGrassMotion] = useState(true);
  const [whoHovered, setWhoHovered] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const showMobileView = window.innerWidth <= 600;

  var blades_per_row = Math.floor(
    Math.min(MAX_BLADES_PER_ROW, window.innerWidth / 25)
  );
  var blades_per_column = Math.floor(
    Math.min(MAX_BLADES_PER_COLUMN, window.innerHeight / 14)
  );

  function getZIndex(x, y) {
    var height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      2000
    );

    const xIndex = (x / window.innerWidth) * blades_per_row;
    const yIndex = (y / height) * blades_per_column;

    const j = Math.floor(xIndex);
    const i = Math.floor(yIndex);

    // Use the same indexing logic as when creating
    const zIndex = i * blades_per_row + j;

    return zIndex;
  }

  function getTag(tag) {
    switch (tag) {
      case "desktop":
        return "DESKTOP ONLY";
      case "dev":
        return "IN DEVELOPMENT";
    }
  }

  return (
    <div className="content">
      <img id="bg" src={grassBg} />
      <Field
        blades_per_row={blades_per_row}
        blades_per_column={blades_per_column}
        grassMotion={grassMotion}
        showAbout={showAbout}
        showMobileView={showMobileView}
      />

      {!showMobileView && (
        <div className="items-container">
          {itemsData.items.map((item, i) => {
            return (
              <Item
                item={item}
                index={i}
                getZIndex={getZIndex}
                key={"item-" + i}
                setHoverData={setHoverData}
              />
            );
          })}
        </div>
      )}

      <div className="text-container">
        <Title />

        <div className="text grass-off">
          grass is {grassMotion ? "on" : "off"}{" "}
          <Switch
            checked={grassMotion}
            onChange={() => {
              setGrassMotion(!grassMotion);
            }}
          />
        </div>

        {showMobileView && (
          <div className="itembox-container">
            {itemsData.items.map((item, i) => {
              return (
                <ItemBox
                  item={item}
                  getZIndex={getZIndex}
                  key={"item-" + i}
                  getTag={getTag}
                />
              );
            })}
          </div>
        )}

        {!showMobileView && (
          <div
            className={"text who " + (whoHovered ? "text-highlight" : "")}
            onMouseOver={() => {
              setWhoHovered(true);
            }}
            onMouseOut={() => {
              setWhoHovered(false);
            }}
            onClick={() => {
              setShowAbout(!showAbout);
            }}
          >
            {showAbout ? "ok cool" : "who?"}
          </div>
        )}
        {showMobileView && <About />}
      </div>
      {showAbout && <About />}

      <Hoverbox data={hoverData} getTag={getTag} />
    </div>
  );
}

export default App;
