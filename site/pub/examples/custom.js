import { karenMain } from "/pub/examples/karen_main.js";

// make kaboom functions global
kaboom.global();

// init kaboom context
init({
  fullscreen: true,
  scale: 1,
});

// define a scene
scene("start", () => {
  add([
    text(
      "oh hi karen! \n I heard \n it's your \n birthday. \n Let's play \n a game!",
      32,
      {
        width: 400,
      }
    ),
    pos(50, 50),
  ]);

  addButton("START", vec2(320, 350), () => {
    go("main");
  });
});

// start the game
start("start");

karenMain();

function addButton(txt, p, f) {
  const bg = add([pos(p), rect(120, 60), origin("center"), color(1, 1, 1)]);

  add([text(txt), pos(p), rect(100, 100), origin("center"), color(0, 0, 0)]);

  bg.action(() => {
    if (bg.isHovered()) {
      bg.color = rgb(0.8, 0.8, 0.8);
      if (mouseIsClicked()) {
        f();
      }
    } else {
      bg.color = rgb(1, 1, 1);
    }
  });
}
