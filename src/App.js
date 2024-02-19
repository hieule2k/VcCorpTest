import { useEffect, useState } from "react";

const data = [
  { id: 1, name: "Slide 1" },
  { id: 2, name: "Slide 2" },
  { id: 3, name: "Slide 3" },
  { id: 4, name: "Slide 4" },
  { id: 5, name: "Slide 5" },
  { id: 6, name: "Slide 6" },
  { id: 7, name: "Slide 7" },
  { id: 8, name: "Slide 8" },
  { id: 9, name: "Slide 9" },
];

const next = "block ";
const prev = "block !-translate-x-full";

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = data.length;

  const slide = (action) => {
    if (action === "next") {
      setActiveSlide((prev) => prev + 1);
    } else {
      setActiveSlide((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const wdt = window.innerWidth;
    const slider = document.getElementById("slider");
    const outsideLeft = document.getElementById("outsideLeft");
    const outsideRight = document.getElementById("outsideRight");
    const innerSlider = document.getElementById("innerSlider");
    const sliderContentArr = document.getElementsByClassName("sliderContent");
    const nextElArr = document.getElementsByClassName("next");
    const prevElArr = document.getElementsByClassName("prev");
    let sliderContent = sliderContentArr[0];
    let nextEl = nextElArr[0];
    let prevEl = prevElArr[0];
    let pressed = false;
    let isNextEl = false;
    let isPrevEl = false;
    let startX;
    let x;

    const handleMouseDown = (e) => {
      pressed = true;
      startX = e.offsetX || e.touches[0].pageX - e.touches[0].target.offsetLeft;
    };

    const handleMouseUp = (e) => {
      pressed = false;
      innerSlider.style.left = 0;
      outsideLeft.style.width = `0px`;
      outsideRight.style.width = `0px`;
      if (isNextEl === true && nextEl) {
        setActiveSlide(activeSlide + 1);
        isNextEl = false;
        nextEl.removeAttribute("style");
      } else if (isPrevEl === true && prevEl) {
        setActiveSlide(activeSlide - 1);
        isPrevEl = false;
        prevEl.removeAttribute("style");
      }
      innerSlider.removeAttribute("style");
    };

    const handleMouseMove = (e) => {
      if (!pressed) return;
      if (wdt >= 450) {
        e.preventDefault();
      }

      x =
        e.offsetX ||
        e.touches[0].pageX - e.touches[0].target.offsetLeft ||
        null;
      const sliderWidth = slider.offsetWidth;
      const maxWidthOfOutSide = (sliderWidth * 18) / 100;
      const sliderContentOffsetRight =
        window.innerWidth -
        sliderContent.offsetLeft -
        sliderContent.offsetWidth;
      if (activeSlide === 0) {
        // console.log(startX, x, x - startX > maxWidthOfOutSide);
        outsideLeft.style.width = `${x - startX}px`;

        if (x - startX > 0) {
          innerSlider.style.height = "100%";
        }
      } else if (activeSlide === totalSlides - 1) {
        outsideRight.style.width = `${startX - x}px`;
        if (startX - x > 0) {
          innerSlider.style.height = "100%";
        }
      }

      if (startX - x >= sliderContent.offsetLeft && nextEl) {
        isNextEl = true;
        const screenWidth = slider.offsetWidth;

        nextEl.style.left = screenWidth - x;
        nextEl.style.opacity = 100;
      } else if (x - startX >= sliderContentOffsetRight && prevEl) {
        isPrevEl = true;
        prevEl.style.left = x;
        prevEl.style.opacity = 100;
      }

      innerSlider.style.left = `${x - startX}px`;
    };

    if (wdt < 450) {
      slider.addEventListener("touchstart", handleMouseDown, { passive: true });
      window.addEventListener("touchend", handleMouseUp, { passive: true });
      slider.addEventListener("touchmove", handleMouseMove, { passive: true });
      return () => {
        slider.removeEventListener("touchstart", handleMouseDown);
        window.removeEventListener("touchend", handleMouseUp);
        slider.removeEventListener("touchmove", handleMouseMove);
      };
    } else {
      slider.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      slider.addEventListener("mousemove", handleMouseMove);

      return () => {
        slider.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        slider.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [activeSlide, totalSlides]);

  return (
    <div
      id="slider"
      className="relative flex items-center justify-center w-full h-screen overflow-hidden "
    >
      <div
        id="outsideLeft"
        className="absolute left-0 z-[-1] h-full bg-[#eeeeee] w-0  "
      ></div>
      <div
        id="outsideRight"
        className="absolute right-0 z-[-1] h-full bg-[#eeeeee] w-0  "
      ></div>

      <div className="relative w-full" id="innerSlider">
        {data.map((item, index) => (
          <div
            key={item.id}
            className={`transition-all  duration-500 ease-in-out  absolute z-[-1] w-full text-center left-0 translate-x-full
            ${
              index === activeSlide
                ? "block !translate-x-0 top-1/2 -translate-y-1/2  opacity-100"
                : "opacity-0"
            }
            ${index === activeSlide + 1 ? `${next} next` : ""}
            ${index === activeSlide - 1 ? `${prev} prev` : ""}
            `}
          >
            <span
              className={`${
                index === activeSlide
                  ? "sliderContent absolute left-1/2 -translate-x-1/2"
                  : ""
              }`}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
      <button
        disabled={activeSlide === 0}
        onClick={() => slide("prev")}
        className={`absolute left-4 p-4 -translate-y-1/2 top-[51%] border-solid border-t-0  border-r-[3px] border-b-[3px] border-l-0 rotate-[135deg]
        ${activeSlide === 0 ? "border-[#a7d1ff]" : "border-[#4993e2]"}
        `}
      ></button>
      <button
        onClick={() => slide("next")}
        disabled={activeSlide === totalSlides - 1}
        className={`absolute right-4 p-4 -translate-y-1/2 top-[51%] border-solid border-t-0  border-r-[3px] border-b-[3px] border-l-0 -rotate-45
      ${
        activeSlide === totalSlides - 1
          ? "border-[#a7d1ff]"
          : "border-[#4993e2]"
      }
        `}
      ></button>
    </div>
  );
}

export default App;
