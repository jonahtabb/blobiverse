declare global {
    interface Window { ModalParameters: ModalParameters, BlobAudioContext: AudioContext, IsModalOpen: boolean }
}

export type ModalParameters = {
    [key: string]: number,
}

export type Blob = {
    htmlContainer: HTMLElement,
    htmlElement: HTMLElement,
    position: BlobPosition,
    shape: BlobShape,
    colors: BlobColors
}

export type BlobPosition = {
    yTop: number,
    yBottom: number,
    xLeft: number,
    xRight: number,
    width: number,
    height: number,
    radius: number,
    center: CenterPoint
}

export type CenterPoint = {
    xCenter: number,
    yCenter: number
}

export type BlobPositions = BlobPosition[]

export type RandomOffset = {
    xOffset: number,
    yOffset: number
}

export type RandomSize = {
    width: number,
    height: number
}

export type BlobShape = {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
    7: number,
    8: number,
    borderRadiusString: string
}

export type BlobColors = {
    color1: Color,
    color2: Color,
    backgroundColor: string,
    backgroundImage: string, 
    boxShadow1: string,
    boxShadow2: string,
}

export type Color = {
    h: number,
    s: number,
    l: number,
    a: number,
    hslaString: string
}

export type AudioContextType = "sine" | "triangle";
export type AudioContextTypesLookup = {
    [key: number]: AudioContextType
}
export type GenerateSoundParameters = {
    audioContext: AudioContext,
    frequency: number,
    contextType: AudioContextType,
    duration: number,
    gain: number,
}