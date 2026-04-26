import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToRoutineMenu } from "./RoutineMenu.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
import { SubscribeToSettingsToggle, SubscribeToResetButton } from "./Settings.js";
import { SubscribeToSettingsPersistence, LoadAndApplySettings } from "./SettingsStore.js";
import { SubscribeToZenModeExit } from "./ZenMode.js";

const InitializeScene = ():void  =>
{
    new Dot(document.getElementById("dot")!);
    // TODO
    // Creat UIEventDispatcher class (component base type) and move them there, and change the name of this class to GameScene.
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    SetColorChangeEvent();
    SetShapeChangeEvent();
    SetZenModeChangeEvent();
    SetRoutinePickerChangeEvent();
    SetLeftArrowEvent();
    SetRightArrowEvent();
    // SetReminderButtonEvent();

    // TODO
    // Create a component base class which has awake and update methods, and instantiate those classes instead.
    SubscribeToRoutineMenu();
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
    SubscribeToSettingsToggle();
    SubscribeToResetButton();
    SubscribeToZenModeExit();

    // Replay persisted settings first, then start listening for further user
    // changes — otherwise we'd needlessly write the just-loaded values back
    // to localStorage during startup.
    LoadAndApplySettings();
    SubscribeToSettingsPersistence();
}

const SetVelocityChangeEvent = () => {
  const velocitySlider = document.getElementById("velocityslider") as HTMLInputElement;
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
  const radiusSlider = document.getElementById("sizeslider") as HTMLInputElement;
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

const SetColorChangeEvent = () => {
  const colorPicker = document.getElementById("colorpicker") as HTMLInputElement;
  const colorValueChanged = new CustomEvent('Game:ColorValueChanged', {
    detail: {
      color: colorPicker.value
    }
  });

  colorPicker.addEventListener("input", () => {
    colorValueChanged.detail.color = colorPicker.value;
    window.dispatchEvent(colorValueChanged);
  });
};

const SetShapeChangeEvent = () => {
  const shapeSelect = document.getElementById("shapeselect") as HTMLSelectElement;
  const shapeValueChanged = new CustomEvent('Game:ShapeValueChanged', {
    detail: {
      shape: shapeSelect.value
    }
  });

  shapeSelect.addEventListener("change", () => {
    shapeValueChanged.detail.shape = shapeSelect.value;
    window.dispatchEvent(shapeValueChanged);
  });
};

const SetZenModeChangeEvent = () => {
  const zenToggle = document.getElementById("zenmode") as HTMLInputElement;
  const zenModeChanged = new CustomEvent('Game:ZenModeChanged', {
    detail: {
      enabled: zenToggle.checked
    }
  });

  zenToggle.addEventListener("change", () => {
    zenModeChanged.detail.enabled = zenToggle.checked;
    document.body.classList.toggle("zen", zenToggle.checked);
    window.dispatchEvent(zenModeChanged);
  });
};

const SetRoutinePickerChangeEvent = () => {
  const select = document.getElementById("routinepicker") as HTMLSelectElement;
  const routinePickerChanged = new CustomEvent('Game:RoutinePickerChanged', {
    detail: {
      value: select.value
    }
  });

  select.addEventListener("change", () => {
    routinePickerChanged.detail.value = select.value;
    if (select.value === "arrows") {
      document.body.dataset.routineUi = "arrows";
    } else {
      delete document.body.dataset.routineUi;
    }
    window.dispatchEvent(routinePickerChanged);
  });
};

const SetLeftArrowEvent = () : void =>
{
    const leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow = document.querySelector(".arrow.left") as HTMLDivElement;
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
    });
}

const SetRightArrowEvent = () : void =>
{
    const rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
}


const SetReminderButtonEvent = () : void => 
{
    const notificationsClickEvent = new CustomEvent('Game:NotificationsButtonClick');
    const button = document.getElementById("notifications-button") as HTMLDivElement;
    button.addEventListener("click", () => {
        window.dispatchEvent(notificationsClickEvent);
    });
}

InitializeScene();