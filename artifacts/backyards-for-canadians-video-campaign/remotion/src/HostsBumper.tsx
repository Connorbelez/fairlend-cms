import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {
  CaptionTrack,
  Disclosure,
  Enter,
  GiantHeadline,
  PaperField,
  RouteLine,
  Stamp,
  TechnicalRail,
  VoiceTrack,
} from "./Shared";
import {technicalFont} from "./fonts";
import {palette, progress, remap} from "./theme";

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lock = progress(frame, 2, 16);
  return (
    <PaperField dark>
      <TechnicalRail chapter="Public hook" index="01 / 03" dark />
      <div style={{position: "absolute", inset: "250px 72px 170px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div style={{fontFamily: technicalFont, color: palette.lime, fontWeight: 700, fontSize: 26, letterSpacing: ".2em", marginBottom: 28}}>CANADA / HOUSING SIGNAL</div>
        <GiantHeadline
          size={260}
          color={palette.white}
          style={{transform: `scaleX(${remap(lock, [0, 1], [1.2, 1])})`, transformOrigin: "left"}}
        >
          Canada<br />needs<br /><span style={{color: palette.lime}}>hosts.</span>
        </GiantHeadline>
        <div style={{marginTop: 54}}><RouteLine start={18} duration={28} dark /></div>
      </div>
      <div style={{position: "absolute", right: -130, bottom: 160, fontFamily: technicalFont, fontSize: 280, fontWeight: 700, color: "rgba(255,255,255,.035)", transform: "rotate(-90deg)"}}>HOST</div>
    </PaperField>
  );
};

const RedefinitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = progress(frame, 20, 22);
  return (
    <PaperField>
      <TechnicalRail chapter="Redefine the role" index="02 / 03" />
      <div style={{position: "absolute", inset: "210px 68px 180px", display: "flex", flexDirection: "column"}}>
        <Enter start={5} duration={20} x={-70} y={0}>
          <div style={{border: `3px solid ${palette.ink}`, padding: "26px 30px", fontFamily: technicalFont, fontSize: 28, letterSpacing: ".1em", display: "flex", justifyContent: "space-between"}}>
            <span>BOOKING TYPE</span><span>2 NIGHTS</span>
          </div>
        </Enter>
        <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
          <Enter start={12} duration={16} y={0} scale={1.16}>
            <GiantHeadline size={290} align="center">AIRBNB<br />KIND</GiantHeadline>
          </Enter>
          <div style={{position: "absolute", left: 20, right: 20, top: "50%", height: 28, transform: "rotate(-6deg)", transformOrigin: "left", background: palette.lime, width: `${strike * 96}%`, boxShadow: `0 0 30px ${palette.lime}99`}} />
        </div>
        <Enter start={30} duration={18} x={75} y={0} style={{alignSelf: "flex-end"}}>
          <Stamp>Redefine host</Stamp>
        </Enter>
      </div>
    </PaperField>
  );
};

const HouseholdScene: React.FC = () => {
  const frame = useCurrentFrame();
  const door = progress(frame, 10, 28);
  return (
    <PaperField blueprint>
      <TechnicalRail chapter="A better kind of host" index="03 / 03" dark />
      <div style={{position: "absolute", inset: "210px 70px 190px", display: "grid", gridTemplateRows: "1fr auto"}}>
        <div style={{display: "grid", gridTemplateColumns: "42% 58%", alignItems: "center", gap: 34}}>
          <div style={{position: "relative", height: 660}}>
            <div style={{position: "absolute", left: 70, top: 30, width: 300, height: 560, border: `18px solid ${palette.white}`, borderBottomWidth: 28, opacity: door}}>
              <div style={{position: "absolute", right: 34, top: 275, width: 26, height: 26, borderRadius: 99, background: palette.lime, boxShadow: `0 0 22px ${palette.lime}`}} />
            </div>
            <div style={{position: "absolute", left: 15, right: 15, bottom: 35, height: 12, background: palette.lime, transform: `scaleX(${door})`, transformOrigin: "left"}} />
          </div>
          <Enter start={5} duration={22} x={80} y={0}>
            <GiantHeadline size={154} color={palette.white}>Host a<br /><span style={{color: palette.lime}}>household.</span></GiantHeadline>
            <div style={{fontFamily: technicalFont, color: palette.white, fontSize: 33, lineHeight: 1.25, marginTop: 40, letterSpacing: ".06em", textTransform: "uppercase"}}>Grow a neighbourhood.<br />Build a long-term home.</div>
          </Enter>
        </div>
        <div>
          <RouteLine start={35} duration={30} dark />
          <div style={{display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: technicalFont, fontWeight: 700, fontSize: 24, letterSpacing: ".1em"}}>
            <span>BACKYARDS FOR CANADIANS</span><span style={{color: palette.lime}}>FAIRLEND</span>
          </div>
        </div>
      </div>
      <Disclosure dark />
    </PaperField>
  );
};

export const HostsBumper: React.FC = () => (
  <AbsoluteFill>
    <VoiceTrack file="02-canada-needs-hosts.wav" />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={70}><HookScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: "from-left"})} timing={linearTiming({durationInFrames: 10})} />
      <TransitionSeries.Sequence durationInFrames={90}><RedefinitionScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 10})} />
      <TransitionSeries.Sequence durationInFrames={100}><HouseholdScene /></TransitionSeries.Sequence>
    </TransitionSeries>
    <CaptionTrack file="02-canada-needs-hosts.json" dark />
  </AbsoluteFill>
);
