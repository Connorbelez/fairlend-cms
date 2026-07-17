import {loadFont as loadLeagueGothic} from "@remotion/google-fonts/LeagueGothic";
import {loadFont as loadNewsreader} from "@remotion/google-fonts/Newsreader";
import {loadFont as loadOxanium} from "@remotion/google-fonts/Oxanium";

export const {fontFamily: displayFont} = loadLeagueGothic("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const {fontFamily: serifFont} = loadNewsreader("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const {fontFamily: technicalFont} = loadOxanium("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

