var data;
var map;
var artCaptionMap;
var mobile = false;
var cardPositions = [];
var windowWidth;

var cardsPerRow;
var margin_left = 40;
var cardContainerMinWidth = 430;
var cardContainerHeight = 610;

function getProjectData(){
    return $.getJSON('projects.json', function(jsonData, status, xhr){
        data = jsonData;
        map = new Map();
        artCaptionMap = new Map();
        for (var i = 0; i < data.projects.length; i++){
            map.set(data.projects[i].hash, i);
        }
        data.projects.sort((a, b) => (a.index < b.index) ? 1 : -1);

        for (var i = 0; i < data.art_captions.length; i++){
            artCaptionMap.set(data.art_captions[i].link, data.art_captions[i].title);
        }
    });
}


function renderProject(projectIndex){
    $('#project')[0].style.display = "block";
    $('#cards')[0].style.display = "none";

    var projectData;
    if (projectIndex == -1){
        projectData = data.about;
    }
    else{
        projectData = data.projects[data.projects.length - projectIndex - 1];
    }

    fetch('project.mustache')
        .then((response) => response.text())
        .then((template) => {
            var rendered = Mustache.render(template, projectData);
            $('#project')[0].innerHTML = rendered;
            if (projectData.index == 0){
                configureArt();
            }
            if (projectIndex == -1){
                $("#project-image").attr("title", "pic creds: keaton");
            }
        });
}

function configureArt(){
    $("#project-image").attr("href", "#art");
    $("#project-image").removeClass("project-image-link");
    $("#project-image").addClass("project-image-link-large");
    $(".image").on('click', function(){
        $("#modal")[0].style.display = "block";
        $("#modal-content")[0].src = this.src;
        $("#modal-caption")[0].innerHTML = artCaptionMap.get(this.src.split("/").at(-1));
    });
    $("#modal").on('click', function(){
        $("#modal")[0].style.display = "none";
    });
}

function renderCards(){
    $('#cards')[0].style.display = "block";
    $('#project')[0].style.display = "none";

    fetch('cards.mustache')
        .then((response) => response.text())
        .then((template) => {
            var rendered = Mustache.render(template, data);
            $('#cards')[0].innerHTML = rendered;
            $('.card').on('click', (event) => {
                card = event.target;
                while (card.className != "card-container"){
                    card = card.parentNode;
                }
                renderProject(parseInt(card.id));
            });
            var cardContainers = $('.card-container');
            var cardContainerWidth = (windowWidth - margin_left) / cardsPerRow;
            var currX = margin_left;
            var currY = 30;
            for (var i = 0; i < cardContainers.length; i++){
                cardContainer = cardContainers[i];
                if (!mobile){
                    cardContainer.style.marginLeft = currX + "px";
                    cardPositions[i] = [currX, currY];
                }
                else{
                    cardContainer.style.marginLeft = (currX/2) + "px";
                    cardPositions[i] = [currX/2, currY];
                }
                cardContainer.style.marginTop = currY + "px";

                if ((i + 1) % cardsPerRow == 0){
                    currX = margin_left;
                    currY += mobile ? cardContainerHeight - 30 : cardContainerHeight;
                }
                else{
                    currX += cardContainerWidth;
                }
            }

            $("#logo").click(function(){
                renderCards();
            });
        });
}

window.fadeIn = function(obj) {
    obj.style.opacity = "1";
}

window.onhashchange = function() {
    if (window.location.hash === ""){
        renderCards();
    }
}

window.onresize = function(){
    windowWidth = $(window).width();
    if (windowWidth < 631) { configureMobile(); }
    if (window.location.hash === ""){
        cardsPerRow = Math.floor((windowWidth- margin_left) / cardContainerMinWidth);
        if (cardsPerRow == 0) { cardsPerRow = 1; }
        renderCards();
    }
}
// On Page Load
$(function() {
    windowWidth = $(window).width();
    if (windowWidth < 631) { configureMobile(); }
    cardsPerRow = Math.floor((windowWidth- margin_left) / cardContainerMinWidth);
    if (cardsPerRow == 0) { cardsPerRow = 1; }
    $("#about").click(function(){
        console.log("Rendering about")
        renderProject(-1);
    });
    getProjectData().then(() => {
        if (window.location.hash && map.get(window.location.hash) != undefined){
            renderProject(map.get(window.location.hash));
        }
        else if (window.location.hash == "#about"){
            renderProject(-1);
        }
        else{
            renderCards();
        }
    });
});

function configureMobile(){
    mobile = true;
}