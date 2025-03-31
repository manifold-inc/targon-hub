"use client";

import { useEffect, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export default function Countdown() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="origin-center scale-[0.8] sm:scale-100 md:scale-125 lg:scale-150">
      {isClient ? (
        <div className="animate-fade-in">
          <FlipClockCountdown
            to={new Date(1743710400 * 1000)}
            digitBlockStyle={{
              fontWeight: "bold",
              color: "#22242E",
              backgroundColor: "#C5DBFF",
              boxShadow: "none",
            }}
            labelStyle={{
              textTransform: "uppercase",
              color: "#22242E",
            }}
            separatorStyle={{
              color: "#52ABFF",
            }}
            dividerStyle={{
              color: "#E6F0FF",
              height: "2px",
            }}
          />
        </div>
      ) : (
        <div className="h-28 w-12" />
      )}
    </div>
  );
}
