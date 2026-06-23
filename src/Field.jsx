import { useEffect, useRef } from "react";

export default function Field(props) {
  const {
    blades_per_row,
    blades_per_column,
    grassMotion,
    showAbout,
    showMobileView,
    blogMode,
    onBlogIndex,
  } = props;
  const fieldRef = useRef(null);
  const bladesRef = useRef([]);
  const grassMotionRef = useRef(true);
  var allImagesLoadedRef = useRef(false);

  const numBetween = (num, lower, higher) => num > lower && num < higher;

  const PUSH_RADIUS = 150;
  const VARIANCE = 60;

  const hideBlogAreaGrass = () => {
    if (!blogMode) return;

    var blogWidth = 0;
    if (showMobileView){
      blogWidth = onBlogIndex ? 0 : window.innerWidth * 0.8;
    }
    else{
      if (window.innerWidth > 1400){
        blogWidth = window.innerWidth * 0.45;
      }
      else{
        blogWidth = window.innerWidth * 0.6;
      }
    }
    const blogLeft = (window.innerWidth - blogWidth) / 2;
    const blogRight = blogLeft + blogWidth;

    bladesRef.current.forEach((b) => {
      if (b.x >= blogLeft && b.x <= blogRight) {
        b.el.classList.add("hide");
      }
    });
  };

  const makeField = () => {
    const field = fieldRef.current;
    bladesRef.current = [];

    // Clear
    field.innerHTML = "";
    var height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      2000
    );
    console.log(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    for (let i = 0; i < blades_per_column; i++) {
      for (let j = 0; j < blades_per_row; j++) {
        const blade = document.createElement("div");
        blade.className = "blade";
        blade.id = "blade-" + i + "-" + j;

        var x = (j / blades_per_row) * window.innerWidth;
        var y = (i / blades_per_column) * height;
        x += Math.random() * VARIANCE - VARIANCE / 2;
        y += Math.random() * VARIANCE - VARIANCE / 2;

        blade.style.left = x + "px";
        blade.style.top = y + "px";
        blade.style.zIndex = i * blades_per_row + j;
        if (showMobileView && !allImagesLoadedRef.current) {
          blade.style.zIndex = 0;
        }

        if (numBetween(j, 10 - i / 2, 30 - i / 2) && numBetween(i, 0, 50)) {
          if (Math.random() * 10 < 8) {
            blade.className += " style-1";
          }
        }

        if (numBetween(j, 50 - i / 3, 60) && numBetween(i, 0, 50)) {
          if (Math.random() * 10 < 9) {
            blade.className += " style-2";
          }
        }

        const bladeObj = {
          el: blade,
          x,
          y,
          isPushed: false,
          idleSpeed: 0.0008 + Math.random() * 0.0012,
          idlePhase: Math.random() * Math.PI * 2,
        };

        bladesRef.current.push(bladeObj);
        field.appendChild(blade);
      }
    }

    if (blogMode) {
      requestAnimationFrame(hideBlogAreaGrass);
    }
  };

  function handleMouseMove(e) {
    if (!grassMotion) {
      return;
    }
    const mx = e.clientX;
    const my = e.clientY;

    bladesRef.current.forEach((b) => {
      const dx = mx - b.x;
      const dy = my - b.y - 45; // bottom of blade
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PUSH_RADIUS) {
        var direction = dx > 0 ? 1 : 0;

        const angle = Math.atan2(dy, dx);
        const force = (PUSH_RADIUS - dist) / PUSH_RADIUS;
        const rot = (angle - (direction * Math.PI) / 2) * force * 0.4;
        b.isPushed = true;

        b.el.style.setProperty("--rot", `${rot}rad`);
      } else {
        b.isPushed = false;
      }
    });
  }
  let frame = 0;
  function animate(t) {
    if (!grassMotionRef.current) {
      return;
    }
    const blades = bladesRef.current;

    const numBatches = 500;

    for (let i = 0; i < numBatches; i++) {
      for (var j = 0; j < blades.length; j++) {
        if (j % numBatches != i) {
          continue;
        }
        const b = blades[j];
        if (b.isPushed) continue;

        const idle = Math.sin(t * b.idleSpeed + b.idlePhase) * 0.12;
        b.el.style.setProperty("--rot", `${idle}rad`);
      }
    }

    frame = (frame + 1) % Math.ceil(numBatches);

    requestAnimationFrame(animate);
  }

  if (showMobileView) {
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
        )
    ).then(() => {
      allImagesLoadedRef.current = true;
      makeField();
    });
  }

  useEffect(() => {
    makeField();
    // Mouse interaction

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", makeField);

    // Idle ripple (batched)

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!grassMotion) {
      grassMotionRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
    } else {
      grassMotionRef.current = requestAnimationFrame(animate);
    }
  }, [grassMotion]);

  useEffect(() => {
    if (blogMode) return;

    for (let i = 0; i < blades_per_column; i++) {
      for (let j = 0; j < blades_per_row; j++) {
        const blade = document.getElementById("blade-" + i + "-" + j);
        if (!blade) {
          continue;
        }
        if (
          i < blades_per_column * 0.42 &&
          i > 1 &&
          j > (5.3 * blades_per_row) / 8
        )
          if (showAbout) {
            blade.classList.add("hide");
          } else {
            if (blade.classList.contains("hide")) {
              blade.classList.remove("hide");
              blade.classList.add("grass-grow");
            }
          }
      }
    }
  }, [showAbout, blogMode]);

  return <div className="grass-field" ref={fieldRef}></div>;
}
