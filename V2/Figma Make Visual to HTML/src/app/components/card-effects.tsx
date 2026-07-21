import imgMiyukiBackground from "../../imports/image-1.png";
import imgMiyukiAvatar from "../../imports/HtmlFe/15989e9c8038f72114ee45814a84f84928f4a686.png";
import imgUnion from "../../imports/HtmlFe/b05a09a965d7367e1be353ee2e0127c6c9eab153.png";
import imgWaveformBg from "../../imports/image-3.png";

/**
 * Visual corrections layered above the read-only Figma import.
 *
 * Letter from the Sea (Frame44, within Component at top-[1135px]):
 *   - Pill at left=890 top=1635 w=210 h=47 in canvas coords.
 *   - The blur overlay softens the photo behind the pill edge.
 *   - Text ("Letter from the Sea", "Instrumental . Soundtrack .") and
 *     the play button are rendered in a separate layer ABOVE the blur so
 *     they remain sharp.
 */
export function CardEffects() {
  return null;
}
