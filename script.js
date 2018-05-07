// IDs
// toHide: Everything that needs to be hidden when score is shown
// toShow: Everything that needs to be shown when score is shown
// score: h1 that shows the score
// Initially hides results
$("#toShow").hide();

// Pre-calcuate the individual send order
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

let nums = [];
for (let i = 1; i <= 100; i++) {
    nums.push(i);
}
const order = shuffle(nums);

// On click of the submit button:
$('#submit').click(function() {
    // Calculates purity
    let sinList = document.querySelectorAll('input[type="checkbox"]:checked');
    let sins = sinList.length;
    let purity = 100 - sins;

    // Sends the score to Google Analytics
    ga('send', {
        hitType: 'event',
        eventCategory: 'Score',
        eventAction: 'Total',
        eventLabel: purity.toString(),
        eventValue: purity
    });

    // Sends the individual values to Google Analytics
    for (i = 0; i < 100; i++) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Score',
            eventAction: 'Individual',
            eventLabel: order[i].toString(),
            eventValue: (document.getElementById(order[i].toString()).checked ? 1 : 0)
        });
    }

    // Shows the score in the h1
    $('#score').html(purity);

    // Shows the score and hides the checks
    $("#toShow").show();
    $("#toHide").hide();
});

// On click of the reset button:
$('#reset').click(function() {
    $('input:checkbox').removeAttr('checked');
});