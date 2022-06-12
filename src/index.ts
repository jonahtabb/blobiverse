import type {CenterPoint,
    Circle,
    Color,
    CircleColors,
    CirclePosition, CirclePositions, CircleShape, RandomOffset, RandomSize, ModalParameters, AudioContextType, AudioContextTypesLookup} from './types';

function drawStartModal(): void {
    window.ModalParameters = {
        "quantity": 100,
        "density": 20,
        "maxSize": 100,
        "speed": 20
    };
    const main = document.getElementsByClassName('main')[0];
    const modalBaseHTML = `
        <div class='modal-container'>
            <div class='modal-background'></div>
            <div class='modal'>
                <label>Quantity</label>
                <input
                    type='range'
                    min='1'
                    max='300'
                    value= ${window.ModalParameters.quantity}
                    class='modal-slider'
                    id='quantity-input'
                    name='quantity'>
                </input>
                <label>Density</label>
                <input
                    type='range'
                    min='0'
                    max='100'
                    value= ${window.ModalParameters.density}
                    class='modal-slider reverse-display'
                    id='density-input'
                    name='density'>
                </input>
                <label>Max Size</label>
                <input
                    type='range'
                    min='1'
                    max='300'
                    value= ${window.ModalParameters.maxSize}
                    class='modal-slider'
                    id='max-size-input'
                    name='maxSize'>
                </input>
                <label>Speed</label>
                <input
                    type='range'
                    min='5'
                    max='60'
                    value= ${window.ModalParameters.speed}
                    class='modal-slider reverse-display'
                    id='speed-input'
                    name='speed'>
                </input>
                <button id='modal-button' type='button'></button>
            </div>
        </div>
    `
    if (!main) return;
    main.innerHTML = modalBaseHTML;

    const modalContainer = document.getElementsByClassName('modal-container')[0] as HTMLInputElement;
    if (modalContainer) {
        setTimeout(() => {modalContainer.style.opacity = "1"}, 100)
    }

    const modalButton = document.getElementById('modal-button');
    if (modalButton) {
        modalButton.onclick = onClickGenerateBtn; 
    }

    const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    if (quantityInput) {
        quantityInput.oninput = onParameterInput;
    }

    const densityInput = document.getElementById('density-input') as HTMLInputElement;
    if (densityInput) {
        densityInput.oninput = onParameterInput;
    }

    const maxSizeInput = document.getElementById('max-size-input') as HTMLInputElement;
    if (maxSizeInput) {
        maxSizeInput.oninput = onParameterInput;
    }

    const speedInput = document.getElementById('speed-input') as HTMLInputElement;
    if (speedInput) {
        speedInput.oninput = onParameterInput;
    }
}

function closeModal(): void {
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    if (!modalContainer) return;
    modalContainer.classList.add('hide');
}

function onParameterInput(this: GlobalEventHandlers, event: Event): void {
    const target = (event.target as HTMLInputElement);
    const key = target.name;
    const value = target.value;
    console.log(key, value);
    window.ModalParameters[key] = parseInt(value); 
}

function onClickGenerateBtn(): void {
    closeModal();
    drawBlobs();
}

function drawBlobs(): void {
    const circlePositions: CirclePositions = new Array<CirclePosition>();
    const main: HTMLElement | null = document.querySelector('.main');
    if (!main) return;
    const mainWidth = (main?.clientWidth || 0);
    const mainHeight = (main?.clientHeight || 0);

    let tryDrawCount = 0;
    for (let i = 0; i < window.ModalParameters["quantity"] && tryDrawCount < 1000; i++) {
        tryDrawCount++
        const circlePosition = generateCirclePosition(mainWidth, mainHeight);
        const positionIsAvailable = isCirclePositionAvailable(circlePosition, circlePositions);
        if (positionIsAvailable == false){
            i--
            continue;
        }
        const circle: Circle = createCircle(circlePosition);
        circlePositions.push(circle.position);
        setTimeout(() => {
            circle.htmlElement.style.transition = `opacity ${window.ModalParameters["speed"]}s`;
            circle.htmlElement.style.transition = `transform ${window.ModalParameters["speed"]}s`;
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
        const centerDistance = getDistance(newPosition.center, circle.center) - window.ModalParameters["density"];
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

        
        circleElement.addEventListener("click", (e) => {
        circleElement.style.transition = "all .2s ease-in-out";
        circleElement.style.boxShadow = 
        `0 0 35px 15px hsla(0, 100%, 98%, .5),
        0 0 65px 25px ${boxShadowColor1},
        0 0 95px 35px ${boxShadowColor2}`;

        circleElement.style.transform = "scale(1.1) rotate(120deg)";
        setTimeout(() => {
            circleElement.style.transform = "scale(1) rotate(120deg)";
            circleElement.style.boxShadow = 
            `0 0 30px 10px hsla(0, 100%, 98%, .25),
            0 0 60px 20px ${boxShadowColor1},
            0 0 90px 30px ${boxShadowColor2}`

        }, .2 * 1000);
    })

    const circleOnClickEvent = generateAudioClickEvent(circlePosition.width, window.ModalParameters["maxSize"]);
    circleElement.addEventListener("click", circleOnClickEvent)
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
    const randomSize = Math.random() * window.ModalParameters["maxSize"];
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
        h: getRandomInt(1, 358),
        s: getRandomInt(30, 100),
        l: getRandomInt(20, 80),
        a: transparency
    }
    return color;
}

function colorToHslaString(color: Color, transparency: number): string {
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${transparency})`
}

function getRandomDegrees(): number {
    return Math.floor(Math.random() * (360))
}

function createLinearGradient(color1: string, color2: string, degrees: number): string {
    return `linear-gradient(${degrees}deg, ${color1} 0%, ${color2} 100%)`
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDecimal(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

function generateSound(context: AudioContext, frequency: number, type: AudioContextType, length: number) {

    let o = context.createOscillator()
    let g = context.createGain()
    o.type = type
    o.connect(g)
    o.frequency.value = frequency
    g.gain.value = .01
    g.connect(context.destination)
    o.start(0)
  
    g.gain.exponentialRampToValueAtTime(
      0.00001, context.currentTime + length
    )
}

function getRandomAudioContextType(): AudioContextType {
    const types: AudioContextTypesLookup = {
        1: "sine",
        2: "square",
        3: "triangle"
    }
    const randomTypeKey = getRandomInt(1,3);
    console.log("ri", randomTypeKey);
    return types[randomTypeKey];
}

function generateAudioClickEvent(blobWidth: number, blobMaxWidth: number): (event: Event) => void {
    const widthAsPercentOfMax = blobWidth / blobMaxWidth;

    const maxFrequency = 800 - (blobWidth * 2)

    const randomFrequency1 = getRandomDecimal(100, maxFrequency);
    const randomFrequency2 = getRandomDecimal(100, maxFrequency);
    const randomFrequency3 = getRandomDecimal(100, maxFrequency);
    const randomFrequency4 = getRandomDecimal(100, maxFrequency);

    const contextType = getRandomAudioContextType();
    const contextType2 = getRandomAudioContextType();
    const length = getRandomDecimal(1, 8 * widthAsPercentOfMax);

    const randomDelay1 = getRandomInt(1, 1);
    const randomDelay2 = getRandomInt(1, 1);
    const randomDelay3 = getRandomInt(1, 1);
    const randomDelay4 = getRandomInt(1, 1);

    function startButtonOnClick(event: Event) {
        event.preventDefault()

        if (!window.BlobAudioContext){
            window.BlobAudioContext = new AudioContext();
        }

        let width = blobWidth;
        console.log(blobWidth);
        setTimeout(()=>{
            console.log(randomFrequency1);
          generateSound(window.BlobAudioContext, randomFrequency1, contextType, length)
        }, randomDelay1)
    
        // setTimeout(()=>{
        //   generateSound(window.BlobAudioContext, randomFrequency2, contextType2, length)
        // }, randomDelay1)
    
        // setTimeout(()=>{
        //   generateSound(window.BlobAudioContext, randomFrequency3, "sine")
        // }, randomDelay3)

        // setTimeout(()=>{
        //     generateSound(window.BlobAudioContext, randomFrequency4, "sine")
        //   }, randomDelay4)
      }

    return startButtonOnClick;
}

drawStartModal();
