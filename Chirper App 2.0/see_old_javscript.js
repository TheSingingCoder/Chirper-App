//Chirper App Object
var ChApp = {};

//------------------------------------------------------
// Objeccts for App
//------------------------------------------------------

//Each Friend Object - Constructor
ChApp.Friends = function (name, firebaseURL) {
    this.name = name;
    this.firebaseURL = firebaseURL;
};

//Each Private Message - Constructor
ChApp.PrivateMessages = function (name, message) {
    this.name = name;
    this.message = message;
    this.timestamp = Date.now();
};

//My Profile
ChApp.AboutMe = {
    bio: "I am a proud active Coder Camps camper.",
    picture: "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-frc1/t1.0-9/271195_571030869106_3257453_n.jpg"
};

//My Pubic "chirps" = Constructor
ChApp.Chirps = function (chirp) {
    this.chirp = chirp;
    this.timestamp = Date.now();
    this.user = "Allison";
};

//Array of chirps
ChApp.chirps = [];

//Array to push friends into later
ChApp.friends = [];

//Friend Objects
var Allison = new ChApp.Friends('Allison', 'https://chirper-allison.firebaseio.com');
var Aaron = new ChApp.Friends('Aaron', 'https://chirppel.firebaseio.com');
var Kiyo = new ChApp.Friends('Kiyo', 'https://w2-weekend-chirped.firebaseio.com');
var Laura = new ChApp.Friends('Laura', 'https://twitterclone7172014.firebaseio.com');
var James = new ChApp.Friends('James', 'https://chirrperapp.firebaseio.com');
var Antonio = new ChApp.Friends('Antonio', 'https://alewischirps.firebaseio.com');
var Ashton = new ChApp.Friends('Ashton', 'https://ashtonsocialmedia.firebaseio.com');

//Push Friends into Array
ChApp.friends.push(Allison, Aaron, Antonio, Ashton, Kiyo, Laura, James);

//Array of Friends Chirps
ChApp.friendsChirps = [];


//Array of Private Messages to Friends
ChApp.privatemessages = [];
//------------------------------------------------------
// Functions
//------------------------------------------------------

//Function to Make URLS
ChApp.makeURL = function (baseURL, arr) {
    if (!baseURL) {
        alert("You are not friends with this person");
    }
    if (!arr) {
        arr = [];
    }
    return baseURL + "/" + arr.join("/") + "/.json";
};

//Add Message to own Wall
ChApp.addMessage = function () {
    var chirp = document.getElementById('inputMessage').value;
    if (chirp.length <= 140) {
        var message = new ChApp.Chirps(chirp);
        var URL = ChApp.makeURL("https://chirper-allison.firebaseio.com", ["chirps"]);
        ChApp.sendChirpToFirebase(message, URL);
        ChApp.chirps.unshift(message);
        ChApp.drawTable();
        document.getElementById('inputMessage').value = "";
    }
    else {
        alert("Please enter 140 characters or less.");
    }
};


//Draw Message Table Function
ChApp.drawTable = function () {
    var holder = "";
    holder += "<table id='messageTable'>"
    holder += "<tr><th> Message </th><th>Time </th></tr>";
    for (var i in ChApp.chirps) {
        holder += "<tr> <td>" + ChApp.chirps[i].chirp + "</td>";
        holder += "<td>" + dateFormat(ChApp.chirps[i].timestamp) + "</td> </tr>";
    }
    holder += "</table>";
    document.getElementById('messageDiv').innerHTML = holder;
};

//AJAX Command
ChApp.Ajax = function (verb, url, success, failure, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(verb, url);
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            console.log("Success: " + this.status);
            var response = JSON.parse(this.response);
            if (typeof success === "function") {
                success(response);
                console.log(response);
            }
            else {
                console.log("Success parameter must be a function.");
            }
        }
        else {
            //console.log("Error: " + this.status);
            if (typeof failure === "function") {
                console.log("Error: " + this.status + ": " + this.response);
                failure("Error: " + this.status + ": " + this.response);
            }
            else {
                console.log("Failure parameter must be a function.")
            }
        }
    };
    xhr.onerror = function () {
        console.log("Communication Error");
        if (typeof failure === "function") {
            failure("Communication Error");
        }
        else {
            console.log("Failure parameter must be a function.")
        }
    };
    xhr.send(JSON.stringify(data));
};

//Send My Chirp to Firebase
ChApp.sendChirpToFirebase = function (post, URL) {
    var success = function (data) {
        //Firebase ID
        ChApp.firebaseId = data.name;
        //Push Chirps object into chirps array
        ChApp.chirps.unshift(post);
    };
    var failure = function () {
        alert('There was an error please try again.');
    };
    ChApp.Ajax("POST", URL, success, failure, post);
};



//Get One Person's Messages from Firebase
ChApp.getAllFromFirebase = function (URL) {
    var success = function (data) {
        ChApp.chirps = [];
        for (var i in data) {
            data[i].firebaseId = i;
            ChApp.chirps.push(data[i]);
        }
        ChApp.chirps.sort(function (a, b) {
            if (a.timestamp < b.timestamp) {
                return 1;
            }
            else if (b.timestamp < a.timestamp) {
                return -1;
            }
            else {
                return 0;
            }
        });
        ChApp.drawTable();
    };
    ChApp.Ajax("GET", URL, success, alert, null);
};

//Date Format
var dateFormat = function (x) {
    var d = new Date(x);
    var dayHour = d.getHours();
    var timeofDay = 'am';
    if (dayHour > 12) {
        dayHour = dayHour - 12;
        timeofDay = 'pm';
    }
    var dayMinutes = d.getMinutes();
    if (dayMinutes < 10) {
        dayMinutes = '0' + dayMinutes.toString();
    }
    var daySeconds = d.getSeconds();
    if (daySeconds < 10) {
        daySeconds = '0' + daySeconds.toString();
    }
    var dayWeek = d.getDay();
    var dayNames = ["Sunday", 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    dayWeek = dayNames[dayWeek]
    var dayMonth = d.getDate();
    var month = d.getMonth();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    month = monthNames[month];
    var year = d.getFullYear();
    var startDate = d.getTime();
    var date = dayHour + ":" + dayMinutes + "    " + timeofDay + " " + dayWeek;
    //+ " - " + month + " " + dayMonth + ", " + year;
    return date;
}


//View My Profile Function
ChApp.viewMyProfile = function () {
    var holder = "<img id='profilePict' style='border-radius: 10px;' src='" + ChApp.AboutMe.picture + "'/>";
    holder += "<p>" + ChApp.AboutMe.bio + "</p>";
    holder += "<button type='button' class='btn btn-default'id='message-button' onclick='ChApp.editMyProfile()'>Edit Profile</button>";
    document.getElementById("profileDiv").innerHTML = holder;
};

//View Friends Profile Function
ChApp.viewFriendsProfile = function (i) {
    var holder = "<img id='profilePict' src='" + ChApp.friendsProfile[0].picture + "'/>";
    holder += "<p>" + ChApp.friendsProfile[0].bio + "</p>";
    holder += "<button type='button' class='btn btn-default'id='message-button' onclick='ChApp.seePM()'>Message</button>";
    document.getElementById("profileDiv").innerHTML = holder;
};

//Get Friend's Profile from Firebase
var friendNumber = 0;
ChApp.getFriendsProfile = function (i) {
    var url = ChApp.makeURL(ChApp.friends[i].firebaseURL, ['AboutMe']);
    var success = function (rdata) {
        ChApp.friendsProfile = [];
        for (var j in rdata) {
            rdata[j].firebaseId = j;
            ChApp.friendsProfile.push(rdata[j]);
        }
        console.log(ChApp.friendsProfile);
        friendNumber = i;
        ChApp.viewFriendsProfile();
    };
    var failure = function () {
        alert("Error.  Please try again.");
    };

    ChApp.Ajax("GET", url, success, failure, null);
    ChApp.getAllFromFirebase(ChApp.makeURL(ChApp.friends[i].firebaseURL, ["chirps"]));
};

//Edit My Profile Modal
ChApp.editMyProfile = function () {
    var holder = "<div class='input-group profile-edit'>";
    holder += "Biography <br/>"
    holder += "<input type='text' placeholder='Bio' id='bio-input' class='profile-input form-control'>";
    holder += "</div><br/>";
    holder += "Picture Link <br/>"
    holder += "<div class='input-group profile-edit'>";
    holder += "<input type='text' placeholder='Picture Link' id='pict-input' class='profile-input form-control'><br/>";
    holder += "<img id='profilePict' style='border-radius: 10px;' src='" + ChApp.AboutMe.picture + "'/>";
    holder += "</div> <br/>";
    document.getElementById('modal-title').innerHTML = "Edit Profile";
    document.getElementById('modalBody').innerHTML = holder;
    document.getElementById('bio-input').value = ChApp.AboutMe.bio;
    document.getElementById('pict-input').value = ChApp.AboutMe.picture;

    var h = "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>";
    h += "<button type='button' class='btn btn-primary' onclick='ChApp.editProfileFirebase()'>Save changes</button>";
    document.getElementById('modal-buttons').innerHTML = h;

    $('#modal-timeline').modal();
};

//Private Message Modal
ChApp.seePM = function (x) {
    //Message Table
    var h = "<table class='table'>"
    for (var i in ChApp.PrivateMessages) {
        if (ChApp.PrivateMessages[i].name === x) {
            h += "<tr><td>" + ChApp.PrivateMessages[i].message + "</td>"
            h += "<td>" + dateFormat(ChApp.PrivateMessages[i].timestamp) + "</td></tr>"
        }
    };


    //New Message
    document.getElementById('modal-title').innerHTML = "Messages to " + ChApp.friends[friendNumber].name;
    var holder = "<div class='input-group profile-edit'>";
    holder += "<input type='text' placeholder='Message' id='pm-input' class='profile-input form-control'><br/>";
    document.getElementById('modalBody').innerHTML = holder;


    //Buttons
    var holder2 = "<button class='btn btn-default' data-dismiss='modal'>Close</button>";
    holder2 += "<button class='btn btn-primary' onclick='ChApp.sendPMToFirebase(" + friendNumber + ")'> Send </button>";
    console.log(holder2);
    document.getElementById('modal-buttons').innerHTML = holder2;

    $('#modal-timeline').modal();
};

//Patch About Me om Firebase
ChApp.editProfileFirebase = function () {
    ChApp.AboutMe.bio = document.getElementById('bio-input').value;
    ChApp.AboutMe.picture = document.getElementById('pict-input').value;
    var url = ChApp.makeURL('https://chirper-allison.firebaseio.com', ['AboutMe']);
    var success = function () {
        ChApp.firebaseId = ChApp.AboutMe.name;
        ChApp.viewMyProfile();
    };
    var failure = console.log("Your profile did not update, please try again.");
    var data = ChApp.AboutMe;
    ChApp.Ajax("PATCH", url, success, failure, data);
    $('#modal').modal('hide');
};

//Get About Me from Firbase
ChApp.getProfilefromFirebase = function () {
    var url = ChApp.makeURL('https://chirper-allison.firebaseio.com', ['AboutMe']);
    var success = function () {
        ChApp.viewMyProfile();
    };
    var failure = console.log("getProfileFromFirebase error.");
    ChApp.Ajax("GET", url, success, failure, null);
};

//Friends Table Function
ChApp.drawFriendsTable = function () {
    holder = "<table class='table' id='friendsTable'>";
    for (var i in ChApp.friends) {
        holder += "<tr> <td>" + ChApp.friends[i].name + "</td>";
        //holder += "<tr> <td><button><iclass='fa fa-plus-square-o'></i></button>";
        holder += "<td><i class='fa fa-minus-square-o btn btn-danger'></i>";
        holder += "<i class='fa fa-user btn btn-success' onclick='ChApp.getFriendsProfile(" + i + ")'></i></td></tr>";
    }
    holder += "</table>";
    document.getElementById("friendsDiv").innerHTML = holder;
};


//On Page Load Functions
ChApp.drawFriendsTable();
ChApp.viewMyProfile();
ChApp.getAllFromFirebase(ChApp.makeURL("https://chirper-allison.firebaseio.com", ["chirps"]));

//Timeline Button
ChApp.createTimeline = function () {
    ChApp.friendsChirps = [];
    counter = 0;
    for (var i in ChApp.friends) {
        //GET function for Timeline
        var url = ChApp.makeURL(ChApp.friends[i].firebaseURL, ['chirps']);
        console.log(url);
        var success = function (data) {
            for (var j in data) {
                ChApp.friendsChirps.push(data[j]);
            };
            console.log(ChApp.friendsChirps);
            ChApp.friendsChirps.sort(function (a, b) {
                if (a.timestamp < b.timestamp) {
                    return 1;
                }
                else if (b.timestamp < a.timestamp) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            //Place if to draw table 
            if (ChApp.friends.length == counter) {
                ChApp.seeTimeline();
            }
        };
        var failure = console.log("Error on " + ChApp.friends[i].name);

        ChApp.Ajax("GET", url, success, failure);
        counter++;
        console.log(counter);
    }
};
ChApp.seeTimeline = function () {

    var holder = "<table>";
    for (var i in ChApp.friendsChirps) {
        holder += "<tr><td>" + ChApp.friendsChirps[i].user + "</td>";
        holder += "<td>" + ChApp.friendsChirps[i].chirp + "</td>";
        holder += "<td>" + dateFormat(ChApp.friendsChirps[i].timestamp) + "</td></tr>";

    }
    holder += "</table>";

    document.getElementById('modalBody').innerHTML = holder;
    $('#modal-timeline').modal();
};

//Add New PM to Friend


//Send PM to friends
ChApp.sendPMToFirebase = function (i) {
    var message = document.getElementById('pm-input').value;
    var name = ChApp.friends[i].name
    var url = ChApp.makeURL("https://chirper-allison.firebaseio.com", ['PrivateMessages']);
    var PM = new ChApp.PrivateMessages(name, message);
    var success = function (data) {
        ChApp.firebaseId = data.name;
        ChApp.privatemessages.push(data);
    }
    var failure = function () {
        alert("Your message did not go through, please try again")
    };
    ChApp.Ajax("PUT", url, success, failure, PM);
    document.getElementById('pm-input').value = '';
};

/* ChApp.sendChirpToFirebase = function (post, URL) {
    var success = function (data) {
        //Firebase ID
        ChApp.firebaseId = data.name;
        //Push Chirps object into chirps array
        ChApp.chirps.unshift(post);
    };
    var failure = function () {
        alert('There was an error please try again.');
    };
    ChApp.Ajax("POST", URL, success, failure, post);
}; */