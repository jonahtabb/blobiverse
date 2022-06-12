var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function drawStartModal() {
    window.ModalParameters = {
        "quantity": 100,
        "density": 20,
        "maxSize": 100,
        "speed": 20
    };
    var main = document.getElementsByClassName('main')[0];
    var modalBaseHTML = "\n        <div class='modal-container'>\n            <div class='modal-background'></div>\n            <div class='modal'>\n                <h1>Blobiverse Generator</h1>\n                <label>Quantity</label>\n                <input\n                    type='range'\n                    min='1'\n                    max='300'\n                    value= ".concat(window.ModalParameters.quantity, "\n                    class='modal-slider'\n                    id='quantity-input'\n                    name='quantity'>\n                </input>\n                <label>Density</label>\n                <input\n                    type='range'\n                    min='0'\n                    max='100'\n                    value= ").concat(window.ModalParameters.density, "\n                    class='modal-slider reverse-display'\n                    id='density-input'\n                    name='density'>\n                </input>\n                <label>Max Size</label>\n                <input\n                    type='range'\n                    min='1'\n                    max='300'\n                    value= ").concat(window.ModalParameters.maxSize, "\n                    class='modal-slider'\n                    id='max-size-input'\n                    name='maxSize'>\n                </input>\n                <label>Speed</label>\n                <input\n                    type='range'\n                    min='5'\n                    max='60'\n                    value= ").concat(window.ModalParameters.speed, "\n                    class='modal-slider reverse-display'\n                    id='speed-input'\n                    name='speed'>\n                </input>\n            </div>\n        </div>\n    ");
    if (!main)
        return;
    main.innerHTML = modalBaseHTML;
    window.IsModalOpen = true;
    var generateButton = document.createElement('button');
    generateButton.id = 'modal-button';
    generateButton.type = 'button';
    main.append(generateButton);
    setTimeout(function () { generateButton.style.opacity = "1"; }, 100);
    var modalContainer = document.getElementsByClassName('modal-container')[0];
    if (modalContainer) {
        setTimeout(function () { modalContainer.style.opacity = "1"; }, 100);
    }
    var modalButton = document.getElementById('modal-button');
    if (modalButton) {
        modalButton.onclick = onClickGenerateBtn;
    }
    var quantityInput = document.getElementById('quantity-input');
    if (quantityInput) {
        quantityInput.oninput = onParameterInput;
    }
    var densityInput = document.getElementById('density-input');
    if (densityInput) {
        densityInput.oninput = onParameterInput;
    }
    var maxSizeInput = document.getElementById('max-size-input');
    if (maxSizeInput) {
        maxSizeInput.oninput = onParameterInput;
    }
    var speedInput = document.getElementById('speed-input');
    if (speedInput) {
        speedInput.oninput = onParameterInput;
    }
}
function closeModal() {
    var modalContainer = document.getElementsByClassName('modal-container')[0];
    if (!modalContainer)
        return;
    window.IsModalOpen = false;
    modalContainer.classList.add('hide');
}
function openModal() {
    var modalContainer = document.getElementsByClassName('modal-container')[0];
    if (!modalContainer)
        return;
    window.IsModalOpen = true;
    modalContainer.classList.remove('hide');
}
function onParameterInput(event) {
    var target = event.target;
    var key = target.name;
    var value = target.value;
    console.log(key, value);
    window.ModalParameters[key] = parseInt(value);
}
function onClickGenerateBtn() {
    var IsModalOpen = window.IsModalOpen;
    if (IsModalOpen) {
        closeModal();
        drawBlobs();
    }
    else {
        clearBlobs();
        openModal();
    }
}
function drawBlobs() {
    var blobPositions = new Array();
    var main = document.querySelector('.main');
    if (!main)
        return;
    var mainWidth = ((main === null || main === void 0 ? void 0 : main.clientWidth) || 0);
    var mainHeight = ((main === null || main === void 0 ? void 0 : main.clientHeight) || 0);
    var tryDrawCount = 0;
    for (var i = 0; i < window.ModalParameters["quantity"] && tryDrawCount < 1000; i++) {
        tryDrawCount++;
        var blobPosition = generateBlobPosition(mainWidth, mainHeight);
        var positionIsAvailable = isBlobPositionAvailable(blobPosition, blobPositions);
        if (positionIsAvailable == false) {
            i--;
            continue;
        }
        var blob = createBlob(blobPosition);
        blobPositions.push(blob.position);
        insertBlob(main, blob, i);
    }
    console.log(blobPositions);
}
function clearBlobs() {
    var blobs = document.getElementsByClassName('blob-container-1');
    var blobsArray = Array.from(blobs);
    blobsArray.forEach(function (element) { return element.remove(); });
}
function insertBlob(parentElement, blob, blobIndex) {
    setTimeout(function () {
        blob.htmlElement.style.transition = "opacity ".concat(window.ModalParameters["speed"], "s");
        blob.htmlElement.style.transition = "transform ".concat(window.ModalParameters["speed"], "s");
        blob.htmlElement.style.transitionTimingFunction = "ease-in-out";
        blob.htmlElement.style.transform = "scale(0) rotate(20deg)";
        blob.htmlElement.style.opacity = ".2";
        blob.htmlContainer.append(blob.htmlElement);
        parentElement === null || parentElement === void 0 ? void 0 : parentElement.append(blob.htmlContainer);
        setTimeout(function () {
            blob.htmlElement.style.transform = "scale(1) rotate(120deg)";
            blob.htmlElement.style.opacity = "1";
        }, 100);
    }, 100 * blobIndex);
    var blobElement = blob.htmlElement;
    blobElement.addEventListener("click", function (event) {
        var currentWidth = blob.position.width;
        if (event.target instanceof HTMLElement) {
            currentWidth = event.target.clientWidth;
        }
        console.dir(event.target);
        var currentScale = currentWidth / blob.position.width;
        var clickScale = currentScale * 1.1;
        blobElement.style.transition = "all .2s ease-out";
        blobElement.style.boxShadow =
            "0 0 35px 15px hsla(0, 100%, 98%, .5),\n        0 0 65px 25px ".concat(blob.colors.boxShadow1, ",\n        0 0 95px 35px ").concat(blob.colors.boxShadow2);
        blobElement.style.transform = "scale(".concat(clickScale, ") rotate(120deg)");
        setTimeout(function () {
            var widthAsPercentOfMax = blob.position.width / window.ModalParameters["maxSize"];
            var duration = Math.floor(5 * widthAsPercentOfMax);
            if (duration < 2) {
                duration = 2;
            }
            console.log(duration);
            blobElement.style.transition = "all ".concat(duration, "s ease-out");
            blobElement.style.transform = "scale(".concat(currentScale, ") rotate(120deg)");
            blobElement.style.boxShadow =
                "0 0 30px 10px hsla(0, 100%, 98%, .25),\n            0 0 60px 20px ".concat(blob.colors.boxShadow1, ",\n            0 0 90px 30px ").concat(blob.colors.boxShadow2);
        }, .2 * 1000);
    });
    var blobOnClickEvent = generateAudioClickEvent(blob.position.width, window.ModalParameters["maxSize"]);
    blobElement.addEventListener("click", blobOnClickEvent);
}
function generateBlobPosition(containerWidth, containerHeight) {
    var randomSize = getRandomSize();
    var randomPosition = getRandomOffset();
    var yOffsetPixels = randomPosition.yOffset * containerHeight;
    var xOffsetPixels = randomPosition.xOffset * containerWidth;
    var yCenter = yOffsetPixels + (randomSize.height / 2);
    var xCenter = xOffsetPixels + (randomSize.width / 2);
    var blobPosition = {
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
    };
    return blobPosition;
}
function isBlobPositionAvailable(newPosition, blobPositions) {
    for (var _i = 0, blobPositions_1 = blobPositions; _i < blobPositions_1.length; _i++) {
        var blob = blobPositions_1[_i];
        var centerDistance = getDistance(newPosition.center, blob.center) - window.ModalParameters["density"];
        var radiusA = newPosition.radius;
        var radiusB = blob.radius;
        var radiiSumSquared = (radiusA + radiusB) ^ 2;
        if (centerDistance <= radiiSumSquared) {
            return false;
        }
    }
    return true;
}
function getDistance(pointA, pointB) {
    var xPointA = pointA.xCenter;
    var yPointA = pointA.yCenter;
    var xPointB = pointB.xCenter;
    var yPointB = pointB.yCenter;
    var xDist = Math.abs(xPointA - xPointB);
    var yDist = Math.abs(yPointA - yPointB);
    return Math.sqrt((xDist * xDist) + (yDist * yDist));
}
function createBlob(blobPosition) {
    var blobContainer = document.createElement('div');
    blobContainer.classList.add('blob-container-1');
    var blobElement = document.createElement('div');
    blobElement.classList.add('blob-1');
    blobElement.style.width = "".concat(blobPosition.width, "px");
    blobElement.style.height = "".concat(blobPosition.height, "px");
    blobElement.style.top = "".concat(blobPosition.yTop, "px");
    blobElement.style.left = "".concat(blobPosition.xLeft, "px");
    var blobShape = getRandomShape();
    blobElement.style.borderRadius = blobShape.borderRadiusString;
    var blobColors = getRandomBlobColors();
    blobElement.style.backgroundColor = blobColors.backgroundColor;
    blobElement.style.backgroundImage = blobColors.backgroundImage;
    blobElement.style.boxShadow =
        "0 0 30px 10px hsla(0, 100%, 98%, .25),\n        0 0 60px 20px ".concat(blobColors.boxShadow1, ",\n        0 0 90px 30px ").concat(blobColors.boxShadow2);
    var blob = {
        htmlContainer: blobContainer,
        htmlElement: blobElement,
        position: __assign({}, blobPosition),
        shape: blobShape,
        colors: blobColors
    };
    return blob;
}
function getRandomShape() {
    var blobShape = {
        1: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        2: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        3: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        4: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        5: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        6: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        7: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        8: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        borderRadiusString: "",
    };
    blobShape.borderRadiusString = "".concat(blobShape[1], "% ").concat(blobShape[2], "% ").concat(blobShape[3], "% ").concat(blobShape[4], "% / ").concat(blobShape[5], "% ").concat(blobShape[6], "% ").concat(blobShape[7], "% ").concat(blobShape[8], "%");
    return blobShape;
}
function getRandomSize() {
    var randomSize = Math.random() * window.ModalParameters["maxSize"];
    return { width: randomSize, height: randomSize };
}
function getRandomOffset() {
    var xRandomOffset = Math.random();
    var yRandomOffset = Math.random();
    return { xOffset: xRandomOffset, yOffset: yRandomOffset };
}
function getRandomBlobColors() {
    var color1 = getRandomColor(1);
    var color2 = getRandomColor(1);
    var degrees = getRandomDegrees();
    var linearGradient = createLinearGradient(color1.hslaString, color2.hslaString, degrees);
    var boxShadow1 = copyColor(color1, .2);
    var boxShadow2 = copyColor(color2, .2);
    var blobColors = {
        color1: color1,
        color2: color2,
        backgroundColor: color1.hslaString,
        backgroundImage: linearGradient,
        boxShadow1: boxShadow1.hslaString,
        boxShadow2: boxShadow2.hslaString
    };
    return blobColors;
}
function getRandomColor(transparency) {
    var hue = getRandomInt(1, 358);
    var saturation = getRandomInt(30, 100);
    var luminosity = getRandomInt(20, 80);
    var alpha = transparency;
    var color = {
        h: hue,
        s: saturation,
        l: luminosity,
        a: alpha,
        hslaString: ""
    };
    color.hslaString = colorToHslaString(color);
    return color;
}
function copyColor(color, transparency) {
    var copiedColor = {
        h: color.h,
        s: color.s,
        l: color.l,
        a: transparency,
        hslaString: ""
    };
    copiedColor.hslaString = colorToHslaString(copiedColor);
    return copiedColor;
}
function colorToHslaString(color) {
    return "hsla(".concat(color.h, ", ").concat(color.s, "%, ").concat(color.l, "%, ").concat(color.a, ")");
}
function getRandomDegrees() {
    return Math.floor(Math.random() * (360));
}
function createLinearGradient(color1, color2, degrees) {
    return "linear-gradient(".concat(degrees, "deg, ").concat(color1, " 0%, ").concat(color2, " 100%)");
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomDecimal(min, max) {
    return Math.random() * (max - min + 1) + min;
}
function generateSound(params) {
    var o = params.audioContext.createOscillator();
    var g = params.audioContext.createGain();
    o.type = params.contextType;
    o.connect(g);
    o.frequency.value = params.frequency;
    g.gain.value = params.gain;
    g.connect(params.audioContext.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.00001, params.audioContext.currentTime + params.duration);
}
function getRandomAudioContextType() {
    var types = {
        1: "sine",
        2: "square",
        3: "triangle"
    };
    var randomTypeKey = getRandomInt(1, 3);
    console.log("ri", randomTypeKey);
    return types[randomTypeKey];
}
function generateAudioClickEvent(blobWidth, blobMaxWidth) {
    var widthAsPercentOfMax = blobWidth / blobMaxWidth;
    var maxFrequency = 800 - (blobWidth * 2);
    var frequency = getRandomDecimal(100, maxFrequency);
    var contextType = getRandomAudioContextType();
    var duration = getRandomDecimal(2, 8 * widthAsPercentOfMax);
    function startButtonOnClick(event) {
        event.preventDefault();
        if (!window.BlobAudioContext) {
            window.BlobAudioContext = new AudioContext();
        }
        var gain = widthAsPercentOfMax * .0073;
        if (gain < .0025) {
            gain = .0025;
        }
        // This protects from uncomfortably loud sounds
        if (gain > .005 && frequency > 400) {
            gain = .005;
        }
        var GenerateSoundParameters = {
            audioContext: window.BlobAudioContext,
            frequency: frequency,
            contextType: contextType,
            duration: duration,
            gain: gain
        };
        console.log(GenerateSoundParameters);
        generateSound(GenerateSoundParameters);
    }
    return startButtonOnClick;
}
drawStartModal();
export {};
