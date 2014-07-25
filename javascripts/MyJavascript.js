//Chirper App Object
var ChApp = {};

//------------------------------------------------------
// Objeccts for App
//------------------------------------------------------


//Each Friend Object - Constructor
ChApp.Friends = function (name, firebaseURL, current) {
    this.name = name;
    this.firebaseURL = firebaseURL;
    this.isCurrent = current
};

//Each Private Message - Constructor
ChApp.PrivateMessages = function (name, message) {
    this.name = name;
    this.message = message;
    this.timestamp = Date.now();
    this.myName = "Allison";
};

//My Profile
/*ChApp.AboutMe = {
    bio: "I am a proud active Coder Camps camper.",
    picture: "https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-frc1/t1.0-9/271195_571030869106_3257453_n.jpg"
}; */

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
var Allison = new ChApp.Friends('Allison', 'https://chirper-allison.firebaseio.com', true);
var Aaron = new ChApp.Friends('Aaron', 'https://chirppel.firebaseio.com', true);
var Kiyo = new ChApp.Friends('Kiyo', 'https://w2-weekend-chirped.firebaseio.com', true);
var Laura = new ChApp.Friends('Laura', 'https://twitterclone7172014.firebaseio.com', true);
var James = new ChApp.Friends('James', 'https://chirrperapp.firebaseio.com', true);
var Antonio = new ChApp.Friends('Antonio', 'https://alewischirps.firebaseio.com', true);
var Ashton = new ChApp.Friends('Ashton', 'https://ashtonsocialmedia.firebaseio.com', true);

//Push Friends into Array
ChApp.friends.push(Allison, Aaron, Antonio, Ashton, Kiyo, Laura, James);

//Array of Friends Chirps
ChApp.friendsChirps = [];

ChApp.currentFriends = [];


//Array of Private Messages to Friends
ChApp.privatemessages = [];

ChApp.privateMessagesToMe = [];
//------------------------------------------------------
// Functions
//------------------------------------------------------

//Create Timeline Friends
ChApp.findCurrentFriends = function () {
    ChApp.currentFriends = [];
    for (var i in ChApp.friends) {
        if (ChApp.friends[i].isCurrent === true) {
            ChApp.currentFriends.push(ChApp.friends[i]);
        }
    }
};



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
    }
    else {
        alert("Please enter 140 characters or less.");
    }
};


//Draw Message Table Function
ChApp.drawTable = function () {
    var holder = "";
    holder += "<table class='table-condensed' id='messageTable'>"
    holder += "<tr><th class='chirp-td chirps-heading'> Message </th><th class='timestamp-td chirps-heading'>Time </th></tr>";
    for (var i in ChApp.chirps) {
        holder += "<tr> <td class='chirp-td'>" + ChApp.chirps[i].chirp + "</td>";
        holder += "<td class='timestamp-td'>" + dateFormat(ChApp.chirps[i].timestamp) + "</td> </tr>";
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
        ChApp.drawTable();
        document.getElementById('inputMessage').value = "";
        $('#modal-timeline').modal('hide');
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
    if (dayHour === 0) {
        dayHour = 12;
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
    holder += "<h4>" + ChApp.AboutMe.bio + "<h4>";
    holder += "<button type='button' class='btn btn-info'id='message-button' onclick='ChApp.editMyProfile()'>Edit Profile</button>";
    document.getElementById("profileDiv").innerHTML = holder;
};

//Get My Profile from Firebase
ChApp.getMyProfile = function (i) {
    var url = ChApp.makeURL('https://chirper-allison.firebaseio.com', ['AboutMe']);
    var success = function (rdata) {
        for (var j in rdata) {
            ChApp.AboutMe = rdata;
        }
        ChApp.viewMyProfile();
    };
    var failure = function () {
        alert("Error.  Please try again.");
    };

    ChApp.Ajax("GET", url, success, failure, null);
    ChApp.getAllFromFirebase(ChApp.makeURL("https://chirper-allison.firebaseio.com", ["chirps"]));
};

//View Friends Profile Function
ChApp.viewFriendsProfile = function (i) {
    if (ChApp.friendsProfile.length === 0) {
        var holder = "<h3>" + ChApp.friends[friendNumber].name + "</h3>";
        holder += "<h4>Bio not included</h4>";
    }
    else {
        if (!ChApp.friendsProfile[0].picture) {
            var holder = "<h3>" + ChApp.friends[friendNumber] + "</h3>";
        }
        else {
            var holder = "<img id='profilePict' src='" + ChApp.friendsProfile[0].picture + "'/>";
        }
        if (!ChApp.friendsProfile[0].bio) {
            holder += "<h4>Bio not included</h4>";
        }
        else {
            holder += "<h4>" + ChApp.friendsProfile[0].bio + "</h4>";
        }
    }
    holder += "<button type='button' class='btn btn-info'id='message-button' onclick='ChApp.seePM("+ friendNumber + ")'>Message</button>";
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
        //console.log(ChApp.friendsProfile);
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
    document.getElementById('modal-table').innerHTML = "";

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
    //Modal Title
    document.getElementById('modal-title').innerHTML = "Messages to " + ChApp.friends[friendNumber].name;
    //New Message
    var holder = "<div class='input-group message-modal'>";
    holder += "<input type='text' placeholder='Message' id='pm-input' class='profile-input form-control'><br/>";
    document.getElementById('modalBody').innerHTML = holder;

    //Buttons
    var holder2 = "<button class='btn btn-default' data-dismiss='modal'>Close</button>";
    holder2 += "<button class='btn btn-primary' onclick='ChApp.addPM(" + friendNumber + ")'> Send </button>";
    document.getElementById('modal-buttons').innerHTML = holder2;

    ChApp.getfriendsPMsfromFirebase(friendNumber);

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
    $("#modal-timeline").modal("hide");
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
    holder = "<table class='table-condensed' id='friendsTable'>";
    for (var i in ChApp.friends) {
        if (ChApp.friends[i].name !== "Allison") {
            holder += "<tr> <td>" + ChApp.friends[i].name + "</td>";
            if (ChApp.friends[i].isCurrent === true) {
                holder += "<td> <i class='fa fa-minus add-button' onclick='ChApp.toggleFriend(" + i + ")'></i>";
                holder += "&nbsp; &nbsp; <i class='fa fa-user profile-button' onclick='ChApp.getFriendsProfile(" + i + ")'></i></td></tr>";
            }
            else { holder += "<td><i class='fa fa-plus delete-button' onclick='ChApp.toggleFriend(" + i + ")'></i>"; }
        }
    }
    holder += "</table>";
    document.getElementById("friendsDiv").innerHTML = holder;
};


//On Page Load Functions
ChApp.drawFriendsTable();
ChApp.getMyProfile();

//Timeline Button
ChApp.createTimeline = function () {
    ChApp.findCurrentFriends();
    ChApp.friendsChirps = [];
    counter = 0;
    for (var i in ChApp.currentFriends) {
        //GET function for Timeline
        var url = ChApp.makeURL(ChApp.currentFriends[i].firebaseURL, ['chirps']);
        //console.log(url);
        var success = function (data) {
            for (var j in data) {
                ChApp.friendsChirps.push(data[j]);
            };
            //console.log(ChApp.friendsChirps);
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
            if (ChApp.currentFriends.length == counter) {
                ChApp.seeTimeline();
            }
        };
        var failure = console.log("Error on " + ChApp.friends[i].name);

        ChApp.Ajax("GET", url, success, failure);
        counter++;
        //console.log(counter);
    }
};
ChApp.seeTimeline = function () {
    document.getElementById('modal-title').innerHTML = "Timeline";
    document.getElementById('modal-table').innerHTML = "";
    var holder = "<table class='table-condensed'>";
    for (var i in ChApp.friendsChirps) {
        holder += "<tr><td class='chirper-td'>" + ChApp.friendsChirps[i].user + "</td>";
        holder += "<td class='chirps-td'>" + ChApp.friendsChirps[i].chirp + "</td>";
        holder += "<td class='time-td'>" + dateFormat(ChApp.friendsChirps[i].timestamp) + "</td></tr>";
    }
    holder += "</table>";

    document.getElementById('modalBody').innerHTML = holder;
    $('#modal-timeline').modal();
};

//Add New PM to Friend
ChApp.addPM = function (i) {
    var message = document.getElementById('pm-input').value;
    var name = ChApp.friends[i].name
    var PM = new ChApp.PrivateMessages(name, message);
    ChApp.sendPMToFirebase(PM);
    ChApp.privatemessages.unshift(PM);
    ChApp.drawMessageTable(friendNumber);
    document.getElementById('pm-input').value = '';
};

//Send PM to Firebase
ChApp.sendPMToFirebase = function (PM) {
    var url = ChApp.makeURL("https://chirper-allison.firebaseio.com", ['privatemessages']);
    var success = function (data) {
        //ChApp.privatemessages.unshift(PM);
    }
    var failure = function () {
        alert("Your message did not go through, please try again")
    };
    ChApp.Ajax("POST", url, success, failure, PM);
};

//Get All PM to friends
ChApp.getMyPMstoFriends = function () {
    url = ChApp.makeURL("https://chirper-allison.firebaseio.com", ['privatemessages']);
    var success = function (data) {
        ChApp.privatemessages = [];
        for (var i in data) {
           data[i].firebaseId = i;
            ChApp.privatemessages.push(data[i]);
            //console.log("Private Messages: " +ChApp.privatemessages);
        }
        ChApp.drawMessageTable(friendNumber);
    }
    ChApp.Ajax("GET", url, success, alert, null);
};

//Get PMs from friends
ChApp.getfriendsPMsfromFirebase = function (x) {
        var url = ChApp.makeURL(ChApp.friends[x].firebaseURL, ['privatemessages']);
        var success = function (data) {
            ChApp.privateMessagesToMe = [];
            for (var j in data) {
                //console.log("Friends Name: "+ChApp.friends[x].name);
                if (data[j].name === "Allison") {
                    // data[j].firebaseId = j;
                    ChApp.privateMessagesToMe.push(data[j]);
                    //console.log("Private Messages to Me: " + ChApp.privateMessagesToMe);
                }
            }
            ChApp.getMyPMstoFriends();
        }
        var failure = function () {
            alert("Error on getfriendsPMsfromFirebase function");
        }
        ChApp.Ajax("GET", url, success, failure);
};

//Draw Message Table
ChApp.drawMessageTable = function (x) {
    var holder = "<div class='message-modal'><table class='table-condensed message-modal'>"
    ChApp.onePersonsPrivateMessages = [];
    //Create variable for private messages between me and one friend
    for (var i in ChApp.privatemessages) {
        if (ChApp.privatemessages[i].name === ChApp.friends[x].name) {
            ChApp.onePersonsPrivateMessages.push(ChApp.privatemessages[i]);
        }
    }
    for (var j in ChApp.privateMessagesToMe) {
            ChApp.onePersonsPrivateMessages.push(ChApp.privateMessagesToMe[j]);
    }
    //console.log(ChApp.privateMessagesToMe);
   ChApp.onePersonsPrivateMessages.sort(function (a, b) {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        else if (b.timestamp < a.timestamp) {
            return 1;
        }
        else {
            return 0;
        }
   });
    //Draw Table
   for (var k in ChApp.onePersonsPrivateMessages) {
       if (ChApp.onePersonsPrivateMessages[k].myName !== "Allison") {
           holder += "<tr><td class='friend-pm'>" + ChApp.onePersonsPrivateMessages[k].message + " - &nbsp;";
           holder += dateFormat(ChApp.onePersonsPrivateMessages[k].timestamp) + "</td></tr>";
       }
       else {
           holder += "<tr><td class='my-pm'>" + ChApp.onePersonsPrivateMessages[k].message + " - &nbsp;";
           holder += dateFormat(ChApp.onePersonsPrivateMessages[k].timestamp) + "</td></tr>";
       }

   }

        holder += "</table></div>";
    document.getElementById('modal-table').innerHTML = holder;
};
//Toggle Friend
ChApp.toggleFriend = function (i) {
    if (ChApp.friends[i].isCurrent === true) {
        ChApp.friends[i].isCurrent = false;
    }
    else if(ChApp.friends[i].isCurrent === false){
        ChApp.friends[i].isCurrent = true;
    }
    ChApp.drawFriendsTable();
};

//New Chirp Modal
ChApp.addNewChirp = function () {
    document.getElementById('modal-table').innerHTML = "";
    document.getElementById('modal-title').innerHTML = "Create New Chirp";
    var holder = "<textarea class='form-control' id='inputMessage' rows='2'></textarea>";
    document.getElementById('modalBody').innerHTML = holder;

    var h = "<button id='sendButton' type='button' class='btn btn-info' onclick='ChApp.addMessage();'>Send</button>";
    document.getElementById('modal-buttons').innerHTML = h;

    $("#modal-timeline").modal();
}
