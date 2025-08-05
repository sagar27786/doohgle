import React from "react";
import { Tv, Smartphone } from "lucide-react";

const DeviceSection = () => {
  const devices = [
    {
      icon: <Tv className="h-12 w-12 text-purple-600" />,
      title: "Smart TV",
      description:
        "The FRAMEN Screen Manager is available for Android TV and Fire OS App Market. If you have already Smart TV in your venue, download the app and you are good to go.",
    },
    {
      icon: <Smartphone className="h-12 w-12 text-purple-600" />,
      title: "Streaming Sticks",
      description:
        "No Smart TV? No problem. Using an Android, Fire OS or Google Chromecast streaming stick will allow you to download our app.",
    },
  ];

  return <></>;
};

export default DeviceSection;
