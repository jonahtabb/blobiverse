import type {CenterPoint, Circle, Color, CircleColors, CirclePosition, CirclePositions, CircleShape, RandomOffset, RandomSize} from './types';

// controllable parameters:
// density
// max size
// glow brightness

drawBlobs();

function drawBlobs(): void {
    const circlePositions: CirclePositions = new Array<CirclePosition>();
    const main: HTMLElement | null = document.querySelector('.main');
    if (!main) return;
    const mainWidth = (main?.clientWidth || 0);
    const mainHeight = (main?.clientHeight || 0);

    for (let i = 0; i < 500; i++) {
        const circlePosition = generateCirclePosition(mainWidth, mainHeight);
        const positionIsAvailable = isCirclePositionAvailable(circlePosition, circlePositions);
        if (positionIsAvailable == false){
            i--
            continue;
        }
        const circle: Circle = createCircle(circlePosition);
        circlePositions.push(circle.position);
        setTimeout(() => {
            circle.htmlElement.style.transition = "opacity 20s";
            circle.htmlElement.style.transition = "transform 20s";
            circle.htmlElement.style.transitionTimingFunction = "ease-in-out";
            circle.htmlElement.style.transform = "scale(0) rotate(20deg)";
            circle.htmlElement.style.opacity = ".2";
            circle.htmlContainer.append(circle.htmlElement);
            main?.append(circle.htmlContainer);
            setTimeout(() => {
                circle.htmlElement.style.transform = "scale(1) rotate(120deg)";
                circle.htmlElement.style.opacity = `1`;
            }, 100)
        }, 100 * i)
    }
    console.log(circlePositions)
}

function generateCirclePosition(containerWidth: number, containerHeight: number): CirclePosition {
    const randomSize = getRandomSize();
    const randomPosition = getRandomOffset();
    const yOffsetPixels = randomPosition.yOffset * containerHeight;
    const xOffsetPixels = randomPosition.xOffset * containerWidth
    const yCenter = yOffsetPixels + (randomSize.height / 2);
    const xCenter = xOffsetPixels + (randomSize.width / 2);
    const circlePosition: CirclePosition = {
        yTop: yOffsetPixels, 
        yBottom: yOffsetPixels + randomSize.height,
        xLeft: xOffsetPixels,
        xRight: xOffsetPixels + randomSize.width,
        width: randomSize.width,
        height: randomSize.height,
        radius: (randomSize.height / 2),
        center: {
            yCenter: yCenter,
            xCenter: xCenter
        }
    }
    return circlePosition;
}

function isCirclePositionAvailable(newPosition: CirclePosition, circlePositions: CirclePositions): boolean {
    for (const circle of circlePositions) {
        const centerDistance = getDistance(newPosition.center, circle.center) - 20;
        const radiusA = newPosition.radius;
        const radiusB = circle.radius;
        const radiiSumSquared = (radiusA + radiusB) ^ 2;

        if (centerDistance <= radiiSumSquared){
            return false;
        }
    }
    return true;
}

function getDistance(pointA: CenterPoint, pointB: CenterPoint) {
    const xPointA = pointA.xCenter;
    const yPointA = pointA.yCenter;
    const xPointB = pointB.xCenter;
    const yPointB = pointB.yCenter;

    const xDist = Math.abs(xPointA - xPointB);
    const yDist = Math.abs(yPointA - yPointB);
        
    return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

function createCircle(circlePosition: CirclePosition): Circle {
    const blobContainer = document.createElement('div'); 
    blobContainer.classList.add('blob-container-1');

    const circleElement = document.createElement('div');
    circleElement.classList.add('blob-1')
    circleElement.style.width = `${circlePosition.width}px`;
    circleElement.style.height = `${circlePosition.height}px`;
    circleElement.style.top = `${circlePosition.yTop}px`;
    circleElement.style.left = `${circlePosition.xLeft}px`;
    const circleShape = getRandomShape();
    const circleShapeString = circleShapeToString(circleShape);
    circleElement.style.borderRadius = circleShapeString;
    const circleColors = getRandomCircleColors();
    circleElement.style.backgroundColor = circleColors.backgroundColor;
    circleElement.style.backgroundImage = circleColors.backgroundImage;
    const boxShadowColor1 = colorToHslaString(circleColors.color1, .20);
    const boxShadowColor2 = colorToHslaString(circleColors.color2, .20);
    circleElement.style.boxShadow = 
        `0 0 30px 10px hsla(0, 100%, 98%, .25),
        0 0 60px 20px ${boxShadowColor1},
        0 0 90px 30px ${boxShadowColor2}`;

    const circle: Circle = {
        htmlContainer: blobContainer,
        htmlElement: circleElement,
        position: {...circlePosition},
        shape: circleShape,
        colors: circleColors
    }
    
    return circle;
}

function getRandomShape(): CircleShape {
    const circleShape: CircleShape = {
        1: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        2: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        3: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        4: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        5: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        6: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        7: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        8: Math.floor(Math.random() * (80 - 20 + 1) + 20),
    }
    return circleShape;
}

function circleShapeToString(circleShape: CircleShape): string {

    return `${circleShape[1]}% ${circleShape[2]}% ${circleShape[3]}% ${circleShape[4]}% / ${circleShape[5]}% ${circleShape[6]}% ${circleShape[7]}% ${circleShape[8]}%`
}

function getRandomSize(): RandomSize {
    const randomSize = Math.random() * 125
    return {width: randomSize, height: randomSize}
}

function getRandomOffset(): RandomOffset {
    const xRandomOffset = Math.random();
    const yRandomOffset = Math.random();
    return {xOffset: xRandomOffset, yOffset: yRandomOffset}
}

function getRandomCircleColors(): CircleColors {
    const color1 = getRandomColor(1);
    const color1String = colorToHslaString(color1, 1);
    const color2 = getRandomColor(1);
    const color2String = colorToHslaString(color2, 1);
    const degrees = getRandomDegrees();
    const linearGradient = createLinearGradient(color1String, color2String, degrees);

    const circleColors: CircleColors = {
        color1: color1,
        color2: color2,
        backgroundColor: color1String,
        backgroundImage: linearGradient
    }
    return circleColors;
}

function getRandomColor(transparency: number): Color {
    const color: Color = {
        h: Math.floor(Math.random() * (358) + 1),
        s: Math.floor(Math.random() * (100 - 40 + 1) + 40),
        l: Math.floor(Math.random() * (70 - 40 + 1) + 40),
        a: transparency
    }

    return color;
}

function colorToHslaString(color: Color, transparency: number): string {
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${transparency})`
}

function getRandomDegrees(): number {
    return Math.floor(Math.random() * (180))
}

function createLinearGradient(color1: string, color2: string, degrees: number): string {
    return `linear-gradient(${degrees}deg, ${color1} 0%, ${color2} 100%)`
}