import "./index.css";
import React from "react";
import {Composition, Folder} from "remotion";
import {BuildWealth} from "./BuildWealth";
import {HostsBumper} from "./HostsBumper";
import {StakeholderFilm} from "./StakeholderFilm";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Public-Campaign">
      <Composition id="02-Canada-Needs-Hosts" component={HostsBumper} durationInFrames={240} fps={30} width={1080} height={1920} />
      <Composition id="04-Build-Wealth-Build-Housing" component={BuildWealth} durationInFrames={900} fps={30} width={1080} height={1920} />
    </Folder>
    <Folder name="Stakeholder">
      <Composition id="06-Campaign-In-Motion" component={StakeholderFilm} durationInFrames={2460} fps={30} width={1920} height={1080} />
    </Folder>
  </>
);

