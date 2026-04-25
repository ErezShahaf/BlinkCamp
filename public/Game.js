import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToRoutineMenu } from "./RoutineMenu.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    // TODO
    // Creat UIEventDispatcher class (component base type) and move them there, and change the name of this class to GameScene.
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    // SetReminderButtonEvent();
    // TODO
    // Create a component base class which has awake and update methods, and instantiate those classes instead.
    SubscribeToRoutineMenu();
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
};
const SetVelocityChangeEvent = () => {
    const velocitySlider = document.getElementById("velocityslider");
    const velocityValueChanged = new CustomEvent('Game:VelocityValueChanged', {
        detail: {
            velocity: velocitySlider.value
        }
    });
    velocitySlider.addEventListener("input", () => {
        velocityValueChanged.detail.velocity = velocitySlider.value;
        window.dispatchEvent(velocityValueChanged);
    });
};
const SetRadiusChangeEvent = () => {
    const radiusSlider = document.getElementById("sizeslider");
    const radiusValueChanged = new CustomEvent('Game:RadiusValueChanged', {
        detail: {
            radius: radiusSlider.value
        }
    });
    radiusSlider.addEventListener("input", () => {
        radiusValueChanged.detail.radius = radiusSlider.value;
        window.dispatchEvent(radiusValueChanged);
    });
};
const SetReminderButtonEvent = () => {
    const notificationsClickEvent = new CustomEvent('Game:NotificationsButtonClick');
    const button = document.getElementById("notifications-button");
    button.addEventListener("click", () => {
        window.dispatchEvent(notificationsClickEvent);
    });
};
InitializeScene();
