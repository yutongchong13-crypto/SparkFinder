// =========================
// SparkFinder V2
// =========================

let currentUser = null;

// Load profiles when the page opens
window.onload = function () {
    loadProfiles();
};

// =========================
// Create Profile
// =========================

async function createProfile() {

    const name = document.getElementById("name").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const hobbies = document.getElementById("hobbies").value.trim();
    const interests = document.getElementById("interests").value.trim();
    const bio = document.getElementById("bio").value.trim();

    if (name === "") {
        alert("Please enter your name!");
        return;
    }

    const profile = {
        name,
        class: studentClass,
        hobbies,
        interests,
        bio
    };

    try {

        const { error } = await db
            .from("students")
            .insert([profile]);

        if (error) {
            alert("❌ " + error.message);
            return;
        }

        currentUser = profile;

        alert("✅ Profile created!");

        document.getElementById("name").value = "";
        document.getElementById("studentClass").value = "";
        document.getElementById("hobbies").value = "";
        document.getElementById("interests").value = "";
        document.getElementById("bio").value = "";

        loadProfiles();

    } catch (err) {

        alert("❌ " + err.message);

    }

}

// =========================
// Load Profiles
// =========================

async function loadProfiles() {

    const { data, error } = await db
        .from("students")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    let html = "";

    data.forEach(profile => {

        html += `
        <div class="profile-card">

            <h2>👤 ${profile.name}</h2>

            <p><strong>🏫 Class:</strong> ${profile.class}</p>

            <p><strong>🎮 Hobbies:</strong> ${profile.hobbies}</p>

            <p><strong>🎯 Interests:</strong> ${profile.interests}</p>

            <p>${profile.bio}</p>

            <button onclick="sendFriendRequest('${profile.name}')">
                ➕ Add Friend
            </button>

        </div>
        `;

    });

    document.getElementById("profile").innerHTML = html;

}

// =========================
// Friend Matching
// =========================

async function findMatches() {

    if (!currentUser) {
        alert("Please create your profile first.");
        return;
    }

    const myHobbies = currentUser.hobbies.toLowerCase().split(",");
    const myInterests = currentUser.interests.toLowerCase().split(",");

    const { data, error } = await db
        .from("students")
        .select("*");

    if (error) {
        alert(error.message);
        return;
    }

    let html = "<h2>❤️ Your Matches</h2>";

    let found = false;

    data.forEach(profile => {

        if (profile.name === currentUser.name) return;

        let score = 0;

        myHobbies.forEach(hobby => {

            if (
                hobby.trim() !== "" &&
                (profile.hobbies || "").toLowerCase().includes(hobby.trim())
            ) {
                score += 25;
            }

        });

        myInterests.forEach(interest => {

            if (
                interest.trim() !== "" &&
                (profile.interests || "").toLowerCase().includes(interest.trim())
            ) {
                score += 25;
            }

        });

        if (score > 0) {

            found = true;

            html += `
            <div class="profile-card">

                <h2>❤️ ${profile.name}</h2>

                <h3>${score}% Match</h3>

                <p><strong>🏫 Class:</strong> ${profile.class}</p>

                <p><strong>🎮 Hobbies:</strong> ${profile.hobbies}</p>

                <p><strong>🎯 Interests:</strong> ${profile.interests}</p>

                <p>${profile.bio}</p>

            </div>
            `;

        }

    });

    if (!found) {
        html += "<p>No matching friends found.</p>";
    }

    document.getElementById("matches").innerHTML = html;

}

// =========================
// Friend Requests
// =========================

async function sendFriendRequest(receiver) {

    if (!currentUser) {
        alert("Please create your profile first.");
        return;
    }

    if (receiver === currentUser.name) {
        alert("You can't send a friend request to yourself!");
        return;
    }

    const { error } = await db
        .from("friend_requests")
        .insert([
            {
                sender: currentUser.name,
                receiver: receiver,
                status: "pending"
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("🎉 Friend request sent to " + receiver + "!");

}
