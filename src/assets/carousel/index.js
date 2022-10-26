import vertical1 from "./vertical1.JPG"
import vertical2 from "./vertical2.JPG"
import vertical3 from "./vertical3.JPG"
import vertical4 from "./vertical4.JPG"
import vertical5 from "./vertical5.JPG"
import vertical6 from "./vertical6.JPG"
import horizontal1 from "./horizontal1.JPG"
import horizontal2 from "./horizontal2.JPG"
import horizontal3 from "./horizontal3.JPG"
import horizontal4 from "./horizontal4.JPG"
import horizontal5 from "./horizontal5.JPG"
import horizontal6 from "./horizontal6.JPG"

export const verticalMedia = [vertical1, vertical2, vertical3, vertical4, vertical5, vertical6]
export const verticalMediaByIndex = index => verticalMedia[index % verticalMedia.length]

export const horizontalMedia = [horizontal1, horizontal2, horizontal3, horizontal4, horizontal5, horizontal6]
export const horizontalMediaByIndex = index => horizontalMedia[index % horizontalMedia.length]