import {Easing, interpolate} from "remotion";

export const palette = {
  paper: "#F8F7F5",
  surface: "#FBFAF8",
  white: "#FFFDF9",
  ink: "#08090A",
  deep: "#030405",
  muted: "#494944",
  rule: "#DEDED8",
  lime: "#96EC18",
  acid: "#8DFF00",
  signalInk: "#203500",
  blueprint: "#002949",
  forest: "#002416",
};

export const crisp = Easing.bezier(0.16, 1, 0.3, 1);
export const editorial = Easing.bezier(0.45, 0, 0.55, 1);
export const decisive = Easing.bezier(0.2, 0.9, 0.2, 1);

export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing = crisp,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const remap = (
  value: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(value, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

