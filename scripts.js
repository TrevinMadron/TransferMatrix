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

let schoolList = await fetchSchoolList();
populateSchools(schoolList);
let classList = [{}];

// RUNS ON PAGE LOAD - Adds all schools to list and adds event listener to each element for click detection
function populateSchools(schoolList) {
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
}

// School search box functionality
const schoolSearchBox = document.getElementById('schoolsearch')
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
async function selectSchool(schoolNumber, schoolName) {
    // Sets global current school variable to currently selected school
    currentSchoolNumber = schoolNumber;
    await fetchClassList();
    document.getElementById('selectschool').style.display = 'none';
    document.getElementById('selectclass').style.display = 'block';
    document.getElementById('schoolname').textContent = schoolName;
    for(let i in classList) {
        if(classList[i].number == currentSchoolNumber) {
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

/*  ----------

# REGION - Class View
# All code and functionality for the class viewer

----------- */

// Back Button -- Sends ClassView back to SchoolView and empties the class table
const navBackButton = document.getElementById("navbackbutton")
navBackButton.addEventListener('click', () => {
    currentSchoolNumber = 0;
    $("#classtable").empty();
    document.getElementById('selectschool').style.display = 'block';
    document.getElementById('selectclass').style.display = 'none';
});

// Class search box functionality
const classSearchBox = document.getElementById('classsearch')
const classInputHandler = function(e) {
    $("#classtable").empty();
    let search = e.target.value;

    for(let i in classList){
        if(classList[i].number == currentSchoolNumber) {
            if(classList[i].name.toLowerCase().includes(search.toLowerCase()) || classList[i].code.toLowerCase().includes(search.toLowerCase())){
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
classSearchBox.addEventListener('input', classInputHandler);

// Adds class to the transfer work table list
// Called from the "+ Add" buttons on the class lists
function AddClassToList(course) {
    savedClassList.push(course)
    RefreshList();
}

// WIP -- Will remove any courses with the same course number regardless of school
// Removes class from the transfer work table list
// Called from the "- Remove" buttons from the transfer work table list
function RemoveClassFromList(number, course) {
    savedClassList = savedClassList.filter(function(e) {
        return e.code != course;
    });
    RefreshList();
}

// Refreshes the transfer work table list
// Called when a class is added or removed from the list
function RefreshList() {
    $("#transferworktable").empty();
    for(let i in savedClassList){
        $("#transferworktable").append(
            "<li><div class='transferitem'><div style='float:left;width:40%'>" +
            savedClassList[i].name + " - (" + savedClassList[i].code + ")</div><div style='float:left;width:5%;'>→</div><div style='float:left;width:40%;'>" +
            savedClassList[i].equiv + " - (" + savedClassList[i].classification +
            "-LEVEL)</div><div style='float:left;width:15%;'><button class='matrixRemoveButton' id='matrixRemove" + savedClassList[i].number + savedClassList[i].code + "'>- Remove</button></div></div></li>"    
        );

        document.getElementById('matrixRemove' + savedClassList[i].number + savedClassList[i].code).addEventListener('click', function(e) {
            RemoveClassFromList(savedClassList[i].number, savedClassList[i].code)
        });
    }
}



/*  ----------

# REGION - Unl Parsing
# All code and functionality for fetching and handling of data files

----------- */

// Fetches the names.unl file and loads the school/institution list into an object format
async function fetchSchoolList() {
    let response = await fetch("names.unl");

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.text();
        let delimiter = ";"
        // Organizes the data into object format
        let structure = "number;name;state;\n";
        const titles = structure.slice(0, structure.indexOf('\n')).split(delimiter);
        
        return data
            .trimEnd()
            .split('\n').map(v => {
            const values = v.split(delimiter);
            return titles.reduce(
                (obj, title, index) => ((obj[title] = values[index]), obj),
                {}
            );
        });
    }
}

async function fetchClassList() {
    // Empties the current class list
    classList = [{}];
    let response = await fetch("courses.unl");
    console.log(response.status); // 200
    console.log(response.statusText); // OK

    // If response is received
    if (response.status === 200) {
        let data = await response.text();
        let delimiter = ";"
        // Structure of the data
        let structure = "number;code;name;equiv;date;;type;classification;\n";
        const titles = structure.slice(0, structure.indexOf('\n')).split(delimiter);
            data.trimEnd().trimEnd().split('\n').map(v => {
            const values = v.split(delimiter);
            // If the school number in the courses.unl file match the currently selected school,
            // read the line and add it to the class list
            if(values[0] == currentSchoolNumber) {
                let temp = titles.reduce(
                    (obj, title, index) => ((obj[title] = values[index]), obj),
                    {}
                )
                classList.push({"number" : temp.number, "code" : temp.code, "name" : temp.name, "equiv" : temp.equiv, "date" : temp.date, "type" : temp.type, "classification" : temp.classification });
            }
        });
    }
}


/*const client = new S3Client({})

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
