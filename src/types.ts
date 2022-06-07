export type ModalParameters = {
    [key: string]: number,
}

export type Circle = {
    htmlContainer: HTMLElement,
    htmlElement: HTMLElement,
    position: CirclePosition,
    shape: CircleShape,
    colors: CircleColors
}

export type CirclePosition = {
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

export type CirclePositions = CirclePosition[]

export type RandomOffset = {
    xOffset: number,
    yOffset: number
}

export type RandomSize = {
    width: number,
    height: number
}

export type CircleShape = {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    6: number,
    7: number,
    8: number,
}

export type CircleColors = {
    color1: Color,
    color2: Color,
    backgroundColor: string,
    backgroundImage: string, 
}

export type Color = {
    h: number,
    s: number,
    l: number,
    a: number
}