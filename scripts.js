// Sets the view variables and sets the SchoolView to be visible on page load and hides ClassView
const schoolView = document.getElementById('selectschool');
const classView = document.getElementById('selectclass');
schoolView.style.display = 'block';
classView.style.display = 'none';

// Global variable to save the id of the currently viewed school (default is zero if no schools selected)
let currentSchoolNumber = 0;
// Array to store classes that are added by the user
let savedClassList = [];
let transferWorkList = document.getElementById('transferworktable');

/*  ----------

# REGION - School View
# All code and functionality for the school viewer

----------- */

// Awaits for the schoolList array to populate, then fills the table in HTML
let schoolList = await fetchSchoolList();
populateSchools(schoolList);

// A temporary object-array to help handle class data before parsing
let tempClassList = [{}];
// The actual object-array that is used to display the results
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
    // Waits for the classList to populate before displaying the data
    await fetchClassList();
    document.getElementById('selectschool').style.display = 'none';
    document.getElementById('selectclass').style.display = 'block';
    document.getElementById('schoolname').textContent = schoolName;
    for(let i in classList) {
        if(classList[i].number == currentSchoolNumber) {
            $("#classtable").append(
                "<li><div><div class='classInfo'>" +
                classList[i].name + " - (" + classList[i].code + ")</div><button class='classAdd' id='classAdd" + 
                classList[i].number + classList[i].code + "'>+ Add</button></div></li>"   
            );

            document.getElementById("classAdd" + classList[i].number + classList[i].code).addEventListener('click', () => {
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
                    classList[i].name + " - (" + classList[i].code + ")</div><button class='classAdd' id='classAdd" + classList[i].number + classList[i].code + "'>+ Add</button></div></li>" 
                );
                document.getElementById("classAdd" + classList[i].number + classList[i].code).addEventListener('click', () => {
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
function RemoveClassFromList(course) {
    let newClassList = [];
    for(let i in savedClassList) {
        if (!(savedClassList[i].number == course.number && savedClassList[i].code == course.code && savedClassList[i].name == course.name))
        {
            newClassList.push(savedClassList[i])
        }
    }
    savedClassList = newClassList;
    RefreshList();
}

// Refreshes the transfer work table list
// Called when a class is added or removed from the list
function RefreshList() {
    $("#transferworktable").empty();
    for(let i in savedClassList) {
        // Checks how many records each class has to determine the CSS styling required
        if (savedClassList[i].records == 1) {
            $("#transferworktable").append(
                "<li><div class='transferitem'><div style='float:left;width:40%'>" +
                savedClassList[i].name + " - (" + savedClassList[i].code + ")</div><div style='float:left;width:5%;'>→</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv0 + " - (" + savedClassList[i].classification0 +
                "-LEVEL)</div><div style='float:left;width:15%;'><button class='matrixRemoveButton' id='matrixRemove" + savedClassList[i].number + savedClassList[i].code + "'>- Remove</button></div></div></li>"    
            );
        } else if (savedClassList[i].records == 2) {
            $("#transferworktable").append(
                "<li><div class='transferitem2'><div style='float:left;width:40%'>" +
                savedClassList[i].name + " - (" + savedClassList[i].code + ")</div><div style='float:left;width:5%;'>→</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv0 + " - (" + savedClassList[i].classification0 +
                "-LEVEL)</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv1 + " - (" + savedClassList[i].classification1 +
                "-LEVEL)</div><div style='float:left;width:15%;'><button class='matrixRemoveButton' id='matrixRemove" + savedClassList[i].number + savedClassList[i].code + "'>- Remove</button></div></div></li>"    
            );
        } else {
            $("#transferworktable").append(
                "<li><div class='transferitem3'><div style='float:left;width:40%'>" +
                savedClassList[i].name + " - (" + savedClassList[i].code + ")</div><div style='float:left;width:5%;'>→</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv0 + " - (" + savedClassList[i].classification0 +
                "-LEVEL)</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv1 + " - (" + savedClassList[i].classification1 +
                "-LEVEL)</div><div style='float:left;width:40%;'>" +
                savedClassList[i].equiv2 + " - (" + savedClassList[i].classification2 +
                "-LEVEL)</div><div style='float:left;width:15%;'><button class='matrixRemoveButton' id='matrixRemove" + savedClassList[i].number + savedClassList[i].code + "'>- Remove</button></div></div></li>"    
            );
        }

        document.getElementById('matrixRemove' + savedClassList[i].number + savedClassList[i].code).addEventListener('click', function(e) {
            RemoveClassFromList(savedClassList[i])
        });
    }
}



/*  ----------

# REGION - Unl Parsing
# All code and functionality for fetching and handling of data files

----------- */

// Fetches the names.unl file and loads the school/institution list into an object format
async function fetchSchoolList() {
    let response = await fetch("names.unl");                // Waits for response from server
    if (response.status === 200) {                          // If response is good (sig 200), receive as text
        let data = await response.text();
        console.log("Pulled school list from file");
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
    } else {

    }
}


// Fetches the courses.unl file, parses through the data to check for and group mutliple values, then creates an array of class objects
async function fetchClassList() {
    // Empties the current class list
    classList = [{}];
    let response = await fetch("courses.unl");              // Waits for response from server
    if (response.status === 200) {                          // If response is good (sig 200), receive as text
        let data = await response.text();
        console.log("Pulled class list from file");
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
                // Makes sure object sent is not an empty prototype and adds to temporary array
                if (temp.hasOwnProperty("number")) {
                    tempClassList.push({"number" : temp.number, "code" : temp.code, "name" : temp.name, "equiv0" : temp.equiv, "date0" : temp.date, "type0" : temp.type, "classification0" : temp.classification, "records" : 1});
                }
            }
        });
        // Checks for duplicated entries based on institution, course code, and name
        // These courses are then lumped into a singular class to select with multiple values and output to the classList array
        tempClassList.map(v => {
            if (v.hasOwnProperty("number")) {
                let dupes = tempClassList.filter(e => e.number === v.number && e.code === v.code);
                let length = dupes.length
                let obj = {};
                // Makes sure datapoint isn't empty, then assigns values
                if (length != 0) {
                    obj.number = dupes[0].number;
                    obj.code = dupes[0].code;
                    obj.name = dupes[0].name;
                    obj.records = length;
                    obj.equiv0 = dupes[0].equiv0;
                    obj.date0 = dupes[0].date0;
                    obj.classification0 = dupes[0].classification0;
                    // If multiple datapoints exist for the same class, adds the values to the corresponding object
                    if (length >= 2)
                    {
                        try {
                            tempClassList = tempClassList.filter(function(el) { return el.number != dupes[0].number && el.code != dupes[0].code; });
                        } catch {
                            console.log("Something went wrong filtering the temp class, attempting to continue")
                        }
                        obj.equiv1 = dupes[1].equiv0;
                        obj.date1 = dupes[1].date0;
                        obj.classification1 = dupes[1].classification0;
                        if (length >= 3) {
                            obj.equiv2 = dupes[2].equiv0;
                            obj.date2 = dupes[2].date0;
                            obj.classification2 = dupes[2].classification0;
                        }
                    }
                    classList.push(obj);
                }
            }
        });
    }
}