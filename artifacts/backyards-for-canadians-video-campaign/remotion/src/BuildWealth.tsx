import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {CaptionTrack, Disclosure, EditorialCopy, Enter, GiantHeadline, PaperField, RouteLine, Stamp, TechnicalRail, VoiceTrack} from "./Shared";
import {technicalFont} from "./fonts";
import {palette, progress, remap} from "./theme";

const EquationScene: React.FC = () => (
  <PaperField dark>
    <TechnicalRail chapter="The homeowner equation" index="01 / 05" dark />
    <div style={{position: "absolute", inset: "220px 68px 190px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Enter start={5} duration={26} x={-100} y={0}><GiantHeadline size={215} color={palette.white}>Backyard<br /><span style={{color: palette.lime}}>equity</span></GiantHeadline></Enter>
      <Enter start={24} duration={12} y={0} scale={1.4} style={{alignSelf: "center", margin: "30px 0"}}><div style={{fontFamily: technicalFont, fontSize: 105, color: palette.lime}}>＋</div></Enter>
      <Enter start={32} duration={28} x={100} y={0} style={{alignSelf: "flex-end"}}><GiantHeadline size={205} color={palette.white} align="right">One more<br /><span style={{color: palette.lime}}>home</span></GiantHeadline></Enter>
      <div style={{marginTop: 65}}><RouteLine start={55} duration={38} dark /></div>
    </div>
  </PaperField>
);

const TwoJobsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const asset = progress(frame, 12, 36);
  return (
    <PaperField>
      <TechnicalRail chapter="Two jobs at once" index="02 / 05" />
      <div style={{position: "absolute", inset: "180px 58px 180px", display: "grid", gridTemplateRows: "1fr auto 1fr", alignItems: "center"}}>
        <Enter start={3} duration={24} x={-80} y={0}><GiantHeadline size={165}>Long-term<br /><span style={{color: palette.signalInk, background: palette.lime, padding: "0 18px"}}>income</span></GiantHeadline></Enter>
        <div style={{height: 560, position: "relative", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Img src={staticFile("generated/campaign-garden-suite-hero.png")} style={{width: 760, height: 560, objectFit: "cover", objectPosition: "center 58%", border: `3px solid ${palette.ink}`, opacity: asset, transform: `scale(${remap(asset, [0, 1], [.82, 1])})`}} />
          <div style={{position: "absolute", width: 640, height: 470, border: `4px solid ${palette.lime}`, transform: `scale(${asset}) rotate(-2deg)`, opacity: asset}} />
        </div>
        <Enter start={42} duration={26} x={80} y={0} style={{textAlign: "right"}}><GiantHeadline size={165}>Legal Toronto<br /><span style={{color: palette.signalInk, background: palette.lime, padding: "0 18px"}}>home</span></GiantHeadline></Enter>
      </div>
    </PaperField>
  );
};

const stages = ["Review", "Plan", "Finance", "Draws", "Takeout"];
const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <PaperField blueprint>
      <TechnicalRail chapter="One coordinated route" index="03 / 05" dark />
      <div style={{position: "absolute", inset: "180px 65px 180px"}}>
        <Enter start={4} duration={25} x={-60} y={0}><GiantHeadline size={176} color={palette.white}>FairLend<br /><span style={{color: palette.lime}}>coordinates.</span></GiantHeadline></Enter>
        <div style={{marginTop: 68, display: "grid", gap: 22}}>
          {stages.map((stage, index) => {
            const p = progress(frame, 32 + index * 22, 16);
            return (
              <div key={stage} style={{height: 150, display: "grid", gridTemplateColumns: "92px 1fr 64px", alignItems: "center", border: "2px solid rgba(255,255,255,.24)", background: "rgba(255,255,255,.05)", opacity: p, transform: `translateX(${remap(p, [0, 1], [index % 2 ? 60 : -60, 0])}px)`}}>
                <div style={{fontFamily: technicalFont, color: palette.lime, fontSize: 32, textAlign: "center"}}>0{index + 1}</div>
                <div style={{fontFamily: technicalFont, fontWeight: 700, color: palette.white, fontSize: 42, textTransform: "uppercase", letterSpacing: ".08em"}}>{stage}</div>
                <div style={{width: 24, height: 24, borderRadius: 99, background: p > .85 ? palette.lime : "rgba(255,255,255,.3)", boxShadow: p > .85 ? `0 0 18px ${palette.lime}` : undefined}} />
              </div>
            );
          })}
        </div>
      </div>
    </PaperField>
  );
};

const PropertySpecificScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = progress(frame, 8, 34);
  return (
    <PaperField>
      <TechnicalRail chapter="Precision before promise" index="04 / 05" />
      <div style={{position: "absolute", inset: "180px 62px 180px", display: "grid", gridTemplateRows: "620px auto", gap: 60}}>
        <div style={{position: "relative", overflow: "hidden", border: `3px solid ${palette.ink}`, background: palette.white}}>
          <Img src={staticFile("brand/parcel-sketch.webp")} style={{width: "100%", height: "100%", objectFit: "cover", opacity: reveal, transform: `scale(${remap(reveal, [0, 1], [1.12, 1])})`}} />
          <div style={{position: "absolute", left: 70, top: 80}}><Stamp start={25}>Property-specific</Stamp></div>
        </div>
        <Enter start={18} duration={24} y={45}>
          <GiantHeadline size={170}>Every property<br />is <span style={{color: palette.signalInk, background: palette.lime, padding: "0 14px"}}>different.</span></GiantHeadline>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 50, fontFamily: technicalFont, fontSize: 25, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em"}}>
            {["Lot & zoning", "Budget & scope", "Qualification", "Program fit"].map((x) => <div key={x} style={{borderTop: `3px solid ${palette.ink}`, paddingTop: 14}}>{x}</div>)}
          </div>
        </Enter>
      </div>
    </PaperField>
  );
};

const CtaScene: React.FC = () => (
  <PaperField dark>
    <TechnicalRail chapter="Start with the property" index="05 / 05" dark />
    <div style={{position: "absolute", inset: "230px 70px 190px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Enter start={6} duration={28} x={-80} y={0}><GiantHeadline size={194} color={palette.white}>Build wealth.<br /><span style={{color: palette.lime}}>Build housing.</span></GiantHeadline></Enter>
      <Enter start={38} duration={24} y={35}><EditorialCopy size={58} style={{color: palette.white, maxWidth: 830}}>Start with a qualified property review.</EditorialCopy></Enter>
      <div style={{marginTop: 72}}><RouteLine start={52} duration={38} dark /></div>
      <Enter start={72} duration={18} y={18} style={{marginTop: 34}}><div style={{fontFamily: technicalFont, fontSize: 26, fontWeight: 700, letterSpacing: ".1em", color: palette.lime, textTransform: "uppercase"}}>FairLend.ca • Request a review</div></Enter>
      <div style={{fontFamily: technicalFont, color: "rgba(255,255,255,.62)", fontSize: 18, lineHeight: 1.35, marginTop: 80, maxWidth: 860}}>Illustrative process. Property feasibility and financing are subject to review, qualification, underwriting, approval, program rules, and available capital.</div>
    </div>
    <Disclosure dark />
  </PaperField>
);

export const BuildWealth: React.FC = () => (
  <AbsoluteFill>
    <VoiceTrack file="04-build-wealth-build-housing.wav" />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}><EquationScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: "from-left"})} timing={linearTiming({durationInFrames: 12})} />
      <TransitionSeries.Sequence durationInFrames={180}><TwoJobsScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-right"})} timing={linearTiming({durationInFrames: 12})} />
      <TransitionSeries.Sequence durationInFrames={220}><ProcessScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 12})} />
      <TransitionSeries.Sequence durationInFrames={180}><PropertySpecificScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />
      <TransitionSeries.Sequence durationInFrames={218}><CtaScene /></TransitionSeries.Sequence>
    </TransitionSeries>
    <CaptionTrack file="04-build-wealth-build-housing.json" dark />
  </AbsoluteFill>
);
