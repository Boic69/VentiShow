var   express           = require('express');
const fs                = require('fs');
const serverDir         = "\\\\clustkb5\\Test";
const configName        = "config.json";
const defaultConfig     = {slideDelay: 20, loop: true};
const imgFileTypes      = ["tif", "tiff", "bmp", "jpg", "jpeg", "gif", "png", "eps", "raw", "webp"];
const vidFileTypes      = ["mp4", "mov", "wmv", "flv", "avi"];
var app                 = express();


const getFiles = source => 
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => `assets\\${source.split("\\").slice(-1)[0]}\\${dirent.name}`);

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

function getSettings(location) {
    if (!fs.existsSync(`${location}\\${configName}`)) {
        fs.writeFileSync(`${location}\\${configName}`, JSON.stringify(defaultConfig));
        return defaultConfig;
    }
    var rawdata = fs.readFileSync(`${location}\\${configName}`);
    var jsonData = JSON.parse(rawdata);
    return jsonData;
}

function containsImgOrVid(files) {
    var test = "";
    files.forEach((file) => {
        var ext = file.split('.').pop().replaceAll(/\s/g,'');
        if (imgFileTypes.includes(ext) || vidFileTypes.includes(ext)) {
            test += ".";
        }
    });
    return test.length >= 1
}

function handleFiles (files) {
    var retData = "";
    files.forEach((file, idx) => {
        var ext = file.split('.').pop().replaceAll(/\s/g,'');
        if (imgFileTypes.includes(ext)) {
            retData += `<img id=${idx} src="${file}">`;
        } else if (vidFileTypes.includes(ext)) {
            retData += `<video id=${idx} controls>
                        <source src="${file}" type="video/${ext}">
                        Your browser does not support the video tag.
                        </video>`
        }
    });
    return retData;
}

function handleLocations (locations) {
    var retData = "";
    locations.forEach((location) => {
        retData += `<a href="${location}"><button class="button-6" role="button">${location}</button></a>`;
    });
    return retData;
}

var locations = getDirectories(serverDir);

var boiler_plate = [`<link rel="stylesheet" type="text/css" href="css/style.css" /><script src="js/script.js"></script><script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script><meta http-equiv="Content-Security-Policy" content="default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;">`, `<link rel="stylesheet" type="text/css" href="css/main.css" />`];

app.use(express.static('public'));

app.use('/assets', express.static(serverDir));

app.get("/", (req, res) => {
    res.send(boiler_plate[1] + '<div class="grid-container">' + handleLocations(locations)) + '</div>';
});

app.get("/:location/check", (req, res) => {
    var location = req.params.location;
    if (!locations.includes(location)) {
        res.send(`${location} is not a location. All locations can be found <a href="../">here</a>`);
        return;
    }
    var files = getFiles(`${serverDir}\\${location}`);
    files = files.filter(file => imgFileTypes.includes(file.split('.').pop().replaceAll(/\s/g,'')) || vidFileTypes.includes(file.split('.').pop().replaceAll(/\s/g,'')))
    res.send(JSON.stringify({status: "OK", fileList: files}));
});

app.get("/:location", (req, res) => {
    var location = req.params.location;
    if (!locations.includes(location)) {
        res.send(`${location} is not a location. All locations can be found <a href="../">here</a>`);
        return;
    }
    var files = getFiles(`${serverDir}\\${location}`);
    if (!containsImgOrVid(files)) {
        res.send(`${location} doesen't have any files.`);
        return;
    }
    var setData = getSettings(`${serverDir}\\${location}`);
    var settings = `<script>var slideDelay = ${setData['slideDelay']}; var loop = ${setData['loop']}</script>`;
    res.send(boiler_plate[0] + settings + handleFiles(files));
});

var server = app.listen(5500);