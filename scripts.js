$(document).ready(function() {
    history.replaceState({ page: 'home' }, '', '/');

    const shareURL = window.location.origin;
    setShareLinks()

    // if you hit the back button, restart the test!
    window.addEventListener('popstate', (event) => {
        reset();
    });

    // On click of the submit button:
    $('#submit').click(function(event) {
        event.preventDefault(); // Prevent any default submission

        // Calculate purity score:
        var checkedItems = $('input[type="checkbox"]:checked');
        var sins = checkedItems.length - 1; // 0 box is always checked...
        var purity = 100 - sins;

        // Display the calculated purity score:
        $('#scoreDisplay').html(purity);

        // Hide the test container and show the result container:
        $('#list').hide();
        $('#resultContainer').show();

        window.scrollBy(0, .1);
        window.scrollBy(0, -.1);

        // Optionally save the score in session storage (if needed for any other purpose)
        sessionStorage.setItem("score", purity);

        // Set Twitter and SMS links
        setShareLinks()

        // Update the English name of the path
        document.title = `Your Rice Purity Score`;

        // Update the URL without reloading the page:
        history.pushState({ page: 'score' }, '', 'score/?score=' + purity);

        window.scrollTo({ top: 0, behavior: 'auto' });

        // add if pages aren't being recognized
        gtag('event', 'page_view', {
            page_path: '/score/?score=' + purity,
            page_title: 'Your Rice Purity Score'
        });
          
        // Send score to GA4
        gtag('event', 'score', { 'score': purity });
        
    });

    function reset() {
        // Reset all checkboxes except the permanently checked one (question 0)
        $('#list input[type="checkbox"]').not('[disabled]').prop('checked', false);

        sessionStorage.removeItem("score");
        document.title = 'The Rice Purity Test';
        // Reset url
        history.replaceState({ page: 'home' }, '', '/');
        // Refresh page
        location.reload()

        // Hide the test container and show the result container:
        $('#list').show();
        $('#resultContainer').hide();
    }

    // Set Twitter and SMS links
    function setShareLinks() {
        let purity = sessionStorage.getItem("score") || null;
        const scoreText = purity ? `I got a ${purity} on the Rice Purity Test!` : '';

        // Text message link
        const smsMessage = `${scoreText} Check yours here: ${shareURL}`;
        document.getElementById("text-share").href = `sms:?&body=${encodeURIComponent(smsMessage)}`;
    
        // X (Twitter) share link
        const xLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(scoreText)}&url=${encodeURIComponent(shareURL)}`;
        document.getElementById("x-share").href = xLink;
    }
  
    // On click of the reset button:
    $('#reset').click(function(event) {
        event.preventDefault();
        // Reset all checkboxes except the permanently checked one (question 0)
       reset();
    });

    $('#copy-link').click(function(event) {
        navigator.clipboard.writeText(shareURL).then(() => {
            alert("Link copied to clipboard!");
        });
    
        gtag('event', 'copy_link', {
            'event_category': 'Sharing',
            'event_label': 'Copied to Clipboard',
            'value': 1
        });
    });

    $('#restart').click(function(event) {
        // do we even need to do this...
        event.preventDefault();
        reset()

        gtag('event', 'restart_test', {
            'event_category': 'Quiz Interaction',
            'event_label': 'Restart Button Click',
            'value': 1
        });
    });

    $('#text-share').click(function(event) {
        gtag('event', 'sms_share', {
            'event_category': 'Sharing',
            'event_label': 'Share to SMS',
            'value': 1
        });
    });

    $('#x-share').click(function(event) {
        gtag('event', 'x_share', {
            'event_category': 'Sharing',
            'event_label': 'Share to X',
            'value': 1
        });
    });

  });


  