// Fake database used trough the code
let db;
// Stores the modal's post
let postId;
// Stores the image loaded by the user
let imgStore;

// Initialize Materialize Modals
document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});

// Converts the loaded file into base64 and stores it on imgStore
document.getElementById("post-image").addEventListener('change', (e) => {
    let fr = new FileReader();
    fr.onload = (e) => {
        imgStore = e.target.result;
    };
    fr.readAsDataURL(e.target.files[0]);
}, false);

// Setup everything to start using the website
function start() {
    loadDB();
    loadData();
}

// Start the database with the default data if local storage data not found
function loadDB() {
    db = JSON.parse(localStorage.getItem('dbPedroHenriqueAlmeidaCosta'));
    if (!db) {
        db = dbStart;
    }
}

// Add all the posts to the page sorting they by Date
function loadData() {
    sortPosts();

    let innerHTML = "";

    for (let i = 0; i < db.length; i++) {
        innerHTML += `        
        <div class="col xl4 m6 s12">
            <div class="card large sticky-action">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" alt="Post Image" src="${db[i].image}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">
                        <div class="col s10">
                            <i class="material-icons left activator">calendar_today</i>
                            <h6 class="activator">${formatDate(db[i].date)}</h6>
                        </div>
                        <div class="col s2">
                            <i class="material-icons right">more_vert</i>
                        </div>
                        <div class="col s12 activator">
                            ${db[i].title}
                        </div>
                    </span>
                </div>
                <div class="card-action">
                    <div class="col s6">
                        <button class="waves-effect waves-light btn indigo right" onclick="addLike(${db[i].id})">
                            <i class="material-icons">thumb_up</i>
                            <span id="likes_${db[i].id}">${db[i].likes}</span>
                        </button>
                    </div>
                    <div class="col s6">
                        <button class="waves-effect waves-light btn indigo" onclick="commentsTrigger(${db[i].id})">
                            <i class="material-icons">speaker_notes</i>
                            <span id="comments_${db[i].id}">${db[i].comments.length}</span>
                        </button>
                    </div>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">
                        <div class="col s10">
                            <i class="material-icons left">calendar_today</i>
                            <h6>${formatDate(db[i].date)}</h6>
                        </div>
                        <div class="col s2">
                            <i class="material-icons right">close</i>
                        </div>
                        <div class="col s12">
                            ${db[i].title}
                        </div>
                    </span>
                    <div class="col s12">
                        <p>${db[i].text}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("container").innerHTML = innerHTML;
}

// Adds a like to the post and updates the number on interface
function addLike(id) {
    let post = findPost(id);
    post.likes++;
    updatePost(post);

    document.getElementById("likes_" + id).innerText = post.likes;
}

// Sets the Comments Modal
function commentsTrigger(id) {
    let innerHTML = "";
    let post = findPost(id);

    post.comments.forEach(item => {
        innerHTML += `
        <div class="row">
            <div class="col s12">
                <div class="card-panel indigo">
                    <span class="white-text">
                        <p>
                            ${item.name} <br><br> ${item.text}
                        </p>
                    </span>
                </div>
            </div>
        </div>`
    });

    document.getElementById("comModalContent").innerHTML = innerHTML;
    postId = id;

    let element = document.querySelectorAll('.modal')[0];
    let modal = M.Modal.getInstance(element);
    modal.open();
}

// Clears the Comment's fields
function clearComment() {
    document.getElementById("user_name").value = '';
    document.getElementById("commentary").value = '';
}

// Adds a comment to a post
function addComment() {
    let post = findPost(postId);
    let user = document.getElementById("user_name");
    let commentary = document.getElementById("commentary");

    post.comments.push({"name": user.value, "text": commentary.value});
    updatePost(post);

    document.getElementById("comments_" + post.id).innerText = post.comments.length;

    document.getElementById("comModalContent").innerHTML += `
        <div class="row">
            <div class="col s12">
                <div class="card-panel indigo">
                    <span class="white-text">
                        ${user.value} <br><br> ${commentary.value}
                    </span>
                </div>
            </div>
        </div>`;
}

// Clears the Post Insert's fields
function clearPostInsert() {
    document.getElementById("post-title").value = '';
    document.getElementById("post-text").value = '';
    document.getElementById("post-image").value = '';
}

// Adds a post to the website
function addPostInsert() {
    addPost(document.getElementById("post-title").value,
        document.getElementById("post-text").value, imgStore);

    loadData();
}

// Sort the posts contained on the fakeDB by Date
function sortPosts() {
    db.sort((a, b) => {
        let da = new Date(a.date);
        let db = new Date(b.date);

        if (da > db)
            return -1;
        if (da < db)
            return 1;
        return 0;
    });
}

// Format the Date to DD/MM/YYY  HH:MM:SS
function formatDate(date) {
    let formattedDate = "";
    date = new Date(date);
    formattedDate += date.getDate() + "/";
    formattedDate += (date.getMonth() + 1) + "/";
    formattedDate += date.getFullYear() + " ";
    formattedDate += date.getHours() + ":";
    formattedDate += date.getMinutes() + ":";
    formattedDate += date.getSeconds();

    return formattedDate;
}

//
//FakeDB Methods
//

// Updates a Post Data
function updatePost(post) {
    db.find((item, index, array) => {
        if (item.id == post.id)
            array[index] = post;
    });

    localStorage.setItem("dbPedroHenriqueAlmeidaCosta", JSON.stringify(db));
}

// Finds a Post
function findPost(id) {
    return db.find(item => item.id == id);
}

// Adds a Post
function addPost(title, text, img) {
    let date = new Date();

    db.push({
        "id": Math.floor(Math.random() * 1000000000),
        "date": date.toISOString(),
        "title": title,
        "text": text,
        "image": img,
        "likes": 0,
        "comments": [],
    });

    localStorage.setItem("dbPedroHenriqueAlmeidaCosta", JSON.stringify(db));
}


