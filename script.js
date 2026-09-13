const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const titleInput = document.getElementById("titleInput");

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const canvas = document.getElementById("designCanvas");
const ctx = canvas.getContext("2d");


// ========================================
// CANVAS SIZE
// ========================================

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


// ========================================
// TEMPLATE
// ========================================

const template = new Image();

template.src = "./assets/template.jpeg";


// ========================================
// UPLOADED PHOTO
// ========================================

let uploadedPhoto = null;


// ========================================
// PHOTO UPLOAD
// ========================================

photoInput.addEventListener("change", function () {

    const file = photoInput.files[0];

    if (!file) {
        return;
    }


    const reader = new FileReader();


    reader.onload = function (event) {

        const image = new Image();


        image.onload = function () {

            uploadedPhoto = image;

            console.log("Photo loaded.");

        };


        image.src = event.target.result;

    };


    reader.readAsDataURL(file);

});


// ========================================
// GENERATE BUTTON
// ========================================

generateBtn.addEventListener("click", function () {

    if (!uploadedPhoto) {

        alert("Please upload a photo.");

        return;
    }


    if (!nameInput.value.trim()) {

        alert("Please enter the person's name.");

        return;
    }


    if (!titleInput.value.trim()) {

        alert("Please enter the person's title.");

        return;
    }


    generateDesign();

});


// ========================================
// GENERATE DESIGN
// ========================================

function generateDesign() {

    // Clear canvas
    ctx.clearRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );


    // ====================================
    // DRAW TEMPLATE
    // ====================================

    ctx.drawImage(
        template,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );


    // ====================================
    // PHOTO POSITION
    // ====================================

    const photoX = 322;
    const photoY = 47;

    const photoWidth = 680;
    const photoHeight = 681;


    // Draw the uploaded photo
    // while keeping its proportions.

    drawImageCover(
        uploadedPhoto,
        photoX,
        photoY,
        photoWidth,
        photoHeight
    );


    // ====================================
    // NAME
    // ====================================

    const name = nameInput.value.trim();


    ctx.save();

    ctx.font = "bold 48px Arial";

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(
        name,
        680,
        870
    );


    ctx.restore();


    // ====================================
    // TITLE
    // ====================================

    const title = titleInput.value.trim();


    ctx.save();

    ctx.font = "bold 38px Arial";

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(
        title,
        680,
        925
    );


    ctx.restore();


    // ====================================
    // ENABLE DOWNLOAD
    // ====================================

    downloadBtn.disabled = false;

}


// ========================================
// IMAGE COVER FUNCTION
// ========================================

function drawImageCover(
    image,
    x,
    y,
    width,
    height
) {

    const imageRatio =
        image.width / image.height;


    const boxRatio =
        width / height;


    let sourceWidth;
    let sourceHeight;
    let sourceX;
    let sourceY;


    if (imageRatio > boxRatio) {

        // Image is wider than the box

        sourceHeight = image.height;

        sourceWidth =
            image.height * boxRatio;

        sourceX =
            (image.width - sourceWidth) / 2;

        sourceY = 0;

    } else {

        // Image is taller than the box

        sourceWidth = image.width;

        sourceHeight =
            image.width / boxRatio;

        sourceX = 0;

        sourceY =
            (image.height - sourceHeight) / 2;

    }


    ctx.drawImage(
        image,

        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,

        x,
        y,
        width,
        height
    );

}


// ========================================
// DOWNLOAD
// ========================================

downloadBtn.addEventListener(
    "click",
    function () {

        const name =
            nameInput.value.trim();


        const safeName =
            name.replace(
                /[^a-z0-9]/gi,
                "_"
            );


        const link =
            document.createElement("a");


        link.download =
            `${safeName || "design"}.png`;


        link.href =
            canvas.toDataURL("image/png");


        link.click();

    }
);