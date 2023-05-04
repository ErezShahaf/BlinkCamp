import { Dot } from "./Dot.js";
let lastFrameTime;
let tickEvent;
let leftArrowClickEvent;
let rightArrowClickEvent;
let dTime;
const Initialize = () => {
    lastFrameTime = performance.now();
    new Dot(document.getElementById("dot"));
    tickEvent = new CustomEvent('App:Update', { detail: dTime });
    leftArrowClickEvent = new CustomEvent('App:LeftArrowClick');
    const leftArrow = document.querySelector(".arrow.left");
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
    });
    rightArrowClickEvent = new CustomEvent('App:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right");
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
    // Start the game loop
    window.requestAnimationFrame(GameLoop);
};
const GameLoop = () => {
    // Calculate dTime
    dTime = (performance.now() - lastFrameTime) / 1000; // ms to seconds
    lastFrameTime = performance.now();
    // Call update on all living game elements
    window.dispatchEvent(tickEvent);
    // Schedule the next game loop when possible
    window.requestAnimationFrame(GameLoop);
};
Initialize();
