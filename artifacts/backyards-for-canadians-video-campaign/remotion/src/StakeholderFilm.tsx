import {Video} from "@remotion/media";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import React from "react";
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from "remotion";
import {CaptionTrack, Disclosure, Enter, PaperField, RouteLine, Stamp, TechnicalRail, VoiceTrack} from "./Shared";
import {displayFont, serifFont, technicalFont} from "./fonts";
import {palette, progress, remap} from "./theme";

const LandscapeTitle: React.FC<{eyebrow: string; children: React.ReactNode; light?: boolean}> = ({eyebrow, children, light = false}) => (
  <>
    <div style={{fontFamily: technicalFont, fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".18em", color: palette.lime, marginBottom: 18}}>{eyebrow}</div>
    <div style={{fontFamily: displayFont, fontSize: 116, lineHeight: .86, letterSpacing: "-.025em", textTransform: "uppercase", color: light ? palette.white : palette.ink}}>{children}</div>
  </>
);

const CapacityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const map = progress(frame, 8, 55);
  const route = progress(frame, 45, 90);
  return (
    <PaperField dark>
      <TechnicalRail chapter="Campaign opportunity" index="01 / 08" dark />
      <div style={{position: "absolute", inset: "122px 84px 70px", display: "grid", gridTemplateColumns: "43% 57%", alignItems: "center", gap: 54}}>
        <Enter start={4} duration={28} x={-70} y={0}>
          <LandscapeTitle eyebrow="Toronto / Hidden capacity" light>Housing potential.<br /><span style={{color: palette.lime}}>Hiding in plain sight.</span></LandscapeTitle>
          <div style={{fontFamily: serifFont, fontSize: 35, lineHeight: 1.08, color: "rgba(255,255,255,.76)", maxWidth: 620, marginTop: 38}}>Backyards can become legal, long-term homes—and a qualified origination engine.</div>
        </Enter>
        <div style={{height: 820, position: "relative"}}>
          <Img src={staticFile("brand/toronto-map.webp")} style={{width: "100%", height: "100%", objectFit: "contain", opacity: map, transform: `scale(${remap(map, [0, 1], [.78, 1])}) translateY(${remap(map, [0, 1], [70, 0])}px)`}} />
          {[{x:35,y:35,d:0},{x:54,y:22,d:12},{x:72,y:38,d:24},{x:44,y:57,d:36},{x:68,y:65,d:48}].map((p, i) => {
            const pin = progress(frame, 70 + p.d, 12);
            return <div key={i} style={{position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 26, height: 26, borderRadius: 99, background: palette.lime, boxShadow: `0 0 22px ${palette.lime}`, opacity: pin, transform: `scale(${pin})`}} />;
          })}
          <div style={{position: "absolute", left: "20%", right: "10%", bottom: 130, height: 9, background: "rgba(255,255,255,.16)"}}><div style={{height: "100%", width: `${route * 100}%`, background: palette.lime, boxShadow: `0 0 20px ${palette.lime}`}} /></div>
        </div>
      </div>
    </PaperField>
  );
};

const PlatformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sign = progress(frame, 24, 36);
  return (
    <PaperField>
      <TechnicalRail chapter="One master platform" index="02 / 08" />
      <div style={{position: "absolute", inset: "120px 86px 72px", display: "grid", gridTemplateColumns: "48% 52%", alignItems: "center", gap: 40}}>
        <Enter start={5} duration={30} x={-80} y={0}>
          <LandscapeTitle eyebrow="The platform">Backyards<br />for <span style={{color: palette.signalInk, background: palette.lime, padding: "0 18px"}}>Canadians.</span></LandscapeTitle>
          <div style={{fontFamily: serifFont, fontSize: 39, lineHeight: 1.08, marginTop: 40, maxWidth: 820}}>A homeowner identity, a visible movement, and one conversion spine.</div>
          <div style={{marginTop: 56, width: 760}}><RouteLine start={48} duration={50} /></div>
        </Enter>
        <div style={{height: 720, position: "relative", overflow: "hidden", border: `4px solid ${palette.ink}`, boxShadow: `20px 20px 0 ${palette.lime}`, opacity: sign, transform: `scale(${remap(sign, [0, 1], [.9, 1])})`}}>
          <Img src={staticFile("generated/campaign-homeowner-movement.png")} style={{width: "100%", height: "100%", objectFit: "cover"}} />
          <div style={{position: "absolute", left: "3.6%", top: "42.2%", width: "25.5%", height: "31%", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "center", color: palette.ink}}>
            <div style={{fontFamily: technicalFont, fontSize: 13, letterSpacing: ".11em", fontWeight: 700, textTransform: "uppercase", marginBottom: 12}}>Founding homeowner</div>
            <div style={{fontFamily: displayFont, fontSize: 43, lineHeight: .88, textTransform: "uppercase"}}>My backyard works for Toronto.</div>
          </div>
        </div>
      </div>
    </PaperField>
  );
};

const Phone: React.FC<{src: string; start?: number; label: string; tilt?: number}> = ({src, start = 0, label, tilt = 0}) => (
  <div style={{width: 348, height: 650, padding: 12, borderRadius: 38, background: palette.deep, border: "4px solid rgba(255,255,255,.3)", boxShadow: "0 30px 80px rgba(0,0,0,.42)", transform: `rotate(${tilt}deg)`, position: "relative", overflow: "hidden"}}>
    <div style={{position: "absolute", top: 17, left: "50%", transform: "translateX(-50%)", width: 110, height: 18, background: palette.deep, borderRadius: 99, zIndex: 3}} />
    <Video src={staticFile(src)} trimBefore={start} muted objectFit="cover" style={{width: "100%", height: "100%", borderRadius: 28}} />
    <div style={{position: "absolute", left: 22, bottom: 22, background: palette.lime, color: palette.signalInk, padding: "7px 10px", fontFamily: technicalFont, fontWeight: 700, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase"}}>{label}</div>
  </div>
);

const AttentionScene: React.FC = () => (
  <PaperField dark>
    <TechnicalRail chapter="Earn attention in one second" index="03 / 08" dark />
    <div style={{position: "absolute", inset: "116px 82px 68px", display: "grid", gridTemplateColumns: "40% 60%", gap: 32, alignItems: "center"}}>
      <Enter start={4} duration={28} x={-70} y={0}>
        <LandscapeTitle eyebrow="Provocation + viral hook" light>Make the<br /><span style={{color: palette.lime}}>contrast</span><br />instant.</LandscapeTitle>
        <div style={{fontFamily: serifFont, fontSize: 34, lineHeight: 1.12, color: "rgba(255,255,255,.72)", marginTop: 36, maxWidth: 610}}>Then move immediately from debate to homeowner utility.</div>
      </Enter>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 46}}>
        <Enter start={18} duration={30} x={60} y={0}><Phone src="hyperframes/01-neighbours-not-tourists.mp4" label="Provocation" tilt={-4} /></Enter>
        <Enter start={42} duration={30} x={80} y={0}><Phone src="hyperframes/03-backyard-to-work.mp4" label="Movement" tilt={4} /></Enter>
      </div>
    </div>
  </PaperField>
);

const ConversionScene: React.FC = () => {
  const steps = ["Review", "Design", "Permits", "Finance", "Draws", "Takeout"];
  const frame = useCurrentFrame();
  return (
    <PaperField blueprint>
      <TechnicalRail chapter="Convert attention into action" index="04 / 08" dark />
      <div style={{position: "absolute", inset: "116px 84px 70px"}}>
        <Enter start={4} duration={28} x={-60} y={0}><LandscapeTitle eyebrow="Homeowner promise" light>Build wealth.<br /><span style={{color: palette.lime}}>Build housing.</span></LandscapeTitle></Enter>
        <div style={{display: "grid", gridTemplateColumns: "46% 54%", gap: 60, marginTop: 40, alignItems: "center"}}>
          <Img src={staticFile("generated/campaign-build-journey.png")} style={{width: 760, height: 500, objectFit: "cover", border: "2px solid rgba(255,255,255,.24)"}} />
          <div style={{display: "grid", gap: 15}}>
            {steps.map((step, index) => {
              const p = progress(frame, 40 + index * 18, 14);
              return <div key={step} style={{height: 74, borderTop: "2px solid rgba(255,255,255,.25)", display: "grid", gridTemplateColumns: "74px 1fr auto", alignItems: "center", opacity: p, transform: `translateX(${remap(p, [0, 1], [55, 0])}px)`, fontFamily: technicalFont, textTransform: "uppercase", letterSpacing: ".1em"}}><span style={{color: palette.lime}}>0{index + 1}</span><span style={{fontSize: 25, fontWeight: 700}}>{step}</span><span style={{color: "rgba(255,255,255,.55)", fontSize: 16}}>COORDINATED</span></div>;
            })}
          </div>
        </div>
        <div style={{position: "absolute", right: 0, bottom: 8, fontFamily: technicalFont, color: "rgba(255,255,255,.58)", fontSize: 16}}>PROPERTY-SPECIFIC • SUBJECT TO REVIEW AND APPROVAL</div>
      </div>
    </PaperField>
  );
};

const ProofScene: React.FC = () => (
  <PaperField>
    <TechnicalRail chapter="Make progress visible" index="05 / 08" />
    <div style={{position: "absolute", inset: "120px 86px 70px", display: "grid", gridTemplateColumns: "45% 55%", alignItems: "center", gap: 54}}>
      <Enter start={5} duration={28} x={-70} y={0}>
        <LandscapeTitle eyebrow="Local proof">One backyard.<br /><span style={{color: palette.signalInk, background: palette.lime, padding: "0 15px"}}>One more home.</span></LandscapeTitle>
        <div style={{fontFamily: serifFont, fontSize: 35, lineHeight: 1.1, marginTop: 40}}>Track verified stages. Show real progress. Let each project recruit the next.</div>
        <div style={{marginTop: 44}}><Stamp>Verified stage</Stamp></div>
      </Enter>
      <div style={{height: 760, display: "flex", justifyContent: "center", alignItems: "center"}}><Phone src="hyperframes/05-one-more-home.mp4" label="Proof film" /></div>
    </div>
  </PaperField>
);

const channelSteps = ["Film", "Paid", "Search", "Calculator", "Review", "CRM", "Partner", "Proof"];
const ChannelScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <PaperField dark>
      <TechnicalRail chapter="Every channel has one job" index="06 / 08" dark />
      <div style={{position: "absolute", inset: "116px 84px 70px"}}>
        <Enter start={4} duration={28} x={-60} y={0}><LandscapeTitle eyebrow="The conversion route" light>Not a media plan.<br /><span style={{color: palette.lime}}>A handoff system.</span></LandscapeTitle></Enter>
        <div style={{display: "flex", alignItems: "center", marginTop: 115, position: "relative", gap: 12}}>
          {channelSteps.map((step, index) => {
            const p = progress(frame, 35 + index * 20, 14);
            return <React.Fragment key={step}><div style={{width: 170, minHeight: 150, border: "2px solid rgba(255,255,255,.25)", background: index >= 3 ? "rgba(150,236,24,.11)" : "rgba(255,255,255,.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20, opacity: p, transform: `translateY(${remap(p, [0, 1], [index % 2 ? -35 : 35, 0])}px)`}}><span style={{fontFamily: technicalFont, fontSize: 17, color: palette.lime}}>0{index + 1}</span><span style={{fontFamily: technicalFont, fontWeight: 700, fontSize: 21, textTransform: "uppercase", letterSpacing: ".06em"}}>{step}</span></div>{index < channelSteps.length - 1 ? <div style={{width: 24, height: 5, background: palette.lime, opacity: progress(frame, 52 + index * 20, 12)}} /> : null}</React.Fragment>;
          })}
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 94, fontFamily: serifFont, fontSize: 29, color: "rgba(255,255,255,.75)"}}><div>Film creates debate.</div><div>Utility qualifies intent.</div><div>Visible proof recruits.</div></div>
      </div>
    </PaperField>
  );
};

const funnel = ["Attention", "Identification", "Property review", "Financing", "Construction", "Advocacy"];
const MeasurementScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <PaperField>
      <TechnicalRail chapter="Measure progression, not applause" index="07 / 08" />
      <div style={{position: "absolute", inset: "116px 84px 70px", display: "grid", gridTemplateColumns: "42% 58%", alignItems: "center", gap: 70}}>
        <Enter start={4} duration={28} x={-70} y={0}><LandscapeTitle eyebrow="KPI hierarchy">Views are<br /><span style={{textDecoration: "line-through", textDecorationColor: palette.lime, textDecorationThickness: 12}}>not success.</span></LandscapeTitle><div style={{fontFamily: serifFont, fontSize: 36, lineHeight: 1.08, marginTop: 38}}>Qualified reviews and verified project stages are.</div></Enter>
        <div style={{display: "grid", gap: 11}}>
          {funnel.map((stage, index) => {
            const p = progress(frame, 35 + index * 22, 16);
            const width = 100 - index * 8;
            return <div key={stage} style={{height: 91, width: `${width}%`, justifySelf: "center", border: `3px solid ${palette.ink}`, background: index >= 2 ? palette.ink : palette.white, color: index >= 2 ? palette.white : palette.ink, display: "grid", gridTemplateColumns: "70px 1fr auto", alignItems: "center", padding: "0 26px", opacity: p, transform: `scaleX(${remap(p, [0, 1], [.75, 1])})`, fontFamily: technicalFont, textTransform: "uppercase", letterSpacing: ".08em"}}><span style={{color: palette.lime}}>0{index + 1}</span><strong style={{fontSize: 23}}>{stage}</strong><span style={{fontSize: 14, color: index >= 2 ? palette.lime : palette.muted}}>{index >= 2 ? "PRIMARY" : "LEADING"}</span></div>;
          })}
        </div>
      </div>
    </PaperField>
  );
};

const DecisionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const weeks = progress(frame, 28, 90);
  return (
    <PaperField dark>
      <TechnicalRail chapter="90-day recommendation" index="08 / 08" dark />
      <div style={{position: "absolute", inset: "116px 84px 66px", display: "grid", gridTemplateColumns: "58% 42%", alignItems: "center", gap: 60}}>
        <Enter start={4} duration={28} x={-70} y={0}><LandscapeTitle eyebrow="Decision" light>Approve the<br /><span style={{color: palette.lime}}>90-day pilot.</span></LandscapeTitle><div style={{fontFamily: serifFont, fontSize: 38, color: "rgba(255,255,255,.76)", lineHeight: 1.1, marginTop: 36, maxWidth: 850}}>Three films. Six social units. Founding homeowners. Partner kits. Visible proof.</div></Enter>
        <div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22}}>{["Prove", "Pilot", "Activate", "Scale"].map((x, i) => <div key={x} style={{height: 160, border: "2px solid rgba(255,255,255,.28)", background: i < weeks * 4 ? "rgba(150,236,24,.14)" : "rgba(255,255,255,.04)", padding: 18, fontFamily: technicalFont, textTransform: "uppercase", display: "flex", flexDirection: "column", justifyContent: "space-between"}}><span style={{color: palette.lime, fontSize: 16}}>0{i+1}</span><strong style={{fontSize: 19}}>{x}</strong></div>)}</div>
          <RouteLine start={34} duration={86} dark />
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: technicalFont, fontSize: 15, marginTop: 14, color: "rgba(255,255,255,.62)"}}><span>WEEK 01</span><span>WEEK 13</span></div>
          <div style={{marginTop: 60, padding: "24px 0", borderTop: `3px solid ${palette.lime}`, borderBottom: "1px solid rgba(255,255,255,.18)"}}><div style={{fontFamily: technicalFont, fontSize: 15, letterSpacing: ".13em", color: palette.lime, textTransform: "uppercase"}}>Primary KPI</div><div style={{fontFamily: displayFont, fontSize: 56, lineHeight: .9, textTransform: "uppercase", marginTop: 12}}>Qualified property reviews</div></div>
        </div>
      </div>
      <div style={{position: "absolute", left: 84, bottom: 36, fontFamily: technicalFont, fontSize: 15, fontWeight: 700, letterSpacing: ".11em", color: palette.lime, textTransform: "uppercase"}}>Build wealth. House a neighbour. Put Toronto’s backyards to work.</div>
      <Disclosure dark landscape />
    </PaperField>
  );
};

export const StakeholderFilm: React.FC = () => (
  <AbsoluteFill>
    <VoiceTrack file="06-stakeholder-campaign.wav" />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={270}><CapacityScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: "from-left"})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={270}><PlatformScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={330}><AttentionScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-right"})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={360}><ConversionScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={300}><ProofScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: "from-left"})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={360}><ChannelScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-bottom"})} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={330}><MeasurementScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
      <TransitionSeries.Sequence durationInFrames={345}><DecisionScene /></TransitionSeries.Sequence>
    </TransitionSeries>
    <CaptionTrack file="06-stakeholder-campaign.json" landscape />
  </AbsoluteFill>
);
