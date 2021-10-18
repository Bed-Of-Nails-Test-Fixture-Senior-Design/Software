const newLine = '\r\n';

let fields = ['Date', 'Test', 'Command', 'Executed', 'Result'];
let toCsv = [];

//canvas dimensions for confetti
var canvas = document.getElementById("manuf-content");
let confettiSettings = { target: "manuf-content" };
let confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

//document interaction for choosing file
document.getElementById("manufExcelBtn").addEventListener("click", function(){
    chooseAFile(document.getElementById("manufExcelPath"));
});


//function to check if file exists
let fileExistsSync = (file) => {
    try {
        fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
        return true;
      } catch (err) {
        return false;
      }
}

//choosing file function for opening dialog for file explorer via IPC communication with main
let csvFile = "";
function chooseAFile(pathDisplay){
    ipcRenderer.send("chooseFile", ""); //send message to main.js to open file explorer to choose file
    ipcRenderer.on("fileChosen", (event, arg) =>{ //wait for user to choose file
        if(arg.filePaths[0] != undefined){ //check if file actually chosen
            csvFile = arg.filePaths[0];
            if(csvFile.slice(-4) != ".csv"){//check if already ends in .csv
                csvFile = csvFile + ".csv";
            }
            fields = fields + newLine;
            if (!fileExistsSync(csvFile)){
                //new file
                fs.closeSync(fs.openSync(csvFile,'w')); //create empty csv file at path specified
                //write the headers and newline
                console.log('New file, just writing headers');
                
            /*
                fs.writeFile(csvFile, fields, function (err) {
                    if (err) throw err;
                    console.log('file saved');
                });*/
            }
            
                //existing file , write append headers
                fs.appendFile(csvFile, fields, function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                });
            
            pathDisplay.value = csvFile; 
        }
    });
}

//led elements
let DCled = document.getElementById("DCled");
let noiseled = document.getElementById("noiseled");
let gainMidbandled = document.getElementById("gainled");
let freqFlatled = document.getElementById("freqFlatled");
let freqBassled = document.getElementById("freqBassled");
let freqTrebleled = document.getElementById("freqTrebleled");
let freqPresled = document.getElementById("freqPresled");
let auxled = document.getElementById("auxled");
let powled = document.getElementById("powled");
let grayledColor = DCled.getAttribute("background-color");


let commandFailFlag = 1; //0 if a command fails
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

//start button
document.getElementById("manufStartTestsBtn").addEventListener("click", async function(){
    if (connectionBtn.innerHTML == "Connection:<br>\Connected :)"){ //check if arduino connected before starting tests
        //go through each test sequentially
        await ipcRenderer.send("reset manufacturing page", "");
        ipcRenderer.send("start DC", "");
    }
    else{
        document.getElementById("errorMessage").style.visibility = "visible";
    }
})
ipcRenderer.on("reset manufacturing page", (event, arg) =>{
    clearConsole()
    canvas.style.visibility = "hidden";
    noiseled.style.background = grayledColor;
    gainled.style.background = grayledColor;
    freqFlatled.style.background = grayledColor;
    freqBassled.style.background = grayledColor;
    freqTrebleled.style.background = grayledColor;
    freqPresled.style.background = grayledColor;
    auxled.style.background = grayledColor;
    powled.style.background = grayledColor;
    DCled.style.background = "yellow";
    console.log("reset")
    return;
});

let date;
ipcRenderer.on("DC test", async (event, arg) =>{
    DCTest();
    if (commandFailFlag && DCTestPassFlag){//only execute the next test if the prior one passed
        writeConsoleAndCSV("DC test", "passed") //update csv and console
        DCled.style.background = "green";
        noiseled.style.background = "yellow";
        ipcRenderer.send("start noise", "");
    }
    else{
        writeConsoleAndCSV("DC test", "failed") //update csv and console
        DCled.style.background = "red";
    }
})
ipcRenderer.on("noise test", (event, arg) =>{
    noiseTest();
    if (commandFailFlag && noiseTestPassFlag){//only execute the next test if the prior one passed
        writeConsoleAndCSV("Noise test", "passed") //update csv and console
        noiseled.style.background = "green";
        gainled.style.background = "yellow";
        ipcRenderer.send("start gain","");
    }
    else{
        writeConsoleAndCSV("Noise test", "failed")
        noiseled.style.background = "red";
    }
});
ipcRenderer.on("gain test", (event, arg) =>{
    gainTest();
    if (commandFailFlag && gainTestPassFlag){
        writeConsoleAndCSV("Gain test", "passed") //update csv and console
        gainled.style.background = "green";
        freqFlatled.style.background = "yellow";
        ipcRenderer.send("start flat", "");
    }
    else{
        writeConsoleAndCSV("Gain test", "failed")
        gainled.style.background = "red";
    }
});
ipcRenderer.on("flat test", (event, arg) =>{
    flatTest();
    if (commandFailFlag && flatTestPassFlag){
        writeConsoleAndCSV("Flat test", "passed") //update csv and console
        freqFlatled.style.background = "green";
        freqBassled.style.background = "yellow";
        ipcRenderer.send("start bass", "");
    }
    else{
        writeConsoleAndCSV("Flat test", "failed")
        freqFlatled.style.background = "red";
    }
});
ipcRenderer.on("bass test", (event, arg) =>{
    bassTest();
    if (commandFailFlag && bassTestPassFlag){
        writeConsoleAndCSV("Bass test", "passed") //update csv and console
        freqBassled.style.background = "green";
        freqTrebleled.style.background = "yellow";
        ipcRenderer.send("start treble", "");
    }
    else{
        writeConsoleAndCSV("Bass test", "failed")
        freqBassled.style.background = "red";
    }
});
ipcRenderer.on("treble test", (event, arg) =>{
    trebleTest();
    if (commandFailFlag && trebleTestPassFlag){
        writeConsoleAndCSV("Treble test", "passed") //update csv and console
        freqTrebleled.style.background = "green";
        freqPresled.style.background = "yellow";
        ipcRenderer.send("start pres", "");
    }
    else{
        writeConsoleAndCSV("Treble test", "passed")
        freqTrebleled.style.background = "green";
    }
});
ipcRenderer.on("pres test", (event, arg) =>{
    presTest();
    if (commandFailFlag && presTestPassFlag){
        writeConsoleAndCSV("Pres test", "passed") //update csv and console
        freqPresled.style.background = "green";
        auxled.style.background = "yellow";
        ipcRenderer.send("start aux", "");
    }
    else{
        writeConsoleAndCSV("Pres test", "failed")
        freqPresled.style.background = "red";
    }
});
ipcRenderer.on("aux test", (event, arg) =>{
    auxTest();
    if (commandFailFlag && auxTestPassFlag){
        writeConsoleAndCSV("Aux test", "passed") //update csv and console
        auxled.style.background = "green";
        powled.style.background = "yellow";
        ipcRenderer.send("start pow", "");
    }
    else{
        writeConsoleAndCSV("Aux test", "failed")
        auxled.style.background = "red";
    }
});
ipcRenderer.on("pow test", (event, arg) =>{
    powTest();
    if (commandFailFlag && powTestPassFlag){
        writeConsoleAndCSV("Pow test", "passed") //update csv and console
        powled.style.background = "green";
        canvas.style.visibility='visible';
    }
    else{
        writeConsoleAndCSV("Pow test", "failed")
        powled.style.background = "red";
    }
});


/*
//received 
ipcRenderer.on("DC test", (event, arg) =>{
    console.log(arg.length)
    if (arg== "success"){
        DCled.style.background = "green";
        ipcRenderer.send("noise test", "");
        noiseled.style.background = "yellow";
    }
    else{
        DCled.style.background = "red";
    }
    appendConsole("DC test" + ": " + arg)
    let date = new Date();
    toCsv = ["DC test", arg, date];
    writeCSV();
});
ipcRenderer.on("noise test", (event, arg) =>{
    if (arg == "success"){
        noiseled.style.background = "green";
        ipcRenderer.send("midband test", "");
        gainMidbandled.style.background = "yellow";
    }
    else{
        noiseled.style.background = "red";
    }
    appendConsole("noise test" + ": " + arg)
    let date = new Date();
    toCsv = ["noise test", arg, date];
    writeCSV();
});
ipcRenderer.on("midband test", (event, arg) =>{
    if (arg == "success"){
        gainMidbandled.style.background = "green";
        ipcRenderer.send("guitar test", "");
        gainGuitarled.style.background = "yellow";
    }
    else{
        gainMidbandled.style.background = "red";
    }
    appendConsole("midband test" + ": " + arg)
    let date = new Date();
    toCsv = ["midband test", arg, date];
    writeCSV();
});
ipcRenderer.on("guitar test", (event, arg) =>{
    if (arg == "success"){
        gainGuitarled.style.background = "green";
        ipcRenderer.send("flat test", "");
        freqFlatled.style.background = "yellow";
    }
    else{
        gainGuitarled.style.background = "red";
    }
    appendConsole("guitar test" + ": " + arg)
    let date = new Date();
    toCsv = ["guitar test", arg, date];
    writeCSV();
});
ipcRenderer.on("flat test", (event, arg) =>{
    if (arg == "success"){
        freqFlatled.style.background = "green";
        ipcRenderer.send("bass test", "");
        freqBassled.style.background = "yellow";
    }
    else{
        freqFlatled.style.background = "red";
    }
    appendConsole("flat test" + ": " + arg)
    let date = new Date();
    toCsv = ["flat test", arg, date];
    writeCSV();
});
ipcRenderer.on("bass test", (event, arg) =>{
    if (arg == "success"){
        freqBassled.style.background = "green";
        ipcRenderer.send("treble test", "");
        freqTrebleled.style.background = "yellow";
    }
    else{
        freqBassled.style.background = "red";
    }
    appendConsole("bass test" + ": " + arg)
    let date = new Date();
    toCsv = ["bass test", arg, date];
    writeCSV();
});
ipcRenderer.on("treble test", (event, arg) =>{
    if (arg == "success"){
        freqTrebleled.style.background = "green";
        ipcRenderer.send("pres test", "");
        freqPresled.style.background = "yellow";
    }
    else{
        freqTrebleled.style.background = "red";
    }
    appendConsole("treble test" + ": " + arg)
    let date = new Date();
    toCsv = ["treble test", arg, date];
    writeCSV();
});
ipcRenderer.on("pres test", (event, arg) =>{
    if (arg == "success"){
        freqPresled.style.background = "green";
        ipcRenderer.send("aux test", "");
        auxled.style.background = "yellow";
    }
    else{
        freqPresled.style.background = "red";
    }
    appendConsole("pres test" + ": " + arg)
    let date = new Date();
    toCsv = ["pres test", arg, date];
    writeCSV();
});
ipcRenderer.on("aux test", (event, arg) =>{
    if (arg == "success"){
        auxled.style.background = "green";
        ipcRenderer.send("pow test", "");
        powled.style.background = "yellow";
    }
    else{
        auxled.style.background = "red";
    }
    appendConsole("aux test" + ": " + arg)
    let date = new Date();
    toCsv = ["aux test", arg, date];
    writeCSV();
});
ipcRenderer.on("pow test", (event, arg) =>{
    if (arg == "success"){
        powled.style.background = "green";
        canvas.style.visibility='visible';
    }
    else{
        powled.style.background = "red";
    }
    appendConsole("pow test" + ": " + arg)
    let date = new Date();
    toCsv = ["pow test", arg, date];
    writeCSV();
});
*/

//result console
//clear console on start tests click
const manufConsole = document.getElementById("manufConsole");
function clearConsole(){
    manufConsole.innerHTML = '';
    var node = document.createElement('li');
    node.appendChild(document.createTextNode("Console - Test Results:"));
    manufConsole.appendChild(node);
    console.log("console cleared");
}
//append to console when received from main.js
function appendConsole(data){
    var node = document.createElement('li');
    node.appendChild(document.createTextNode(data));
    manufConsole.appendChild(node);
    console.log("added to console: " + data);
}







//write to CSV
if(document.getElementById("manufExcelPath").value != ""){ //a csv is actually specified
    const ws = fs.createWriteStream(pathDisplay.value);
    fastcsv.write(data, { headers: true }).pipe(ws);
}


function writeCSV(){
    if(document.getElementById("manufExcelPath").value != ""){ //a csv is actually specified
        fs.stat(document.getElementById("manufExcelPath").value, function (err, stat) {
            if (err == null) {
                console.log('File exists');
            
                //write the actual data and end with newline
                toCsv = toCsv + newLine;
                fs.appendFile(document.getElementById("manufExcelPath").value, toCsv, function (err) {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                });
            } 
            else {
                console.log("something went wrong writing to file");
            }
        });
    }
}

function writeConsoleAndCSV(test, passed){
    appendConsole(test + ": " + passed)
    date = new Date();
    toCsv = [date, test, "", "", passed];
    writeCSV();
}
