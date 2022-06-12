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
    var modalBaseHTML = "\n        <div class='modal-container'>\n            <div class='modal-background'></div>\n            <div class='modal'>\n                <label>Quantity</label>\n                <input\n                    type='range'\n                    min='1'\n                    max='300'\n                    value= ".concat(window.ModalParameters.quantity, "\n                    class='modal-slider'\n                    id='quantity-input'\n                    name='quantity'>\n                </input>\n                <label>Density</label>\n                <input\n                    type='range'\n                    min='0'\n                    max='100'\n                    value= ").concat(window.ModalParameters.density, "\n                    class='modal-slider reverse-display'\n                    id='density-input'\n                    name='density'>\n                </input>\n                <label>Max Size</label>\n                <input\n                    type='range'\n                    min='1'\n                    max='300'\n                    value= ").concat(window.ModalParameters.maxSize, "\n                    class='modal-slider'\n                    id='max-size-input'\n                    name='maxSize'>\n                </input>\n                <label>Speed</label>\n                <input\n                    type='range'\n                    min='5'\n                    max='60'\n                    value= ").concat(window.ModalParameters.speed, "\n                    class='modal-slider reverse-display'\n                    id='speed-input'\n                    name='speed'>\n                </input>\n                <button id='modal-button' type='button'></button>\n            </div>\n        </div>\n    ");
    if (!main)
        return;
    main.innerHTML = modalBaseHTML;
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
    modalContainer.classList.add('hide');
}
function onParameterInput(event) {
    var target = event.target;
    var key = target.name;
    var value = target.value;
    console.log(key, value);
    window.ModalParameters[key] = parseInt(value);
}
function onClickGenerateBtn() {
    closeModal();
    drawBlobs();
}
function drawBlobs() {
    var circlePositions = new Array();
    var main = document.querySelector('.main');
    if (!main)
        return;
    var mainWidth = ((main === null || main === void 0 ? void 0 : main.clientWidth) || 0);
    var mainHeight = ((main === null || main === void 0 ? void 0 : main.clientHeight) || 0);
    var tryDrawCount = 0;
    var _loop_1 = function (i) {
        tryDrawCount++;
        var circlePosition = generateCirclePosition(mainWidth, mainHeight);
        var positionIsAvailable = isCirclePositionAvailable(circlePosition, circlePositions);
        if (positionIsAvailable == false) {
            i--;
            return out_i_1 = i, "continue";
        }
        var circle = createCircle(circlePosition);
        circlePositions.push(circle.position);
        setTimeout(function () {
            circle.htmlElement.style.transition = "opacity ".concat(window.ModalParameters["speed"], "s");
            circle.htmlElement.style.transition = "transform ".concat(window.ModalParameters["speed"], "s");
            circle.htmlElement.style.transitionTimingFunction = "ease-in-out";
            circle.htmlElement.style.transform = "scale(0) rotate(20deg)";
            circle.htmlElement.style.opacity = ".2";
            circle.htmlContainer.append(circle.htmlElement);
            main === null || main === void 0 ? void 0 : main.append(circle.htmlContainer);
            setTimeout(function () {
                circle.htmlElement.style.transform = "scale(1) rotate(120deg)";
                circle.htmlElement.style.opacity = "1";
            }, 100);
        }, 100 * i);
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < window.ModalParameters["quantity"] && tryDrawCount < 1000; i++) {
        _loop_1(i);
        i = out_i_1;
    }
    console.log(circlePositions);
}
function generateCirclePosition(containerWidth, containerHeight) {
    var randomSize = getRandomSize();
    var randomPosition = getRandomOffset();
    var yOffsetPixels = randomPosition.yOffset * containerHeight;
    var xOffsetPixels = randomPosition.xOffset * containerWidth;
    var yCenter = yOffsetPixels + (randomSize.height / 2);
    var xCenter = xOffsetPixels + (randomSize.width / 2);
    var circlePosition = {
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
    return circlePosition;
}
function isCirclePositionAvailable(newPosition, circlePositions) {
    for (var _i = 0, circlePositions_1 = circlePositions; _i < circlePositions_1.length; _i++) {
        var circle = circlePositions_1[_i];
        var centerDistance = getDistance(newPosition.center, circle.center) - window.ModalParameters["density"];
        var radiusA = newPosition.radius;
        var radiusB = circle.radius;
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
function createCircle(circlePosition) {
    var blobContainer = document.createElement('div');
    blobContainer.classList.add('blob-container-1');
    var circleElement = document.createElement('div');
    circleElement.classList.add('blob-1');
    circleElement.style.width = "".concat(circlePosition.width, "px");
    circleElement.style.height = "".concat(circlePosition.height, "px");
    circleElement.style.top = "".concat(circlePosition.yTop, "px");
    circleElement.style.left = "".concat(circlePosition.xLeft, "px");
    var circleShape = getRandomShape();
    var circleShapeString = circleShapeToString(circleShape);
    circleElement.style.borderRadius = circleShapeString;
    var circleColors = getRandomCircleColors();
    circleElement.style.backgroundColor = circleColors.backgroundColor;
    circleElement.style.backgroundImage = circleColors.backgroundImage;
    var boxShadowColor1 = colorToHslaString(circleColors.color1, .20);
    var boxShadowColor2 = colorToHslaString(circleColors.color2, .20);
    circleElement.style.boxShadow =
        "0 0 30px 10px hsla(0, 100%, 98%, .25),\n        0 0 60px 20px ".concat(boxShadowColor1, ",\n        0 0 90px 30px ").concat(boxShadowColor2);
    circleElement.addEventListener("click", function (e) {
        circleElement.style.transition = "all .2s ease-in-out";
        circleElement.style.boxShadow =
            "0 0 35px 15px hsla(0, 100%, 98%, .5),\n        0 0 65px 25px ".concat(boxShadowColor1, ",\n        0 0 95px 35px ").concat(boxShadowColor2);
        circleElement.style.transform = "scale(1.1) rotate(120deg)";
        setTimeout(function () {
            circleElement.style.transform = "scale(1) rotate(120deg)";
            circleElement.style.boxShadow =
                "0 0 30px 10px hsla(0, 100%, 98%, .25),\n            0 0 60px 20px ".concat(boxShadowColor1, ",\n            0 0 90px 30px ").concat(boxShadowColor2);
        }, .2 * 1000);
    });
    var circleOnClickEvent = generateAudioClickEvent(circlePosition.width, window.ModalParameters["maxSize"]);
    circleElement.addEventListener("click", circleOnClickEvent);
    var circle = {
        htmlContainer: blobContainer,
        htmlElement: circleElement,
        position: __assign({}, circlePosition),
        shape: circleShape,
        colors: circleColors
    };
    return circle;
}
function getRandomShape() {
    var circleShape = {
        1: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        2: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        3: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        4: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        5: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        6: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        7: Math.floor(Math.random() * (80 - 20 + 1) + 20),
        8: Math.floor(Math.random() * (80 - 20 + 1) + 20),
    };
    return circleShape;
}
function circleShapeToString(circleShape) {
    return "".concat(circleShape[1], "% ").concat(circleShape[2], "% ").concat(circleShape[3], "% ").concat(circleShape[4], "% / ").concat(circleShape[5], "% ").concat(circleShape[6], "% ").concat(circleShape[7], "% ").concat(circleShape[8], "%");
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
function getRandomCircleColors() {
    var color1 = getRandomColor(1);
    var color1String = colorToHslaString(color1, 1);
    var color2 = getRandomColor(1);
    var color2String = colorToHslaString(color2, 1);
    var degrees = getRandomDegrees();
    var linearGradient = createLinearGradient(color1String, color2String, degrees);
    var circleColors = {
        color1: color1,
        color2: color2,
        backgroundColor: color1String,
        backgroundImage: linearGradient
    };
    return circleColors;
}
function getRandomColor(transparency) {
    var color = {
        h: getRandomInt(1, 358),
        s: getRandomInt(30, 100),
        l: getRandomInt(20, 80),
        a: transparency
    };
    return color;
}
function colorToHslaString(color, transparency) {
    return "hsla(".concat(color.h, ", ").concat(color.s, "%, ").concat(color.l, "%, ").concat(transparency, ")");
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
function generateSound(context, frequency, type, length) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.type = type;
    o.connect(g);
    o.frequency.value = frequency;
    g.gain.value = .01;
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + length);
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
    var randomFrequency1 = getRandomDecimal(100, maxFrequency);
    var randomFrequency2 = getRandomDecimal(100, maxFrequency);
    var randomFrequency3 = getRandomDecimal(100, maxFrequency);
    var randomFrequency4 = getRandomDecimal(100, maxFrequency);
    var contextType = getRandomAudioContextType();
    var contextType2 = getRandomAudioContextType();
    var length = getRandomDecimal(1, 8 * widthAsPercentOfMax);
    var randomDelay1 = getRandomInt(1, 1);
    var randomDelay2 = getRandomInt(1, 1);
    var randomDelay3 = getRandomInt(1, 1);
    var randomDelay4 = getRandomInt(1, 1);
    function startButtonOnClick(event) {
        event.preventDefault();
        if (!window.BlobAudioContext) {
            window.BlobAudioContext = new AudioContext();
        }
        var width = blobWidth;
        console.log(blobWidth);
        setTimeout(function () {
            console.log(randomFrequency1);
            generateSound(window.BlobAudioContext, randomFrequency1, contextType, length);
        }, randomDelay1);
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
export {};
