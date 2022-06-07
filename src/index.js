function drawBlobs() {
    var blobPositions = [];
    for (var i = 0; i < 3; i++) {
        var circleOffsets = placeCircle();
    }
}
function overlapsExistingBlob(circleOffsets, blobPositions) {
    for (var i = 0; i < blobPositions.length; i++) {
    }
}
function createCircle() {
    var main = document.querySelector('.main');
    var newCircle = document.createElement('div');
    var randomSize = getRandomSize();
    var randomPosition = getRandomPosition();
    newCircle.classList.add('blob-1');
    newCircle.style.width = randomSize.width;
    newCircle.style.height = randomSize.height;
    newCircle.style.top = randomPosition.yOffset;
    newCircle.style.left = randomPosition.xOffset;
    // newCircle.style.top = "80%"
    main.appendChild(newCircle);
    var yTop = newCircle.offsetTop;
    var yBottom = newCircle.offsetTop + randomSize.height;
    var xLeft = newCircle.offsetLeft;
    var xRight = newCircle.offsetLeft + randomSize.width;
    return { htmlElement: newCircle, yTop: yTop, yBottom: yBottom, xLeft: xLeft, xRight: xRight };
}
function getRandomSize() {
    var randomSize = Math.random() * 200;
    return { width: "".concat(randomSize, "px"), height: "".concat(randomSize, "px") };
}
function getRandomPosition() {
    var xRandomOffset = Math.random() * 90;
    var yRandomOffset = Math.random() * 90;
    return { xOffset: "".concat(xRandomOffset, "VW"), yOffset: "".concat(yRandomOffset, "VH") };
}
