"use strict";
let lastFrameTime;
let tickEvent;
let leftArrowClickEvent;
let rightArrowClickEvent;
const loopDetail = {
    dTime: 0
};
const Initialize = () => {
    lastFrameTime = performance.now();
    tickEvent = new CustomEvent('GameLoop:Update', { detail: loopDetail });
    // Start the game loop
    window.requestAnimationFrame(GameLoop);
};
const GameLoop = () => {
    // Calculate dTime
    loopDetail.dTime = (performance.now() - lastFrameTime) / 1000; // ms to seconds
    lastFrameTime = performance.now();
    // Call update on all living game elements
    window.dispatchEvent(tickEvent);
    // Schedule the next game loop when possible
    window.requestAnimationFrame(GameLoop);
};
Initialize();
