import type {Caption} from "@remotion/captions";
import {Audio} from "@remotion/media";
import React, {useEffect, useMemo, useState} from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import {displayFont, serifFont, technicalFont} from "./fonts";
import {palette, progress, remap} from "./theme";

export const PaperField: React.FC<{
  dark?: boolean;
  blueprint?: boolean;
  children?: React.ReactNode;
}> = ({dark = false, blueprint = false, children}) => {
  const base = blueprint ? palette.blueprint : dark ? palette.deep : palette.paper;
  const line = dark || blueprint ? "rgba(255,255,255,.08)" : "rgba(8,9,10,.07)";
  return (
    <AbsoluteFill
      style={{
        backgroundColor: base,
        color: dark || blueprint ? palette.white : palette.ink,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, ${line} 1px, rgba(0,0,0,0) 1px)`,
          backgroundSize: "72px 72px",
          opacity: blueprint ? 0.55 : 0.35,
        }}
      />
      <Img
        src={staticFile("brand/paper-texture.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: dark || blueprint ? 0.08 : 0.18,
          mixBlendMode: dark || blueprint ? "screen" : "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 36,
          border: `2px solid ${dark || blueprint ? "rgba(255,255,255,.18)" : palette.rule}`,
          pointerEvents: "none",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const TechnicalRail: React.FC<{
  chapter: string;
  index: string;
  dark?: boolean;
}> = ({chapter, index, dark = false}) => (
  <div
    style={{
      position: "absolute",
      top: 58,
      left: 64,
      right: 64,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: technicalFont,
      fontWeight: 700,
      fontSize: 23,
      letterSpacing: ".13em",
      textTransform: "uppercase",
      color: dark ? palette.lime : palette.muted,
      zIndex: 20,
    }}
  >
    <span>{chapter}</span>
    <span>{index}</span>
  </div>
);

export const Enter: React.FC<{
  children: React.ReactNode;
  start?: number;
  duration?: number;
  x?: number;
  y?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({children, start = 4, duration = 18, x = 0, y = 36, scale = 0.98, style}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${remap(p, [0, 1], [x, 0])}px, ${remap(p, [0, 1], [y, 0])}px) scale(${remap(p, [0, 1], [scale, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const RouteLine: React.FC<{
  start?: number;
  duration?: number;
  width?: number | string;
  dark?: boolean;
}> = ({start = 10, duration = 30, width = "100%", dark = false}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, duration);
  return (
    <div
      style={{
        width,
        height: 14,
        position: "relative",
        background: dark ? "rgba(255,255,255,.14)" : palette.rule,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${p * 100}%`,
          background: palette.lime,
          boxShadow: `0 0 24px ${palette.lime}88`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -8,
          left: `calc(${p * 100}% - 15px)`,
          width: 30,
          height: 30,
          borderRadius: 99,
          background: palette.lime,
          border: `5px solid ${dark ? palette.deep : palette.paper}`,
        }}
      />
    </div>
  );
};

export const Stamp: React.FC<{
  children: React.ReactNode;
  start?: number;
  rotate?: number;
  dark?: boolean;
}> = ({children, start = 12, rotate = -2, dark = false}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 10);
  const impact = p < 0.75 ? remap(p, [0, 0.75], [1.25, 0.96]) : remap(p, [0.75, 1], [0.96, 1]);
  return (
    <div
      style={{
        display: "inline-flex",
        padding: "12px 18px 9px",
        border: `5px solid ${dark ? palette.lime : palette.ink}`,
        color: dark ? palette.lime : palette.ink,
        fontFamily: technicalFont,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        opacity: p,
        transform: `rotate(${rotate}deg) scale(${impact})`,
      }}
    >
      {children}
    </div>
  );
};

export const Disclosure: React.FC<{dark?: boolean; landscape?: boolean}> = ({
  dark = false,
  landscape = false,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: landscape ? 26 : 44,
      right: landscape ? 38 : 54,
      zIndex: 50,
      fontFamily: technicalFont,
      fontSize: landscape ? 13 : 17,
      letterSpacing: ".09em",
      color: dark ? "rgba(255,255,255,.58)" : "rgba(8,9,10,.56)",
      textTransform: "uppercase",
    }}
  >
    AI-generated voice • OpenAI TTS
  </div>
);

export const VoiceTrack: React.FC<{file: string; volume?: number}> = ({
  file,
  volume = 1,
}) => <Audio src={staticFile(`audio/${file}`)} volume={volume} />;

const CaptionCard: React.FC<{caption: Caption; dark: boolean; landscape?: boolean}> = ({caption, dark, landscape = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = progress(frame, 0, Math.min(10, fps * 0.25));
  return (
    <div
      style={{
        position: "absolute",
        left: landscape ? 220 : 70,
        right: landscape ? 220 : 70,
        bottom: landscape ? 54 : 128,
        display: "flex",
        justifyContent: "center",
        zIndex: 40,
        opacity: p,
        transform: `translateY(${remap(p, [0, 1], [18, 0])}px)`,
      }}
    >
      <div
        style={{
          maxWidth: landscape ? 1160 : 900,
          padding: landscape ? "11px 18px 9px" : "15px 22px 12px",
          background: dark ? palette.paper : palette.ink,
          color: dark ? palette.ink : palette.white,
          fontFamily: technicalFont,
          fontSize: landscape ? 24 : 31,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: ".02em",
          textTransform: "uppercase",
          boxShadow: `10px 10px 0 ${palette.lime}`,
          textAlign: "center",
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};

export const CaptionTrack: React.FC<{
  file: string;
  dark?: boolean;
  landscape?: boolean;
}> = ({file, dark = false, landscape = false}) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender(`captions-${file}`));
  const {fps} = useVideoConfig();

  useEffect(() => {
    fetch(staticFile(`captions/${file}`))
      .then((response) => response.json())
      .then((data: Caption[]) => {
        setCaptions(data);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [cancelRender, continueRender, file, handle]);

  const sequences = useMemo(() => captions ?? [], [captions]);
  if (!captions) return null;

  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 60}}>
      {sequences.map((caption, index) => {
        const from = Math.round((caption.startMs / 1000) * fps);
        const duration = Math.max(
          1,
          Math.round(((caption.endMs - caption.startMs) / 1000) * fps),
        );
        return (
          <Sequence key={`${caption.startMs}-${index}`} from={from} durationInFrames={duration} premountFor={fps}>
            <CaptionCard caption={caption} dark={dark} landscape={landscape} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const GiantHeadline: React.FC<{
  children: React.ReactNode;
  size?: number;
  align?: "left" | "center" | "right";
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = 190, align = "left", color, style}) => (
  <div
    style={{
      fontFamily: displayFont,
      fontSize: size,
      lineHeight: 0.86,
      letterSpacing: "-.025em",
      textTransform: "uppercase",
      textAlign: align,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const EditorialCopy: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, size = 54, style}) => (
  <div
    style={{
      fontFamily: serifFont,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: "-.025em",
      ...style,
    }}
  >
    {children}
  </div>
);
