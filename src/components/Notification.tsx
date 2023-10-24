import React, { useEffect } from "react";
import { useTierListStore } from "../zustandStore/store";

const Notification = () => {
  const isNotificationOnScreen = useTierListStore(
    (state) => state.isNotificationOnScreen
  );
  const setIsNotificationOnScreen = useTierListStore(
    (state) => state.setIsNotificationOnScreen
  );
  const notificationText = useTierListStore((state) => state.notificationText);

  useEffect(() => {
    if (isNotificationOnScreen) {
      setTimeout(() => {
        setIsNotificationOnScreen(false);
      }, 3000);
    }
  }, [isNotificationOnScreen]);

  return (
    <div
      className="fixed z-20 left-0 top-8 bg-primaryDarkGray transition-transform duration-300 p-6 text-D rounded shadow-lg"
      data-testid="notification"
      style={{
        transform: isNotificationOnScreen
          ? "translateX(0)"
          : "translateX(-100%)",
      }}
    >
      {notificationText}
    </div>
  );
};

export default Notification;
