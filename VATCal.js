let darkMode=false;
const historyList=[];

// Function to change the themes
function toggleTheme(){
    darkMode=!darkMode;
    const body=document.getElementById("body");
    body.className=darkMode?"dark":"light";
}

function switchMode(){
    const mode=document.getElementById("modeSelect").value;
    const rateField=document.getElementById("vatRate");
    const label=document.getElementById("rateLabel");

    if(mode==="vat"){
        rateField.disabled= false;
        label.innerText="Enter the VAT %";
        rateField.placeholder="e.g. 9% or 21% or any x % ";
    }
    else{
        rateField.disabled= true;
        label.innerText="Rate will be calculated";
        rateField.placeholder="Warning, no need to enter any value, it will be calculated.";
    }

    clearResults();
}


// Function to clear result
function clearResults(){
    document.getElementById("results").innerHTML="";
}

//Function to clear all the fields, previously entered.
function clearFields(){
    document.getElementById("vatRate").value="";
    document.getElementById("vatExcl").value="";
    document.getElementById("vatAmount").value="";
    document.getElementById("vatIncl").value="";
    clearResults();
}


//Function to calculate all the values incl, excl or vat
function calculate(){
    const mode=document.getElementById("modeSelect").value;                 //To get the mode entered by user
    const vatRate= parseFloat(document.getElementById("vatRate").value);    //To get the vat rate
    const vatExcl=parseFloat(document.getElementById("vatExcl").value);     //To get the vatExcl
    const vatAmount=parseFloat(document.getElementById("vatAmount").value); //To get the vat amount
    const vatIncl=parseFloat(document.getElementById("vatIncl").value);     //To get the vatIncl
    const resultDiv=document.getElementById("results");                     //Result Field

    let output="";

    if(mode==="vat"){
        if(isNaN(vatRate) || vatRate<=0){
            alert("Please enter a valid VAT % ");
            return  ;
        }

        const values=[vatExcl, vatAmount, vatIncl].filter(v=>!isNaN(v));
        if(values.length!==1){
            alert("Enter exactly one value out of 3, vat or excl or incl");
            return;
        }

        //Part of the mathematical calculations
        let excl=0, vat=0, incl=0;

        if(!isNaN(vatExcl)){
            excl = vatExcl;
            vat = excl * vatRate / 100;
            incl= excl+vat;
        }
        else if(!isNaN(vatAmount)){
            vat=vatAmount;
            excl=(vat *100)/ vatRate;
            incl=vat+excl;
        }
        else if(!isNaN(vatIncl)){
            incl=vatIncl;
            excl=incl / (1+(vatRate/100))
            vat=incl-excl;
        }

        output +=`
        <p> Amount Exclusive VAT : ${excl.toFixed(2).replace('.' , ',')}</p>
        <p> VAT Amount : ${vat.toFixed(2).replace('.' , ',')}</p>
        <p> Amount Inclusive VAT : ${incl.toFixed(2).replace('.' , ',')}</p>
        `;

        addToHistory(`Mode: VAT → Excl: ${excl.toFixed(3)}, VAT: ${vat.toFixed(3)}, Incl:${incl.toFixed(3)}`);
    }
    else if(mode==="rate"){ //If user opts to calculate the vat amount.
        const combo1= !isNaN(vatAmount) && !isNaN(vatExcl);
        const combo2= !isNaN(vatExcl) && !isNaN(vatIncl);
        const combo3= !isNaN(vatAmount) && !isNaN(vatIncl);

        let rate=0;
        if(combo1){
            rate=(vatAmount / vatExcl)*100;
        }
        else if(combo2){
            rate=( (vatIncl-vatExcl) / vatExcl)* 100;
        }
        else if(combo3){
            rate=( vatAmount / (vatIncl-vatAmount) )* 100;
        }
        else{
            alert("Please enter atleast two values to calculate the VAT %");
            return;
        }

        output +=`<p> Calculated VAT % : ${rate.toFixed(2)}%</p>`;
        addToHistory(`Mode: RATE → Calculated VAT % : ${rate.toFixed(2)}% `);
    }

    resultDiv.innerHTML=output;
}

// Function to add to the History of previous calculations
function addToHistory(entry){
    historyList.unshift(entry);
        const historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "<strong>History: </strong>" 
        + historyList.slice(0,5).map(ele => `<p> ${ele} </p>`).join('');
}

// Initialize on page load
switchMode();

