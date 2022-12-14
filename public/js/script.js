var elems = [];
var fileList = [];
var currentLoc = location.pathname.split("/")[1];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function loadVid(vidName) {
    var req = new XMLHttpRequest();
    req.open('GET', `${vidName}`, true);
    req.responseType = 'blob';
    
    req.onload = function() {
    if (this.status === 200) {
        var videoBlob = this.response;
        var vid = URL.createObjectURL(videoBlob);
        sources = document.querySelectorAll("source");
        for (var j = 0; j < sources.length; j++) {
            if (sources[j].src == vidName) {
                sources[j].src = vid;
            }
        }
    }
    }
    
    req.send();
}

function areEqual(array1, array2) {
    if (array1.length === array2.length) {

        return array1.every((element, index) => {
            if (element === array2[index]) {
                return true;
        }
  
        return false;
      });
    }
  
    return false;
}

function checkUpdate() {
    var req = new XMLHttpRequest();
    req.open('GET', `${currentLoc}/check`, true);
    req.responseType = 'json';
    
    req.onload = function() {
    if (this.status === 200) {
        var res = this.response;
        var compFileList = []
        res.fileList.forEach((file) => {
            compFileList.push(file.replaceAll("\\", "/").replaceAll("assets/", ""));
        });
        if (!areEqual(compFileList, fileList)) window.location.href = window.location.href;
    }
    }
    
    req.send();
}

function preloadVideos(vidList) {
    for (var i = 0; i < vidList.length; i++) {
        if (vidList[i].tagName === 'VIDEO') {
            vidName = vidList[i].currentSrc;
            loadVid(vidName);
        }
    }
}

var updateCheck = setInterval(function() {
    checkUpdate();
}, 5000);

window.addEventListener('load', async function () {
    elems = elems.concat(Array.prototype.slice.call(this.document.querySelectorAll("img")));
    elems = elems.concat(Array.prototype.slice.call(this.document.querySelectorAll("video")));
    elems.sort((a, b) => a.id - b.id);
    elems.forEach((file) => {
        fileList.push(decodeURIComponent(file.currentSrc.split("assets/")[1]))
    });
    const params = new URLSearchParams(window.location.search);
    if (params.has("loop")) {
        loop = Boolean(parseInt(params.get("loop")));
    }
    if (params.has("slideDelay")) {
        slideDelay = parseInt(params.get("slideDelay"));
    }
    preloadVideos(elems);
    while (true) {
        elems[0].classList.toggle('fade');
        if (elems.length == 1) return;
        for (var i = 1; i < elems.length; i++) {
            await sleep(slideDelay * 1000);
            elems[i-1].classList.toggle('fade');
            elems[i].classList.toggle('fade');
            if (elems[i].tagName === 'VIDEO') {
                $('video').each(function() {
                    if ($(this).is(":visible")) {
                        $(this)[0].play();
                    }
                });
                await sleep((elems[i].duration - (slideDelay - 2)) * 1000);
            }
        }
        if (loop) {
            await sleep(slideDelay * 1000);
            elems[elems.length-1].classList.toggle("fade");
        } else {
            return;
        }
    }
})