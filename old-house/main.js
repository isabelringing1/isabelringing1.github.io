var photos = ["house1.png", "house2.png", "house3.png", "house4.png", "kitchen1.jpg", "kitchen2.jpg", "kitchen3.jpg", "kitchen4.jpg", "dog1.png", "dog2.png", "dog3.png", "dog4.png"];

var curr = 0;

// On Page Load
$(function() {
    $("#photo").attr("src", "../old-house/images/" + photos[0]);

    $(window).bind('mousewheel', function(event, delta) {
        console.log(document.body.scrollTop);
        var i = Math.floor(document.body.scrollTop / 307);
        if (i != curr && i < photos.length){
            curr = i;
            console.log("Changing index to " + i);
            $("#photo").attr("src", "../old-house/images/" + photos[curr]);
        }

    });
});