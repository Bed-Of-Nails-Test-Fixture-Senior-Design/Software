const jsonString = fs.readFileSync('./js/bounds.json')
const passing = JSON.parse(jsonString)
let comm;
let resultTitles = ["PreAmpOut","GainStageOut","EmitBypOut","EmitFlloOut","SrcFlloOut","12VOut","8VOut","6VOut","NegDrvOut","PosDrvOut","SPRKPos","SPRKNeg"];
//test passing parameters
let commandFailFlag = 0; //1 if a command fails
//0 if unexecuted, 1 if pass, 2 if fail
let DCTestPassFlag = 0;
let noiseTestPassFlag = 0;
let gainTestPassFlag = 0;
let flatTestPassFlag = 0;
let bassTestPassFlag = 0;
let trebleTestPassFlag = 0;
let presTestPassFlag = 0;
let auxTestPassFlag = 0;
let powTestPassFlag = 0;
let resultPassFlag = 0;

function DCTest (){
    resultPassFlag = 0; //reset result pass flag in case incremented from last run through
    potSetting("Drive", "CCW").then(sendAppendConsole(comm))
    potSetting("Tone", "CCW").then(sendAppendConsole(comm))
    potSetting("Volume", "CCW").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    testCommand("MeasDC").then(sendAppendConsoleCsv("DC Test", comm, "DC").then(resultPassFlag += testingPass(comm, "DC Test")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        DCTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        DCTestPassFlag = 2; //indicate failure
    }
    // DCTestPassFlag = 1; //force pass
    console.log("DC Test finished with result: " + DCTestPassFlag);
}
function noiseTest (){
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "MID").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Noise Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Noise Test")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        noiseTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        noiseTestPassFlag = 2; //indicate failure
    }
    // noiseTestPassFlag = 1; //force pass
    console.log("Noise Test finished with result: " + noiseTestPassFlag);
}
function gainTest (){
    potSetting("Drive", "CW").then(sendAppendConsole(comm))
    potSetting("Tone", "MID").then(sendAppendConsole(comm))
    potSetting("Volume", "CW").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Guitar", .001, 1000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Gain Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Gain Test")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        gainTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        gainTestPassFlag = 2; //indicate failure
    }
    // gainTestPassFlag = 1; //force pass
    console.log("Gain Test finished with result: " + gainTestPassFlag);
}
function flatTest (){
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "MID").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Guitar", .02, 60).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Flat Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Flat Test 1")))
    sigOn("Guitar", .02, 1000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Flat Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Flat Test 2")))
    sigOn("Guitar", .02, 7000).then(sendAppendConsole(comm)) 
    testCommand("MeasAC").then(sendAppendConsoleCsv("Flat Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Flat Test 3")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        flatTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        flatTestPassFlag = 2; //indicate failure
    }
    // flatTestPassFlag = 1; //force pass
    console.log("Flat Test finished with result: " + flatTestPassFlag);
}
function bassTest (){
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "CCW").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Guitar", .02, 60).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Bass Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Bass Test 1")))
    sigOn("Guitar", .02, 1000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Bass Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Bass Test 2")))
    sigOn("Guitar", .02, 7000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Bass Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Bass Test 3")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        bassTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        bassTestPassFlag = 2; //indicate failure
    }
    // bassTestPassFlag = 1; //force pass
    console.log("Bass Test finished with result: " + bassTestPassFlag);
}
function trebleTest (){
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "CW").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Guitar", .02, 60).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Treble Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Treble Test 1")))
    sigOn("Guitar", .02, 1000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Treble Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Treble Test 2")))
    sigOn("Guitar", .02, 7000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Treble Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Treble Test 3")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        trebleTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        trebleTestPassFlag = 2; //indicate failure
    }
    // trebleTestPassFlag = 1; //force pass
    console.log("Treble Test finished with result: " + trebleTestPassFlag);
}
function presTest (){
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "MID").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Guitar", .02, 800).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Pres Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Pres Test 1")))
    presSetting("On").then(sendAppendConsole(comm))
    sigOn("Guitar", .02, 800).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Pres Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Pres Test 2")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        presTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        presTestPassFlag = 2; //indicate failure
    }
    // presTestPassFlag = 1; //force pass
    console.log("Pres Test finished with result: " + presTestPassFlag);
}
function auxTest (){
    potSetting("Drive", "CCW").then(sendAppendConsole(comm))
    potSetting("Tone", "CCW").then(sendAppendConsole(comm))
    potSetting("Volume", "CCW").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    sigOn("Aux", .02, 25).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Aux Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Aux Test 1")))
    sigOn("Aux", .02, 3000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Aux Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Aux Test 2")))
    sigOn("Aux", .02, 8000).then(sendAppendConsole(comm))
    testCommand("MeasAC").then(sendAppendConsoleCsv("Aux Test", comm, "AC").then(resultPassFlag += testingPass(comm, "Aux Test 3")))
    if (resultPassFlag == 0){ //if results failed, resultPassFlag would have been incremented
        auxTestPassFlag = 1; //indicate pass
    }
    else{ //results are in range
        auxTestPassFlag = 2; //indicate failure
    }
    // auxTestPassFlag = 1; //force pass
    console.log("Aux Test finished with result: " + auxTestPassFlag);
}
function powTest (){ 
    potSetting("Drive", "MID").then(sendAppendConsole(comm))
    potSetting("Tone", "MID").then(sendAppendConsole(comm))
    potSetting("Volume", "MID").then(sendAppendConsole(comm))
    presSetting("Off").then(sendAppendConsole(comm))
    sigOff().then(sendAppendConsole(comm))
    //arduino will handle different signal levels/freqs
    testCommand("MeasDist", 2).then(sendAppendConsoleCsv("Pow Test", comm, "DIST"))
    testCommand("MeasDist", 5).then(sendAppendConsoleCsv("Pow Test", comm, "DIST"))
    testCommand("MeasDist", 9).then(sendAppendConsoleCsv("Pow Test", comm, "DIST"))
    testCommand("MeasDist", 10).then(sendAppendConsoleCsv("Pow Test", comm, "DIST"))
    powTestPassFlag = 1; //always passes becus checks not implemented
    console.log("Pow Test finished with result: " + powTestPassFlag);
    potSetting("Drive", "CCW").then(sendAppendConsole(comm))
    potSetting("Tone", "CCW").then(sendAppendConsole(comm))
    potSetting("Volume", "CCW").then(sendAppendConsole(comm))
}

//comands to arduino
function potSetting(pot, setting){
    let potJSON = { "Command" : "PotCtrl", "Params": {"Channel": pot, "Control": setting}};
    potJSONString = JSON.stringify(potJSON)
    comm = ipcRenderer.sendSync("arduino command", potJSONString);
    console.log(comm);
    if (JSON.parse(comm)["Result"]["Success"] == "False"){
        commandFailFlag == 1; //indicate a command failure
    }
   return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(comm);
        }, 1);
    });
}
function presSetting(pres){
    let presJSON = {"Command": "PresCtrl", "Params": {"Control": pres}};
    presJSONString = JSON.stringify(presJSON)
    comm = ipcRenderer.sendSync("arduino command", presJSONString);
    console.log(comm);
    if (JSON.parse(comm)["Result"]["Success"] == "False"){
        commandFailFlag == 1; //indicate a command failure
    }
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    });
}
function sigOn(input, mvrms, freq){
    let sigOnJSON = {"Command": "SigOn", "Params": {"Channel": input, "Level": mvrms, "Freq": freq}};
    sigOnJSONString = JSON.stringify(sigOnJSON)

    console.log("SENDING SIGON STRING: "+ sigOnJSONString)

    comm = ipcRenderer.sendSync("arduino command", sigOnJSONString);
    console.log(comm);
    if (JSON.parse(comm)["Result"]["Success"] == "False"){
        commandFailFlag == 1; //indicate a command failure
    }
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    });
}
function sigOff(){
    let inputJSON = {"Command": "SigOff"};
    inputJSONString = JSON.stringify(inputJSON)
    comm = ipcRenderer.sendSync("arduino command", inputJSONString);
    console.log(comm);
    if (JSON.parse(comm)["Result"]["Success"] == "False"){
        commandFailFlag == 1; //indicate a command failure
    }

    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    }); 
    
}
function testCommand(test, value){
    let testJSON;
    if (test == "distortion"){ //watts
        testJSON = {Command: test, Params: {Watts: value}};
    }
    else{ //frequency
        testJSON = {Command: test};
    }
    testJSONString = JSON.stringify(testJSON)
    comm = ipcRenderer.sendSync("arduino command", testJSONString);
    console.log(comm);
    if (JSON.parse(comm)["Result"]["Success"] == "False"){
        commandFailFlag == 1; //indicate a command failure
    }
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    }); 
}


//defining helper functions for hardcoded json
//create arg to send back to renderer process
function setResultArg(test, myComm, whatC){
    let arg = {
        test : "",
        action : "", //tmp
        success : "",
        resultString : ""
    };
    arg["test"] = test;
    arg["action"] = JSON.parse(myComm)["Action"];
    arg["success"] = JSON.parse(myComm)["Result"]["Success"];
    if (whatC == "DC"){
        arg["resultString"] = outputResultStringDC(myComm);
    }
    else if (whatC == "AC"){
        arg["resultString"] = outputResultStringAC(myComm);
    }
    return arg;
}
//create string to output results
function outputResultStringDC(myComm){
    let resultString = ""
    resultTitles.forEach(function(result, index){
        resultString += result+": "+JSON.parse(myComm)["Result"][result]["Level"]+"V; ";
    });
    return resultString;
}
function outputResultStringAC(myComm){
    let resultString = ""
    resultTitles.forEach(function(result, index){
        resultString += result+": "+JSON.parse(myComm)["Result"][result]["Level"]+"V "+JSON.parse(myComm)["Result"][result]["Freq"]+"Hz; ";
    });
    return resultString;
}
//tell renderer process to output to console/csv
function sendAppendConsole(myComm){
    ipcRenderer.send("append console", JSON.parse(myComm)["Action"] + " " + JSON.parse(myComm)["Result"]["Success"])
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    }); 
}
function sendAppendConsoleCsv(test, myComm, command){
    ipcRenderer.send("append console and csv commands", setResultArg(test, myComm, command))    
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(comm);
        }, 1);
    }); 
}

//evaluate results of test to see if it failed
function testingPass(myComm, typePass){
    pass = passing[typePass];
    console.log(passing[typePass]["12VOutH"]);
    for (let result in pass) {
        let currResult = JSON.parse(myComm)["Result"][result.substring(0, result.length - 1)]["Level"]; //store arduino resturned result in variable
        let HorL = result.substr(result.length - 1); //check if we are comparing for high or low
        if (HorL == "H"){ //check high range
            if (currResult > pass[result]){
                console.log(result.substring(0, result.length - 1) + " of " + currResult + " failed")
                ipcRenderer.send("append console", result.substring(0, result.length - 1) + " of " + currResult + " failed")
                return 2; //indicate test failure
            }
        }
        else{ //check low range
            if (currResult < pass[result]){
                console.log(result.substring(0, result.length - 1) + " of " + currResult + " failed")
                ipcRenderer.send("append console", result.substring(0, result.length - 1) + " of " + currResult + " failed")
                return 2; //indicate test failure
            }
        }
    }
    return 0; //all results are in range, pass
}





