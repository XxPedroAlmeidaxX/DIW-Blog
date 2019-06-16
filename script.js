let db = JSON.parse(localStorage.getItem('db'));
if (!db) {
    db = dbStart;
}

function start() {
    loadData()
    setListeners()
}

function setListeners() {
    let test = document.querySelectorAll("#test");

    test.forEach(item => {
        // This handler will be executed only once when the cursor
// moves over the unordered list
        item.addEventListener("mouseenter", function (event) {
            // highlight the mouseenter target
            event.target.style.color = "purple";

            // reset the color after a short delay
            setTimeout(function () {
                event.target.style.color = "";
            }, 500);
        }, false);
    })
}

function loadData() {
    let innerHTML = "";

    for (let i = 0; i < db.length; i++) {
        innerHTML += `        
        <div class="col xl4 m6 s12">
            <div class="card large sticky-action">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" alt="Post Image" src="data:image/png;base64, ${db[i].image}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">
                        <i class="material-icons right">more_vert</i></br>${db[i].title}
                    </span>
                </div>
                <div class="card-action">
                    <div class="col s3">
                        <button class="waves-effect waves-light btn indigo" id="test">
                            <i class="material-icons">thumb_up</i>
                        </button>
                    </div>
                    <div class="col s3">
                        <button class="waves-effect waves-light btn indigo">
                            <i class="material-icons">speaker_notes</i>
                        </button>
                    </div>
                    <div class="col s6">                   
                        <div class="right-align">
                            <button disabled class="btn date">
                                ${formatDate(db[i].date)}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <i class="material-icons right">close</i>
                    </span>
                    <p>${db[i].text}</p>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("container").innerHTML = innerHTML;
}

function formatDate(date) {
    let formattedDate = "";
    date = new Date(date);
    formattedDate += date.getDate() + "/";
    formattedDate += date.getMonth() + "/";
    formattedDate += date.getFullYear() + " ";
    // formattedDate += date.getHours() + ":";
    // formattedDate += date.getMinutes() + ":";
    // formattedDate += date.getSeconds();

    return formattedDate;
}



