// ========================================
// ELEMENTS
// ========================================

const peopleContainer =
    document.getElementById("peopleContainer");

const addPersonBtn =
    document.getElementById("addPersonBtn");

const generateAllBtn =
    document.getElementById("generateAllBtn");

const downloadAllBtn =
    document.getElementById("downloadAllBtn");

const canvas =
    document.getElementById("designCanvas");

const ctx =
    canvas.getContext("2d");

const previewStatus =
    document.getElementById("previewStatus");


// ========================================
// SETTINGS
// ========================================

const WIDTH = 1080;
const HEIGHT = 1080;


// ========================================
// TEMPLATE
// ========================================

const template = new Image();

template.src = "./assets/template.jpeg";


// ========================================
// GENERATED DESIGNS
// ========================================

let generatedDesigns = [];


// ========================================
// PERSON DATA
// ========================================

let personCount = 0;

// ========================================
// UPDATE ACTION BUTTONS
// ========================================

function updateActionButtons() {

    const people =
        document.querySelectorAll(".person-card");

    const count =
        people.length;


    if (count <= 1) {

        generateAllBtn.textContent =
            "Generate";

        downloadAllBtn.textContent =
            "Download PNG";

    }

    else {

        generateAllBtn.textContent =
            "Generate All";

        downloadAllBtn.textContent =
            "Download All ZIP";

    }

}


// ========================================
// ADD PERSON
// ========================================

function addPerson() {

    personCount++;

    const card =
        document.createElement("div");

    card.className = "person-card";

    card.dataset.person =
        personCount;


    card.innerHTML = `

        <div class="person-header">

            <h3>
                Person ${personCount}
            </h3>

            <button
                type="button"
                class="remove-btn"
            >
                Remove
            </button>

        </div>


        <div class="form-group">

            <label>
                Photo
            </label>

            <input
                type="file"
                class="photo-input"
                accept="image/*"
            >

        </div>


        <div class="form-group">

            <label>
                Name
            </label>

            <input
                type="text"
                class="name-input"
                placeholder="e.g. Mr Ibrahim Abdullahi"
            >

        </div>


        <div class="form-group">

            <label>
                Title
            </label>

            <input
                type="text"
                class="title-input"
                placeholder="e.g. Associate Chartered Accountant"
            >

        </div>


        <div class="form-group">

            <label>
                Membership Number
            </label>

            <input
                type="text"
                class="membership-input"
                placeholder="e.g. MB-0034"
            >

        </div>

    `;


    peopleContainer.appendChild(card);


    // Remove button

    const removeBtn =
        card.querySelector(".remove-btn");


    removeBtn.addEventListener(
        "click",
        function () {

            card.remove();

            updatePersonNumbers();

        }
    );
    updateActionButtons();

    removeBtn.addEventListener(
    "click",
    function () {

            card.remove();

            updatePersonNumbers();

            updateActionButtons();

        }
    );


    updateActionButtons();
    
}


// ========================================
// UPDATE PERSON NUMBERS
// ========================================

function updatePersonNumbers() {

    const cards =
        document.querySelectorAll(".person-card");


    cards.forEach(
        (card, index) => {

            card.querySelector("h3")
                .textContent =
                `Person ${index + 1}`;

        }
    );

}


// ========================================
// READ IMAGE
// ========================================

function readImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            resolve(image);

                        };


                    image.onerror =
                        reject;


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


// ========================================
// DRAW IMAGE WITH COVER CROP
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

        sourceHeight =
            image.height;

        sourceWidth =
            image.height * boxRatio;

        sourceX =
            (image.width - sourceWidth) / 2;

        sourceY = 0;

    }

    else {

        sourceWidth =
            image.width;

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
// DRAW TEXT WITH AUTO-SHRINK
// ========================================

function drawFittedText(
    text,
    x,
    y,
    maxWidth,
    startingSize,
    weight = "bold"
) {

    let fontSize =
        startingSize;


    do {

        ctx.font =
            `${weight} ${fontSize}px Arial`;

        fontSize--;

    }

    while (
        ctx.measureText(text).width >
        maxWidth &&
        fontSize > 15
    );


    ctx.fillText(
        text,
        x,
        y
    );

}


// ========================================
// GENERATE DESIGN
// ========================================

async function generateDesign(person) {

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // ====================================
    // TEMPLATE
    // ====================================

    ctx.drawImage(
        template,
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // ====================================
    // PHOTO
    // ====================================

    const photoX = 322;

    const photoY = 47;

    const photoWidth = 680;

    const photoHeight = 681;


    drawImageCover(

        person.photo,

        photoX,
        photoY,

        photoWidth,
        photoHeight

    );


    // ====================================
    // MEMBERSHIP NUMBER
    // ====================================

    ctx.save();


    ctx.fillStyle =
        "#000000";


    ctx.font =
        "bold 45px Arial";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.translate(
        112,
        440
    );


    ctx.rotate(
        -Math.PI / 2
    );


    ctx.fillText(
        person.membership,
        0,
        0
    );


    ctx.restore();


    // ====================================
    // NAME
    // ====================================

    ctx.save();


    ctx.fillStyle =
        "#ffffff";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    drawFittedText(

        person.name,

        680,

        870,

        600,

        48,

        "bold"

    );


    ctx.restore();


    // ====================================
    // TITLE
    // ====================================

    ctx.save();


    ctx.fillStyle =
        "#ffffff";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    drawFittedText(

        person.title,

        680,

        925,

        700,

        38,

        "bold"

    );


    ctx.restore();


    // ====================================
    // RETURN IMAGE
    // ====================================

    return canvas.toDataURL(
        "image/png"
    );

}


// ========================================
// GET PEOPLE
// ========================================

async function getPeople() {

    const cards =
        document.querySelectorAll(
            ".person-card"
        );


    const people = [];


    for (const card of cards) {

        const photoFile =
            card.querySelector(
                ".photo-input"
            ).files[0];


        const name =
            card.querySelector(
                ".name-input"
            ).value.trim();


        const title =
            card.querySelector(
                ".title-input"
            ).value.trim();


        const membership =
            card.querySelector(
                ".membership-input"
            ).value.trim();


        if (!photoFile) {

            alert(
                "Please upload a photo for every person."
            );

            return null;

        }


        if (!name) {

            alert(
                "Please enter a name for every person."
            );

            return null;

        }


        if (!title) {

            alert(
                "Please enter a title for every person."
            );

            return null;

        }


        if (!membership) {

            alert(
                "Please enter a membership number for every person."
            );

            return null;

        }


        const photo =
            await readImage(photoFile);


        people.push({

            photo,
            name,
            title,
            membership

        });

    }


    return people;

}


// ========================================
// GENERATE ALL
// ========================================

generateAllBtn.addEventListener(
    "click",
    async function () {

        const people =
            await getPeople();


        if (!people) {
            return;
        }


        if (people.length === 0) {

            alert(
                "Please add at least one person."
            );

            return;

        }


        generatedDesigns = [];


        previewStatus.textContent =
            "Generating...";


        for (
            let i = 0;
            i < people.length;
            i++
        ) {

            const result =
                await generateDesign(
                    people[i]
                );


            generatedDesigns.push({

                name: people[i].name,

                data: result

            });


            // Keep last generated design visible

            if (
                i === people.length - 1
            ) {

                previewStatus.textContent =
                    `${people.length} design(s) generated`;

            }

        }


        downloadAllBtn.disabled =
            false;

    }
);


// ========================================
// DOWNLOAD
// ========================================

downloadAllBtn.addEventListener(
    "click",
    async function () {

        if (
            generatedDesigns.length === 0
        ) {

            return;

        }


        // ====================================
        // SINGLE PERSON
        // ====================================

        if (
            generatedDesigns.length === 1
        ) {

            const design =
                generatedDesigns[0];


            const link =
                document.createElement("a");


            link.href =
                design.data;


            const safeName =
                design.name
                    .replace(
                        /[^a-z0-9]/gi,
                        "_"
                    );


            link.download =
                `${safeName}.png`;


            link.click();


            return;

        }


        // ====================================
        // MULTIPLE PEOPLE
        // ====================================

        const zip =
            new JSZip();


        generatedDesigns.forEach(
            (design, index) => {

                const base64 =
                    design.data
                        .split(",")[1];


                const safeName =
                    design.name
                        .replace(
                            /[^a-z0-9]/gi,
                            "_"
                        );


                zip.file(

                    `${index + 1}_${safeName}.png`,

                    base64,

                    {
                        base64: true
                    }

                );

            }
        );


        const zipBlob =
            await zip.generateAsync({
                type: "blob"
            });


        const url =
            URL.createObjectURL(
                zipBlob
            );


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "accountant-show-designs.zip";


        link.click();


        URL.revokeObjectURL(url);

    }
);


// ========================================
// ADD PERSON BUTTON
// ========================================

addPersonBtn.addEventListener(
    "click",
    function () {

        addPerson();

    }
);


// ========================================
// INITIAL PERSON
// ========================================

addPerson();