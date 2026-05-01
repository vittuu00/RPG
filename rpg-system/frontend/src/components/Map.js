import { useState } from "react";

const MAP = Array.from({ length: 50 }).map((_, y) =>
  Array.from({ length: 50 }).map((_, x) => {
    if (x === 5) return 1; // estrada vertical
    return 0; // grama
  })
);

const TILE_SIZE = 48;
const GRID_SIZE = 10;

const grass = "https://opengameart.org/sites/default/files/grass_0.png";
const dirt = "https://opengameart.org/sites/default/files/dirt.png";

const playerSprite =
  "https://cdn-icons-png.flaticon.com/512/194/194938.png";

function Map({players, npcs, visibleTiles, onTileClick, isMaster}) {
  const playersArray = Object.values(players);
  const me = Object.values(players)[0];

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState(null);

  const TILE_TYPES = {
    0: grass,
    1: dirt
  };

  function getTileImg(tile) {
    return TILE_TYPES[tile] || grass;
  }
  function getTile(mapX, mapY) {
    return MAP[mapY]?.[mapX];
  }

  const GRID_SIZE = 10; // já existe no teu código

  // 👇 define o quanto o mapa vai "andar"
  const offsetX = me ? me.x - Math.floor(GRID_SIZE / 2) : 0;
  const offsetY = me ? me.y - Math.floor(GRID_SIZE / 2) : 0;

  
  const handleWheel = (e) => {
    const newZoom = Math.max(0.5, Math.min(2, zoom - e.deltaY * 0.001));
    setZoom(newZoom);
  };

  const onMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));

    setStart({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => setDragging(false);

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: "0 0"
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, y) => {
          const mapY = y + offsetY;          
          return (
            <div key={y} style={{ display: "flex" }}>
              {Array.from({ length: GRID_SIZE }).map((_, x) => {
                const mapX = x + offsetX;
                const tile = getTile(mapX, mapY);
                const tileImg = getTileImg(tile);

                const isVisible = isMaster
                  ? true
                  : visibleTiles[`${mapX},${mapY}`];

                const playerHere = playersArray.find((p) => {
                  const px = p.position?.x ?? p.x;
                  const py = p.position?.y ?? p.y;
                  return px === mapX && py === mapY;
                });

                const npcHere = Object.values(npcs || {}).find(
                  (n) => n.x === mapX && n.y === mapY
                );

                return (
                  <div
                    key={x}
                    onClick={() => onTileClick(mapX, mapY)}
                    style={{
                      width: TILE_SIZE,
                      height: TILE_SIZE,
                      position: "relative",
                      cursor: "pointer",
                      background: isVisible ? "transparent" : "#000"
                    }}
                    
                  >
                    {!isVisible ? null : (
                      <>
                        <img
                          src={tileImg}
                          alt="tile"
                          style={{
                            width: "100%",
                            height: "100%",
                            imageRendering: "pixelated"
                          }}
                        />

                        {playerHere && (
                          <img
                            src={playerSprite}
                            alt="player"
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0
                            }}
                          />
                        )}

                        {npcHere && (
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                            alt="npc"
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Map;