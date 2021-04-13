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

    const p2 = add([pos(100, 100), rect(24, 24), solid(), "enemy"]);

    const SPEED = 240;

    keyDown("w", () => {
      p1.move(0, -SPEED);
    });

    keyDown("s", () => {
      p1.move(0, SPEED);
    });

    keyDown("a", () => {
      p1.move(-SPEED, 0);
    });

    keyDown("d", () => {
      p1.move(SPEED, 0);
    });

    keyDown("up", () => {
      p1.move(0, -SPEED);
    });

    keyDown("down", () => {
      p1.move(0, SPEED);
    });

    keyDown("left", () => {
      p1.move(-SPEED, 0);
    });

    keyDown("right", () => {
      p1.move(SPEED, 0);
    });

    keyPress(["space", "up"], () => {
      spawnBullet(p1.pos.sub(4, 0));
      spawnBullet(p1.pos.add(4, 0));
    });

    let BULLET_SPEED = 50;
    // run this callback every frame for all objects with tag "bullet"
    action("bullet", (b) => {
      b.move(0, -BULLET_SPEED);
      // remove the bullet if it's out of the scene for performance
      if (b.pos.y < 0) {
        destroy(b);
      }
    });

    collides("bullet", "enemy", (b, e) => {
      destroy(b);
      destroy(e);
      score.value += 1;
      score.text = score.value;
    });

    p1.action(() => {
      p1.resolve();
    });

    p2.action(() => {
      p2.resolve();
    });

    keyPress("f1", () => {
      kaboom.debug.showArea = !kaboom.debug.showArea;
      kaboom.debug.hoverInfo = !kaboom.debug.hoverInfo;
    });
  });
};

function spawnBullet(p) {
  add([
    rect(2, 6),
    pos(p),
    origin("center"),
    color(0.5, 0.5, 1),
    // strings here means a tag
    "bullet",
  ]);
}
