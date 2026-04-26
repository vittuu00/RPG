const TILE_SIZE = 48;
const GRID_SIZE = 10;

const grass =
  "https://opengameart.org/sites/default/files/grass_0.png";

const playerSprite =
  "https://cdn-icons-png.flaticon.com/512/194/194938.png";

function Map({ players, npcs }) {
  return (
    <div>
      {Array.from({ length: GRID_SIZE }).map((_, y) => (
        <div key={y} style={{ display: "flex" }}>
          {Array.from({ length: GRID_SIZE }).map((_, x) => {
            const playerHere = Object.values(players).find(
              (p) => p.x === x && p.y === y
            );
            const npcHere = Object.values(npcs || {}).find(
              (n) => n.x === x && n.y === y
            );

            return (
              <div
                key={x}
                style={{
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  position: "relative"
                }}
              >
                {/* CHÃO */}
                <img
                  src={grass}
                  alt="tile"
                  style={{
                    width: "100%",
                    height: "100%",
                    imageRendering: "pixelated"
                  }}
                />

                {/* PLAYER */}
                {playerHere && (
                  <img
                    src={playerSprite}
                    alt="player"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      imageRendering: "pixelated"
                    }}
                  />
                )}
                {/* NPC */}
                {npcHere && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="npc"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      imageRendering: "pixelated"
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Map;