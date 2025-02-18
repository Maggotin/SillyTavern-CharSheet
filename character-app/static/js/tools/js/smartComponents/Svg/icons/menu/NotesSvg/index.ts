import { asDarkSvg, asLightSvg } from "../../../hocs";
import NotesSvg from "./NotesSvg";

const LightNotesSvg = asLightSvg(NotesSvg);
const DarkNotesSvg = asDarkSvg(NotesSvg);

export default NotesSvg;
export { NotesSvg, LightNotesSvg, DarkNotesSvg };
