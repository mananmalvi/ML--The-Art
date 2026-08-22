/* =====================================================
   O.R.I.O.N. ADVANCED v3
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const video =
    document.getElementById("background-video");

const button =
    document.getElementById("analyze-btn");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result-box");

const loadingText =
    document.getElementById("loading-text");

const loadingPercent =
    document.getElementById("loading-percent");

const scanStatus =
    document.getElementById("scan-status");

const clock =
    document.getElementById("utc-clock");


/* =====================================================
   VIDEO
===================================================== */

if (video) {

    video.muted = true;

    video.play().catch(() => {});

    document.addEventListener(
        "click",
        () => {

            if (video.paused) {

                video.play().catch(() => {});

            }

        },
        {
            once: true
        }
    );
}


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const now = new Date();

    const h =
        String(
            now.getUTCHours()
        ).padStart(2, "0");

    const m =
        String(
            now.getUTCMinutes()
        ).padStart(2, "0");

    const s =
        String(
            now.getUTCSeconds()
        ).padStart(2, "0");

    clock.textContent =
        `${h}:${m}:${s} UTC`;
}

setInterval(
    updateClock,
    1000
);

updateClock();


/* =====================================================
   HELPERS
===================================================== */

function value(id) {

    return parseFloat(
        document.getElementById(id).value
    );
}


function formatNumber(number) {

    return Number(number).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 3
        }
    );
}


function randomMissionId() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        code +=
            chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];

    }

    return `ORION-${code}`;
}


/* =====================================================
   PARAMETER BARS
===================================================== */

function updateParameterBars() {

    const magnitude =
        value("magnitude");

    const min =
        value("min_diameter");

    const max =
        value("max_diameter");

    const velocity =
        value("velocity");

    const distance =
        value("miss_distance");


    if (!Number.isNaN(magnitude)) {

        document.getElementById(
            "magnitude-bar"
        ).style.width =
            `${Math.min(
                100,
                Math.max(
                    5,
                    magnitude / 30 * 100
                )
            )}%`;
    }


    if (!Number.isNaN(min)) {

        document.getElementById(
            "min-bar"
        ).style.width =
            `${Math.min(
                100,
                min / 10 * 100
            )}%`;
    }


    if (!Number.isNaN(max)) {

        document.getElementById(
            "max-bar"
        ).style.width =
            `${Math.min(
                100,
                max / 20 * 100
            )}%`;
    }


    if (!Number.isNaN(velocity)) {

        document.getElementById(
            "velocity-bar"
        ).style.width =
            `${Math.min(
                100,
                velocity / 80 * 100
            )}%`;
    }


    if (!Number.isNaN(distance)) {

        const inverse =
            Math.max(
                0,
                100 -
                distance / 10000000 * 100
            );

        document.getElementById(
            "distance-bar"
        ).style.width =
            `${Math.min(
                100,
                inverse
            )}%`;
    }
}


document
    .querySelectorAll(
        ".input-box input"
    )
    .forEach(
        input => {

            input.addEventListener(
                "input",
                updateParameterBars
            );

        }
    );


/* =====================================================
   RISK BAR
===================================================== */

function setRisk(
    id,
    textId,
    amount
) {

    const bar =
        document.getElementById(id);

    const text =
        document.getElementById(textId);

    const value =
        Math.min(
            100,
            Math.max(
                0,
                amount
            )
        );

    bar.style.width =
        `${value}%`;

    if (value < 35) {

        text.textContent =
            "LOW";

    } else if (value < 65) {

        text.textContent =
            "MODERATE";

    } else {

        text.textContent =
            "HIGH";
    }
}


/* =====================================================
   LOADING ANIMATION
===================================================== */

async function runScanner() {

    const stages = [

        "ACQUIRING TARGET...",

        "READING ORBITAL PARAMETERS...",

        "CALCULATING TRAJECTORY...",

        "RUNNING AI CLASSIFIER...",

        "EVALUATING IMPACT RISK...",

        "FINALIZING ASSESSMENT..."

    ];


    for (
        let i = 0;
        i < stages.length;
        i++
    ) {

        loadingText.textContent =
            stages[i];

        const percent =
            Math.round(
                ((i + 1) /
                stages.length) *
                100
            );

        loadingPercent.textContent =
            `${percent}%`;

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    250
                )
        );
    }
}


/* =====================================================
   ANALYZE
===================================================== */

async function analyze() {

    const magnitude =
        value("magnitude");

    const minDiameter =
        value("min_diameter");

    const maxDiameter =
        value("max_diameter");

    const velocity =
        value("velocity");

    const missDistance =
        value("miss_distance");


    /* VALIDATION */

    const values = [

        magnitude,
        minDiameter,
        maxDiameter,
        velocity,
        missDistance

    ];


    if (
        values.some(
            v => Number.isNaN(v)
        )
    ) {

        scanStatus.textContent =
            "INPUT ERROR — COMPLETE ALL PARAMETERS";

        return;
    }


    if (
        minDiameter > maxDiameter
    ) {

        scanStatus.textContent =
            "INPUT ERROR — MIN DIAMETER EXCEEDS MAXIMUM";

        return;
    }


    /* RESET */

    result.classList.remove(
        "show",
        "hazardous"
    );


    loading.classList.add(
        "active"
    );


    button.disabled = true;

    button.style.opacity =
        ".45";


    scanStatus.textContent =
        "ORBITAL ANALYSIS RUNNING";


    try {

        /* RUN VISUAL SCANNER */

        const scanner =
            runScanner();


        /* BACKEND */

        const response =
            await fetch(
                "/predict",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            magnitude:
                                magnitude,

                            min_diameter:
                                minDiameter,

                            max_diameter:
                                maxDiameter,

                            velocity:
                                velocity,

                            miss_distance:
                                missDistance

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Backend connection failed."
            );
        }


        const data =
            await response.json();


        await scanner;


        if (!data.success) {

            throw new Error(
                data.error ||
                "Prediction failed."
            );
        }


        /* =================================================
           CLASSIFICATION
        ================================================= */

        const hazardous =
            Number(
                data.prediction
            ) === 1;


        const confidence =
            data.confidence !== null &&
            data.confidence !== undefined
                ? data.confidence
                : null;


        /* =================================================
           RESULT ELEMENTS
        ================================================= */

        const resultText =
            document.getElementById(
                "result-text"
            );

        const classification =
            document.getElementById(
                "classification"
            );

        const resultMessage =
            document.getElementById(
                "result-message"
            );

        const status =
            document.getElementById(
                "orbital-status"
            );


        /* =================================================
           SAFE
        ================================================= */

        if (!hazardous) {

            result.classList.remove(
                "hazardous"
            );

            resultText.textContent =
                "SAFE";

            classification.textContent =
                "LOW RISK";

            resultMessage.textContent =
                "Orbital parameters remain within the model's safe classification.";

            status.textContent =
                "TRAJECTORY STABLE";

        }


        /* =================================================
           HAZARDOUS
        ================================================= */

        else {

            result.classList.add(
                "hazardous"
            );

            resultText.textContent =
                "HAZARDOUS";

            classification.textContent =
                "HIGH RISK";

            resultMessage.textContent =
                "Model classification indicates a potentially hazardous near-Earth object.";

            status.textContent =
                "THREAT DETECTED";
        }


        /* =================================================
           BASIC DATA
        ================================================= */

        document.getElementById(
            "result-velocity"
        ).textContent =
            `${formatNumber(velocity)} KM/S`;


        document.getElementById(
            "result-diameter"
        ).textContent =
            `${formatNumber(minDiameter)} – ${formatNumber(maxDiameter)} KM`;


        document.getElementById(
            "result-distance"
        ).textContent =
            `${formatNumber(missDistance)} KM`;


        /* =================================================
           MISSION ID
        ================================================= */

        document.getElementById(
            "mission-id"
        ).textContent =
            randomMissionId();


        const now =
            new Date();


        document.getElementById(
            "analysis-time"
        ).textContent =
            now.toLocaleTimeString(
                "en-US",
                {
                    hour12: false
                }
            );


        /* =================================================
           MODEL CONFIDENCE
        ================================================= */

        const confidenceValue =
            confidence !== null
                ? confidence
                : 0;


        document.getElementById(
            "confidence"
        ).textContent =
            `${confidenceValue.toFixed(1)}%`;


        document.getElementById(
            "confidence-progress"
        ).style.width =
            `${confidenceValue}%`;


        /* =================================================
           RISK CALCULATION
        ================================================= */

        const velocityRisk =
            Math.min(
                100,
                velocity / 80 * 100
            );


        const sizeRisk =
            Math.min(
                100,
                maxDiameter / 20 * 100
            );


        const distanceRisk =
            Math.min(
                100,
                Math.max(
                    0,
                    100 -
                    missDistance /
                    10000000 *
                    100
                )
            );


        const magnitudeRisk =
            Math.min(
                100,
                Math.max(
                    0,
                    100 -
                    magnitude /
                    30 *
                    100
                )
            );


        setRisk(
            "velocity-risk",
            "velocity-risk-text",
            velocityRisk
        );


        setRisk(
            "size-risk",
            "size-risk-text",
            sizeRisk
        );


        setRisk(
            "distance-risk",
            "distance-risk-text",
            distanceRisk
        );


        setRisk(
            "magnitude-risk",
            "magnitude-risk-text",
            magnitudeRisk
        );


        /* =================================================
           THREAT INDEX
        ================================================= */

        let threatIndex;


        if (hazardous) {

            threatIndex =
                Math.round(
                    (
                        velocityRisk +
                        sizeRisk +
                        distanceRisk +
                        magnitudeRisk
                    ) / 4
                );

            threatIndex =
                Math.max(
                    60,
                    Math.min(
                        98,
                        threatIndex
                    )
                );

        } else {

            threatIndex =
                Math.round(
                    (
                        velocityRisk +
                        sizeRisk +
                        distanceRisk +
                        magnitudeRisk
                    ) / 4
                );

            threatIndex =
                Math.min(
                    39,
                    threatIndex
                );
        }


        document.getElementById(
            "threat-percent"
        ).textContent =
            `${threatIndex}%`;


        document.getElementById(
            "threat-progress"
        ).style.width =
            `${threatIndex}%`;


        /* =================================================
           SHOW RESULT
        ================================================= */

        result.classList.add(
            "show"
        );


        /* =================================================
           SCAN STATUS
        ================================================= */

        scanStatus.textContent =
            hazardous
                ? "THREAT DETECTED — ASSESSMENT COMPLETE"
                : "TRAJECTORY STABLE — ASSESSMENT COMPLETE";


    }


    catch (error) {

        console.error(error);


        result.classList.add(
            "show"
        );


        result.classList.remove(
            "hazardous"
        );


        document.getElementById(
            "result-text"
        ).textContent =
            "ERROR";


        document.getElementById(
            "classification"
        ).textContent =
            "SYSTEM ERROR";


        document.getElementById(
            "result-message"
        ).textContent =
            "Unable to communicate with the O.R.I.O.N. prediction backend.";


        scanStatus.textContent =
            "BACKEND CONNECTION ERROR";

    }


    finally {

        loading.classList.remove(
            "active"
        );

        button.disabled = false;

        button.style.opacity =
            "1";

    }
}


/* =====================================================
   BUTTON
===================================================== */

button.addEventListener(
    "click",
    analyze
);


/* =====================================================
   ENTER KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !button.disabled
        ) {

            analyze();

        }

    }
);


/* =====================================================
   NEW ANALYSIS
===================================================== */

document.getElementById(
    "new-analysis"
).addEventListener(
    "click",
    () => {

        result.classList.remove(
            "show",
            "hazardous"
        );

        scanStatus.textContent =
            "SYSTEM READY";

        document.querySelectorAll(
            ".input-box input"
        ).forEach(
            input => {
                input.value = "";
            }
        );

        document.querySelectorAll(
            ".parameter-bar div"
        ).forEach(
            bar => {
                bar.style.width = "0%";
            }
        );

    }
);


/* =====================================================
   MISSION REPORT
===================================================== */

document.getElementById(
    "report-btn"
).addEventListener(
    "click",
    () => {

        const text =
`
==================================================
              O.R.I.O.N. MISSION REPORT
==================================================

MISSION ID:
${document.getElementById("mission-id").textContent}

ANALYSIS TIME:
${document.getElementById("analysis-time").textContent}

--------------------------------------------------
CLASSIFICATION
--------------------------------------------------

${document.getElementById("result-text").textContent}

RISK:
${document.getElementById("classification").textContent}

MODEL CONFIDENCE:
${document.getElementById("confidence").textContent}

THREAT INDEX:
${document.getElementById("threat-percent").textContent}

--------------------------------------------------
ORBITAL PARAMETERS
--------------------------------------------------

MAGNITUDE:
${value("magnitude")}

MIN DIAMETER:
${value("min_diameter")} KM

MAX DIAMETER:
${value("max_diameter")} KM

VELOCITY:
${value("velocity")} KM/S

MISS DISTANCE:
${value("miss_distance")} KM

--------------------------------------------------
SYSTEM
--------------------------------------------------

O.R.I.O.N. AI CORE
Orbital Reconnaissance &
Impact Observation Network

==================================================
`;


        const blob =
            new Blob(
                [text],
                {
                    type:
                        "text/plain"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "ORION_Mission_Report.txt";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =====================================================
   INITIAL STATUS
===================================================== */

updateParameterBars();

scanStatus.textContent =
    "SYSTEM READY";