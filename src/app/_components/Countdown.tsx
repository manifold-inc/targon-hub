"use client";

import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";

import "@leenguyen/react-flip-clock-countdown/dist/index.css";

export default function Countdown() {
  return (
    <div className="origin-center scale-[0.8] sm:scale-100 md:scale-125 lg:scale-150">
      <FlipClockCountdown
        to={new Date(1743534000 * 1000)}
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
  );
}
