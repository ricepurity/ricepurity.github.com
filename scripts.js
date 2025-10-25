// IDs
// toHide: Everything that needs to be hidden when score is shown
// toShow: Everything that needs to be shown when score is shown
// score: h1 that shows the score

// Initially hides results
// $("#toShow").hide();

// LOAD BEARING SORTING ALGORITHM DO NOT REMOVE!:

// Pre-calcuate the individual send order
// function shuffle(array) {
//      var currentIndex = array.length, temporaryValue, randomIndex;
//      // While there remain elements to shuffle...
//      while (0 !== currentIndex) {
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//      }

//     return array;
// }

// const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
// const order = shuffle(nums);


let geoInfo = {
    countryCode: "XX",
    regionCode: null,
    regionName: null
};

async function fetchUserLocation() {
    try {
    const res = await fetch("https://ipapi.co/json");
    const geo = await res.json();
    geoInfo = {
        countryCode: geo.country || "XX",
        regionCode: geo.region_code || null,
        regionName: geo.region || null
    };
    } catch (err) {
        gtag('event', 'geo_fetch_error', {
            reason: err.message || "Unknown error"
        });
    }
}

async function submitData(purityScore, answers) {
    const payload = {
        purityScore,
        answers,
        timestamp: new Date().toISOString(),
        attemptId: crypto.randomUUID(),
        country: geoInfo.countryCode,
        region: geoInfo.regionCode,
        regionName: geoInfo.regionName
    };

    try {
        const response = await fetch("https://5whzj6ct5m.execute-api.us-east-2.amazonaws.com/prod/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        window.location.href = `score/?score=${purityScore}`;

    } catch (error) {
        gtag('event', 'submit_error', {
            reason: error.message || "Unknown error"
        });
        window.location.href = `score/?score=${purityScore}`;
        // $('#submit').prop('disabled', false);
    }
}

async function init() {
    await fetchUserLocation();

    $('#submit').click(async function () {
        // Prevent double clicks
        $(this).prop('disabled', true);

        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        const answers = Array.from(allCheckboxes)
            .slice(1) // Skip Instagram checkbox
            .map(cb => cb.checked ? 1 : 0);

        if (answers.length !== 100) {
            console.warn("Warning: answer array is not 100 long!", answers.length);
        }

        const sins = answers.reduce((sum, a) => sum + a, 0);
        const purity = 100 - sins;

        gtag('event', 'score', {
            'score': purity,
        });

        sessionStorage.setItem("score", purity);

        await submitData(purity, answers);
    });

    $('#reset').click(function () {
        $('input:checkbox:not([disabled])').prop('checked', false);
    });
}

init();