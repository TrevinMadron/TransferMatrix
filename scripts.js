
// Sets the view variables and sets the SchoolView to be visible on page load and hides ClassView
const schoolView = document.getElementById('selectschool');
const classView = document.getElementById('selectclass');
schoolView.style.display = 'block';
classView.style.display = 'none';

// Global variable to save the id of the currently viewed school (default is zero if no schools selected)
let currentSchoolNumber = 0;
// Array to store classes that are added by the end user
let savedClassList = [];
let transferWorkList = document.getElementById('transferworktable');

/*  ----------

# REGION - School View
# All code and functionality for the school viewer

----------- */

const schoolSearchBox = document.getElementById('schoolsearch')
let schoolList = [
    {
        "number" : "1",
        "name" : "ABILENE WY CHRISTIAN UNIV",
        "state" : "WY"
    },
    {
        "number" : "2",
        "name" : "ACADEMY OF ART UNIV CA",
        "state" : "CA"
    },
    {
        "number" : "3",
        "name" : "ACT EDUC SOLUTIONS NO SYDNEY AS",
        "state" : "ZZ"
    },
    {
        "number" : "4",
        "name" : "ADAMS STATE UNIV ALAMOSA CO",
        "state" : "CO"
    },
    {
        "number" : "5",
        "name" : "ADELPHI UNIV GARDEN CITY NY",
        "state" : "NY"
    },
    {
        "number" : "6",
        "name" : "TEST SCHOOL THINGY",
        "state" : "OK"
    },
]

// RUNS ON PAGE LOAD - Adds all schools to list and adds event listener to each element for click detection
$("#schooltable").empty();
for(let i in schoolList) {
    $("#schooltable").append(
        "<li><button id='" + schoolList[i].number + "'>" +
        schoolList[i].name + " - (" + schoolList[i].state + ")" +
        "</button></li>"   
    );
    document.getElementById(schoolList[i].number).addEventListener('click', () => {
        selectSchool(schoolList[i].number, schoolList[i].name);
        });
}

// Monitors for changes in the school search box and updates school list
const schoolInputHandler = function(e) {
    $("#schooltable").empty();
    let search = e.target.value;

    for(let i in schoolList){
        if(schoolList[i].name.toLowerCase().includes(search.toLowerCase()) || schoolList[i].state.toLowerCase().includes(search.toLowerCase())){
            $("#schooltable").append(
                "<li><button id='" + schoolList[i].number + "'>" +
                schoolList[i].name + " - (" + schoolList[i].state + ")" +
                "</button></li>"   
            );
            document.getElementById(schoolList[i].number).addEventListener('click', () => {
                selectSchool(schoolList[i].number, schoolList[i].name);
                });
        }
    }
    }
schoolSearchBox.addEventListener('input', schoolInputHandler);


// Loads class list based on selected (clicked) school and appends classes to list
function selectSchool(schoolNumber, schoolName) {
    // Sets global current school variable to currently selected school
    currentSchoolNumber = schoolNumber;

    document.getElementById('selectschool').style.display = 'none';
    document.getElementById('selectclass').style.display = 'block';

    document.getElementById('schoolname').textContent = schoolName;

    for(let i in classList) {
        if(classList[i].number == currentSchoolNumber) {
            if(classList[i].number == schoolNumber) {
                $("#classtable").append(
                    "<li><div><div class='classInfo'>" +
                    classList[i].name + " - (" + classList[i].code + ")</div><button class='classAdd' id='" +
                    classList[i].code + "'>+ Add</button></div></li>"   
                );

                document.getElementById(classList[i].code).addEventListener('click', () => {
                    AddClassToList(classList[i])
                });
            }
        }
    }
}

/*  ----------

# REGION - Class View
# All code and functionality for the class viewer

----------- */

const classSearchBox = document.getElementById('classsearch')
// Sends ClassView back to SchoolView and empties the class table
const navBackButton = document.getElementById("navbackbutton")
navBackButton.addEventListener('click', () => {
    currentSchoolNumber = 0;
    $("#classtable").empty();

    document.getElementById('selectschool').style.display = 'block';
    document.getElementById('selectclass').style.display = 'none';
});

let classList = [
    {
        "number" : "4",
        "code" : "AR 103",
        "name" : "ART AWARENESS",
        "equiv" : "ART   0000",
        "date" : "1/15/1940;7/30/2002",
        "type" : "UNI",
        "classification" : "LOWER"
    },
    {
        "number" : "4",
        "code" : "MATH 099",
        "name" : "ALGEBRA SKILLS",
        "equiv" : "MATH 1113",
        "date" : "1/15/1940;7/30/2004;",
        "type" : "UNI",
        "classification" : "LOWER"
    },
    {
        "number" : "4",
        "code" : "BUS 103",
        "name" : "INTRO TO BUSINESS",
        "equiv" : "BUS 1113",
        "date" : "1/15/1940;;",
        "type" : "UNI",
        "classification" : "LOWER"
    }
]

// Monitors for changes in the class search box and updates class list
const classInputHandler = function(e) {
    $("#classtable").empty();
    let search = e.target.value;

    for(let i in classList){
        if(classList[i].number == currentSchoolNumber) {
            if(classList[i].name.toLowerCase().includes(search.toLowerCase()) || classList[i].code.toLowerCase().includes(search.toLowerCase())){
                $("#classtable").append(
                    "<li><div><div class='classInfo'>" +
                    classList[i].name + " - (" + classList[i].code + ")</div><button id='classAdd'>+ Add</button></div></li>"    
                );

                document.getElementById(classList[i].code).addEventListener('click', () => {
                    AddClassToList(classList[i])
                });
            }
        }
    }
    }
classSearchBox.addEventListener('input', classInputHandler);

function AddClassToList(course) {
    savedClassList.push(course)
    RefreshList();
}

function RemoveClassFromList(number, course) {
    savedClassList = savedClassList.filter(function(e) {return e.number != number && e.course != course});
    RefreshList();
}

function RefreshList() {
    $("#transferworktable").empty();
    for(let i in savedClassList){
        $("#transferworktable").append(
            "<li><div class='transferitem'><div style='float:left;width:40%'>" +
            savedClassList[i].name + " - (" + savedClassList[i].code + ")</div><div style='float:left;width:5%;'>→</div><div style='float:left;width:40%;'>" +
            savedClassList[i].equiv + " - (" + savedClassList[i].classification +
            "-LEVEL)</div><div style='float:left;width:15%;'><button class='matrixRemoveButton' id='matrixRemove" + savedClassList[i].code + "'>- Remove</button></div></div></li>"    
        );

        document.getElementById('matrixRemove' + savedClassList[i].code).addEventListener('click', function(e) {
            RemoveClassFromList(this.parentNode.number, this.parentNode.course)
            
        });
    }
}


/*var txtFile = new XMLHttpRequest();
txtFile.open("GET", "https://ecutransfermatrix.s3.us-east-2.amazonaws.com/names.uml", true);
txtFile.onreadystatechange = function() {
    alert(txtFile.readyState);
  if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
    if (txtFile.status === 200) {  // Makes sure it's found the file.
      allText = txtFile.responseText;
      lines = txtFile.responseText.split("\n"); // Will separate each line into an array
      alert(allText);
    }
  }
}

/* Will be (somehow) used to incorporate the data files into the site
function getSchoolList() {
    let delimiter = ";"
    const reader = new FileReader()
    reader.readAsText()

    reader.onload = function (e) {
        const text = e.target.result;
        const data = umlToArray(text);
        };

    const rows = str.slice(str.indexOf("\n")).split("\n");

    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

const client = new S3Client({})

export const main = async () => {
  const command = new GetObjectCommand({
    Bucket: "ecutransfermatrix",
    Key: "names.uml"
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }
};*/