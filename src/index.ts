import type {
    CenterPoint,
    Blob,
    Color,
    BlobColors,
    BlobPosition,
    BlobPositions,
    BlobShape, RandomOffset, RandomSize, ModalParameters, AudioContextType, AudioContextTypesLookup, GenerateSoundParameters, CancelBlobDraw
} from './types';

function main(): void {
    initializeContextValues();
    drawStartModal();
    drawVolumeSlider();
}

function drawVolumeSlider(): void {
    const main = document.getElementsByClassName('main')[0];
    let volumeSliderHTML = `
            <input
                type='range'
                min= '0'
                max= '.019'
                value= '.005'
                step= 'any'
                class= 'vertical-slider'
                id= 'volume-slider'
                name= 'volume slider'>
            </input>
    `

    const volumeSliderContainer = document.createElement('div');
    volumeSliderContainer.classList.add('volume-slider-container');
    volumeSliderContainer.innerHTML = volumeSliderHTML;

    const volumeControlContainer = document.createElement('div');
    volumeControlContainer.classList.add('volume-control-container');

    const volumeIcon = document.createElement('img');
    volumeIcon.src = './assets/icon-low-volume.svg';
    volumeIcon.alt = 'volume speaker icon';
    volumeIcon.classList.add('volume-icon');

    main.append(volumeControlContainer);
    volumeControlContainer.append(volumeSliderContainer)
    volumeControlContainer.append(volumeIcon)

    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    if (volumeSlider) {
        volumeSlider.oninput = onVolumeInput;
    }
}

function initializeContextValues(): void {
    let maxQuantity = 100;
    let maxMaxSize = 300;
    let maxDensity = 100;
    let maxSpeed = 60;

    if (window.outerWidth < 800) {
        maxQuantity = maxQuantity * (window.outerWidth / 6000);
        maxMaxSize = maxMaxSize * (window.outerWidth / 1000);
    }

    window.BlobiverseContext = {
        ModalParameters: {
            "quantity": Math.floor(maxQuantity / 2),
            "density": Math.floor(maxDensity / 2.5),
            "maxSize": Math.floor(maxMaxSize / 2),
            "speed": Math.floor(maxSpeed / 2.5)
        },
        ModalParameterRanges: {
            quantity: { min: 1, max: maxQuantity },
            density: { min: 0, max: maxDensity },
            maxSize: { min: 1, max: maxMaxSize },
            speed: { min: 5, max: maxSpeed }
        },
        Volume: .016,
        VolumeRange: { min: 0, max: .016},
        BlobAudioContext: null,
        NotesAsFrequencies: {
            "C": [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
           "Db":   [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
            "D":   [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
           "Eb":   [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
            "E":   [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
            "F":   [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
           "Gb":   [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
            "G":   [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96],
           "Ab":   [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
            "A":   [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
           "Bb":   [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
            "B":   [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
        },
        IsModalOpen: false,
        CancelBlobDraws: new Array<CancelBlobDraw>()
    }
}

function drawStartModal(): void {
    const main = document.getElementsByClassName('main')[0];
    const modalBaseHTML = `
        <div class='modal-container'>
            <div class='modal-background'></div>
            <div class='modal'>
                <h1>Blobiverse Generator</h1>
                <label>Quantity</label>
                <input
                    type='range'
                    min= '${window.BlobiverseContext.ModalParameterRanges.quantity.min}'
                    max= '${window.BlobiverseContext.ModalParameterRanges.quantity.max}'
                    value= '${window.BlobiverseContext.ModalParameters.quantity}'
                    class='modal-slider'
                    id='quantity-input'
                    name='quantity'>
                </input>
                <label>Density</label>
                <input
                    type='range'
                    min= '${window.BlobiverseContext.ModalParameterRanges.density.min}'
                    max= '${window.BlobiverseContext.ModalParameterRanges.density.max}'
                    value= '${window.BlobiverseContext.ModalParameters.density}'
                    class='modal-slider reverse-display'
                    id='density-input'
                    name='density'>
                </input>
                <label>Max Size</label>
                <input
                    type='range'
                    min= '${window.BlobiverseContext.ModalParameterRanges.maxSize.min}'
                    max= '${window.BlobiverseContext.ModalParameterRanges.maxSize.max}'
                    value= '${window.BlobiverseContext.ModalParameters.maxSize}'
                    class= 'modal-slider'
                    id= 'max-size-input'
                    name= 'maxSize'>
                </input>
                <label>Speed</label>
                <input
                    type='range'
                    min='${window.BlobiverseContext.ModalParameterRanges.speed.min}'
                    max='${window.BlobiverseContext.ModalParameterRanges.speed.max}'
                    value= '${window.BlobiverseContext.ModalParameters.speed}'
                    class='modal-slider reverse-display'
                    id='speed-input'
                    name='speed'>
                </input>
            </div>
        </div>
    `
    if (!main) return;
    main.innerHTML = modalBaseHTML;
    window.BlobiverseContext.IsModalOpen = true;

    const generateButton = document.createElement('button');
    generateButton.id = 'modal-button';
    generateButton.type = 'button';
    main.append(generateButton);

    setTimeout(() => { generateButton.style.opacity = "1" }, 100)

    const modalContainer = document.getElementsByClassName('modal-container')[0] as HTMLInputElement;
    if (modalContainer) {
        setTimeout(() => { modalContainer.style.opacity = "1" }, 100)
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
    window.BlobiverseContext.IsModalOpen = false;
    modalContainer.classList.add('hide');
}

function openModal(): void {
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    if (!modalContainer) return;
    window.BlobiverseContext.IsModalOpen = true;
    modalContainer.classList.remove('hide');
}

function onParameterInput(this: GlobalEventHandlers, event: Event): void {
    const target = (event.target as HTMLInputElement);
    const key = target.name;
    const value = target.value;
    console.log(key, value)
    window.BlobiverseContext.ModalParameters[key] = parseInt(value);
}

function onVolumeInput(this: GlobalEventHandlers, event: Event): void {
    const target = (event.target as HTMLInputElement);
    const key = target.name;
    const value = target.value;
    console.log(key, value)
    window.BlobiverseContext.Volume = parseFloat(target.value);
}

function onClickGenerateBtn(): void {
    const IsModalOpen = window.BlobiverseContext.IsModalOpen;
    if (IsModalOpen) {
        closeModal();
        drawBlobs();
    } else {
        clearBlobs();
        openModal();
    }
}

function drawBlobs(): void {
    const blobPositions: BlobPositions = new Array<BlobPosition>();
    const main: HTMLElement | null = document.querySelector('.main');
    if (!main) return;
    const mainWidth = (main?.clientWidth || 0);
    const mainHeight = (main?.clientHeight || 0);

    let tryDrawCount = 0;
    for (let i = 0; i < window.BlobiverseContext.ModalParameters["quantity"] && tryDrawCount < 1000; i++) {
        tryDrawCount++
        const blobPosition = generateBlobPosition(mainWidth, mainHeight);
        const positionIsAvailable = isBlobPositionAvailable(blobPosition, blobPositions);
        if (positionIsAvailable == false) {
            i--
            continue;
        }
        const blob: Blob = createBlob(blobPosition);
        blobPositions.push(blob.position);
        insertBlob(main, blob, i)
    }
}

function clearBlobs(): void {
    // clearTimeout for blobs that are not yet on the DOM
    window.BlobiverseContext.CancelBlobDraws.forEach(cancelBlobDraw => {
        cancelBlobDraw()
    })
    // remove blobs that are already on the dom
    const blobs = document.getElementsByClassName('blob-container-1');
    let blobsArray: Element[] = Array.from(blobs);
    blobsArray.forEach((element) => {
        element.remove()
    })
}

function insertBlob(parentElement: HTMLElement, blob: Blob, blobIndex: number) {
    let timeoutId = setTimeout(() => {

        blob.htmlElement.style.transition = `opacity ${window.BlobiverseContext.ModalParameters["speed"]}s`;
        blob.htmlElement.style.transition = `transform ${window.BlobiverseContext.ModalParameters["speed"]}s`;
        blob.htmlElement.style.transitionTimingFunction = "ease-in-out";
        blob.htmlElement.style.transform = "scale(0) rotate(20deg)";
        blob.htmlElement.style.opacity = ".2";
        blob.htmlContainer.append(blob.htmlElement);
        parentElement?.append(blob.htmlContainer);

        setTimeout(() => {
            blob.htmlElement.style.transform = "scale(1) rotate(120deg)";
            blob.htmlElement.style.opacity = `1`;
        }, 100)

    }, 100 * blobIndex)

    const cancelBlobDraw = function () { 
        clearTimeout(timeoutId) 
    }
    window.BlobiverseContext.CancelBlobDraws.push(
        cancelBlobDraw
    )

    const blobElement = blob.htmlElement;

    blobElement.addEventListener("click", (event: Event) => {

        let currentWidth = blob.position.width;

        if (event.target instanceof HTMLElement) {
            currentWidth = event.target.clientWidth;
        }
        const currentScale = currentWidth / blob.position.width
        const clickScale = currentScale * 1.1;

        blobElement.style.transition = "all .2s ease-out";
        blobElement.style.boxShadow =
            `0 0 35px 15px hsla(0, 100%, 98%, .5),
        0 0 65px 25px ${blob.colors.boxShadow1},
        0 0 95px 35px ${blob.colors.boxShadow2}`;

        blobElement.style.transform = `scale(${clickScale}) rotate(120deg)`;

        setTimeout(() => {
            const widthAsPercentOfMax = blob.position.width / window.BlobiverseContext.ModalParameters["maxSize"];
            let duration = Math.floor(5 * widthAsPercentOfMax);
            if (duration < 2) {
                duration = 2;
            }
            blobElement.style.transition = `all ${duration}s ease-out`;
            blobElement.style.transform = `scale(${currentScale}) rotate(120deg)`;
            blobElement.style.boxShadow =
                `0 0 30px 10px hsla(0, 100%, 98%, .25),
            0 0 60px 20px ${blob.colors.boxShadow1},
            0 0 90px 30px ${blob.colors.boxShadow2}`

        }, .2 * 1000);
    })

    const blobOnClickEvent = generateAudioClickEvent(blob.position.width, window.BlobiverseContext.ModalParameters["maxSize"]);
    blobElement.addEventListener("click", blobOnClickEvent);
}

function generateBlobPosition(containerWidth: number, containerHeight: number): BlobPosition {
    const randomSize = getRandomSize();
    const randomPosition = getRandomOffset();
    const yOffsetPixels = randomPosition.yOffset * containerHeight;
    const xOffsetPixels = randomPosition.xOffset * containerWidth
    const yCenter = yOffsetPixels + (randomSize.height / 2);
    const xCenter = xOffsetPixels + (randomSize.width / 2);
    const blobPosition: BlobPosition = {
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
    return blobPosition;
}

function isBlobPositionAvailable(newPosition: BlobPosition, blobPositions: BlobPositions): boolean {
    for (const blob of blobPositions) {
        const centerDistance = getDistanceBetweenTwoPoints(newPosition.center, blob.center) - window.BlobiverseContext.ModalParameters["density"];
        const radiusA = newPosition.radius;
        const radiusB = blob.radius;
        const radiiSumSquared = (radiusA + radiusB) ^ 2;

        if (centerDistance <= radiiSumSquared) {
            return false;
        }
    }
    return true;
}

function getDistanceBetweenTwoPoints(pointA: CenterPoint, pointB: CenterPoint) {
    const xPointA = pointA.xCenter;
    const yPointA = pointA.yCenter;
    const xPointB = pointB.xCenter;
    const yPointB = pointB.yCenter;

    const xDist = Math.abs(xPointA - xPointB);
    const yDist = Math.abs(yPointA - yPointB);

    return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

function createBlob(blobPosition: BlobPosition): Blob {
    const blobContainer = document.createElement('div');
    blobContainer.classList.add('blob-container-1');

    const blobElement = document.createElement('div');
    blobElement.classList.add('blob-1');
    blobElement.style.width = `${blobPosition.width}px`;
    blobElement.style.height = `${blobPosition.height}px`;
    blobElement.style.top = `${blobPosition.yTop}px`;
    blobElement.style.left = `${blobPosition.xLeft}px`;

    const blobShape = getRandomShape();
    blobElement.style.borderRadius = blobShape.borderRadiusString;

    const blobColors = getRandomBlobColors();
    blobElement.style.backgroundColor = blobColors.backgroundColor;
    blobElement.style.backgroundImage = blobColors.backgroundImage;

    blobElement.style.boxShadow =
        `0 0 30px 10px hsla(0, 100%, 98%, .25),
        0 0 60px 20px ${blobColors.boxShadow1},
        0 0 90px 30px ${blobColors.boxShadow2}`;

    const blob: Blob = {
        htmlContainer: blobContainer,
        htmlElement: blobElement,
        position: { ...blobPosition },
        shape: blobShape,
        colors: blobColors
    }

    return blob;
}

function getRandomShape(): BlobShape {
    const blobShape: BlobShape = {
        1: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        2: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        3: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        4: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        5: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        6: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        7: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        8: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        borderRadiusString: "",
    }
    blobShape.borderRadiusString = `${blobShape[1]}% ${blobShape[2]}% ${blobShape[3]}% ${blobShape[4]}% / ${blobShape[5]}% ${blobShape[6]}% ${blobShape[7]}% ${blobShape[8]}%`;
    return blobShape;
}

function getRandomSize(): RandomSize {
    const randomSize = Math.random() * window.BlobiverseContext.ModalParameters["maxSize"];
    return { width: randomSize, height: randomSize }
}

function getRandomOffset(): RandomOffset {
    const xRandomOffset = Math.random();
    const yRandomOffset = Math.random();
    return { xOffset: xRandomOffset, yOffset: yRandomOffset }
}

function getRandomBlobColors(): BlobColors {
    const color1 = getRandomColor(1);
    const color2 = getRandomColor(1);
    const degrees = getRandomDegrees();
    const linearGradient = createLinearGradient(color1.hslaString, color2.hslaString, degrees);
    const boxShadow1 = copyColor(color1, .2);
    const boxShadow2 = copyColor(color2, .2);

    const blobColors: BlobColors = {
        color1: color1,
        color2: color2,
        backgroundColor: color1.hslaString,
        backgroundImage: linearGradient,
        boxShadow1: boxShadow1.hslaString,
        boxShadow2: boxShadow2.hslaString
    }
    return blobColors;
}

function getRandomColor(transparency: number): Color {
    const hue = getRandomInt(1, 358);
    const saturation = getRandomInt(30, 100);
    const luminosity = getRandomInt(20, 80);
    const alpha = transparency;
    const color: Color = {
        h: hue,
        s: saturation,
        l: luminosity,
        a: alpha,
        hslaString: ""
    }
    color.hslaString = colorToHslaString(color);
    return color;
}

function copyColor(color: Color, transparency: number): Color {
    const copiedColor: Color = {
        h: color.h,
        s: color.s,
        l: color.l,
        a: transparency,
        hslaString: ""
    }
    copiedColor.hslaString = colorToHslaString(copiedColor)
    return copiedColor;
}

function colorToHslaString(color: Color): string {
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${color.a})`
}

function getRandomDegrees(): number {
    return Math.floor(Math.random() * (360))
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDecimal(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

function createLinearGradient(color1: string, color2: string, degrees: number): string {
    return `linear-gradient(${degrees}deg, ${color1} 0%, ${color2} 100%)`
}

function generateSound(params: GenerateSoundParameters) {
    let gainValue = params.baseGainMultiplier * window.BlobiverseContext.Volume;
    // Sets minimum volume except when muted
    if (gainValue < .0025 && gainValue > 0.0001) {
        gainValue = .0025
    }
    // This protects from uncomfortably loud sounds
    if (gainValue > .005 && params.frequency > 400) {
        gainValue = .005
    }

    let o = params.audioContext.createOscillator();
    let g = params.audioContext.createGain();
    o.type = params.contextType;
    o.connect(g)
    o.frequency.value = params.frequency;
    g.gain.value = gainValue;
    g.connect(params.audioContext.destination)
    o.start(0);

    g.gain.exponentialRampToValueAtTime(
        0.00001, params.audioContext.currentTime + params.duration
    )
}

function getRandomNoteAsFrequency(): number {
    let keyIndex = getRandomInt(0,11);
    let octaveIndex= getRandomInt(2,6);
    let key = Object.values(window.BlobiverseContext.NotesAsFrequencies)[keyIndex];
    let frequency = key[octaveIndex];
    return frequency;
}

function getRandomAudioContextType(): AudioContextType {
    const types: AudioContextTypesLookup = {
        1: "sine",
        2: "triangle"
    }
    const randomTypeKey = getRandomInt(1, 2);
    return types[randomTypeKey];
}

function generateAudioClickEvent(blobWidth: number, blobMaxWidth: number): (event: Event) => void {
    const widthAsPercentOfMax = blobWidth / blobMaxWidth;
    const maxFrequency = 800 - (blobWidth * 2)

    const frequency = getRandomDecimal(100, maxFrequency);
    // const frequency = getRandomNoteAsFrequency();
    const contextType = getRandomAudioContextType();

    const duration = getRandomDecimal(2, 8 * widthAsPercentOfMax);

    function startButtonOnClick(event: Event) {
        event.preventDefault()

        if (!window.BlobiverseContext.BlobAudioContext) {
            window.BlobiverseContext.BlobAudioContext = new AudioContext();
        }

        let gain = widthAsPercentOfMax;

        const GenerateSoundParameters = {
            audioContext: window.BlobiverseContext.BlobAudioContext,
            frequency: frequency,
            contextType: contextType,
            duration: duration,
            baseGainMultiplier: gain
        }
        generateSound(GenerateSoundParameters)
    }

    return startButtonOnClick;
}

main();