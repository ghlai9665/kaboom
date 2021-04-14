export const karenMain = () => {
  scene("main", () => {
    const score = add([
      pos(12, 12),
      text(0),
      // all objects defaults origin to center, we want score text to be top left
      // plain objects becomes fields of score
      {
        value: 0,
      },
    ]);

    const p1 = add([pos(0, 0), rect(24, 24), solid()]);

    const spawnEnemy = () => {
      add([pos(100, 100), rect(36, 36), solid(), "enemy"]);
    };

    loop(1, () => {
      spawnEnemy();
    });

    const SPEED = 240;
    let direction = "up";

    keyDown("up", () => {
      p1.move(0, -SPEED);
      direction = "up";
    });

    keyDown("down", () => {
      p1.move(0, SPEED);
      direction = "down";
    });

    keyDown("left", () => {
      p1.move(-SPEED, 0);
      direction = "left";
    });

    keyDown("right", () => {
      p1.move(SPEED, 0);
      direction = "right";
    });

    keyPress("space", () => {
      spawnBullet(p1.pos.sub(4, 0), direction);
      spawnBullet(p1.pos.add(4, 0), direction);
    });

    let BULLET_SPEED = 100;

    // run this callback every frame for all objects with tag "bullet"
    action("bulletUp", (b) => {
      b.move(0, -BULLET_SPEED);
      // remove the bullet if it's out of the scene for performance
      if (b.pos.y < 0) {
        destroy(b);
      }
    });

    action("bulletDown", (b) => {
      b.move(0, BULLET_SPEED);
    });

    action("bulletLeft", (b) => {
      b.move(-BULLET_SPEED, 0);
    });

    action("bulletRight", (b) => {
      b.move(BULLET_SPEED, 0);
    });

    collides(
      ["bulletUp", "bulletDown", "bulletLeft", "bulletRight"],
      "enemy",
      (b, e) => {
        destroy(b);
        destroy(e);
        score.value += 1;
        score.text = score.value;
      }
    );

    keyPress("f1", () => {
      kaboom.debug.showArea = !kaboom.debug.showArea;
      kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
    });
  });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function spawnBullet(p, direction) {
  const capitalizedDirection = capitalizeFirstLetter(direction);
  add([
    rect(2, 6),
    pos(p),
    origin("center"),
    color(0.5, 0.5, 1),
    `bullet${capitalizedDirection}`,
  ]);
}
