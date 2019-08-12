var args = process.argv.slice(2);

const modeTypes = {
    PRODUCTION: "PRODUCTION",
    DEVELOPMENT: "DEVELOPMENT",
    CLEAN: "CLEAN"
};

var mode = modeTypes.DEVELOPMENT;

// Note that those paths are mentioned in '.csproj' file in project building scenarios.
var wwwrootDistDir = "wwwroot/dist";
var clientAppDistDir = "ClientApp/dist";

// Detect mode.
args.forEach(arg => {
    var splitted = arg.toLowerCase().split("=");
    if (splitted.length < 2) {
        return;
    }
    var param = splitted[0].replace(/\-/g, "");
    var value = splitted[1];

    switch (param) {
        case "mode":
            mode =
                modeTypes.PRODUCTION.toLowerCase() === value ? modeTypes.PRODUCTION :
                    modeTypes.DEVELOPMENT.toLowerCase() === value ? modeTypes.DEVELOPMENT :
                    modeTypes.CLEAN;
    }
});

var fs = require("fs");
var rimraf = require("rimraf");

const exists = (path) => {
    return fs.existsSync(path);
};

/**
 * Clean up unnecessary files.
 * */
const cleanUpAsync = async () => {

    console.log("Deleting compiled scripts...");

    await rimraf(wwwrootDistDir, (error) => {
        if (error) {
            console.log(error);
        }
    });

    await rimraf(clientAppDistDir, (error) => {
        if (error) {
            console.log(error);
        }
    });

};

const startAsync = async () => {

    console.log("======= build.before.js mode: " + mode + " =======");

    var doesDistPathExist = exists(wwwrootDistDir);

    var shouldClean =
        // Previous mode was "production".
        // So we need to clean up compiled scripts.
        doesDistPathExist ||
        // Or we need to clean up after development mode
        // to remove those unnecessary files.
        mode === modeTypes.PRODUCTION ||
        // Clean up only.
        mode === modeTypes.CLEAN;

    if (shouldClean) {
        await cleanUpAsync();
    }
    else {
        console.log("Not cleaning...?");
    }
};

startAsync();