// =========================
// SparkFinder V3 - Part 1
// =========================

let currentUser = null;

// =========================
// When page loads
// =========================

window.onload = async function () {

    await loadProfiles();
    await loadUsers();

};

// =========================
// Load users into Login box
// =========================

async function loadUsers() {

    const { data, error } = await db
        .from("students")
        .select("name")
        .order("name");

    if (error) {
        console.log(error);
        return;
    }

    const select = document.getElementById("loginUser");

    if (!select) return;

    select.innerHTML =
        `<option value="">Select Your Profile</option>`;

    data.forEach(user => {

        select.innerHTML += `
            <option value="${user.name}">
                ${user.name}
            </option>
        `;

    });

}

// =========================
// Login
// =========================

async function login() {

    const selectedName =
        document.getElementById("loginUser").value;

    if (selectedName === "") {

        alert("Please select your profile.");

        return;

    }

    const { data, error } = await db
        .from("students")
        .select("*")
        .eq("name", selectedName)
        .single();

    if (error) {

        alert(error.message);

        return;

    }

    currentUser = data;

    alert("✅ Logged in as " + currentUser.name);

}

// =========================
// Create Profile
// =========================

async function createProfile() {

    const name =
        document.getElementById("name").value.trim();

    const studentClass =
        document.getElementById("studentClass").value;

    const hobbies =
        document.getElementById("hobbies").value.trim();

    const interests =
        document.getElementById("interests").value.trim();

    const bio =
        document.getElementById("bio").value.trim();

    if (name === "") {

        alert("Please enter your name.");

        return;

    }
    // Check if this name already exists
const { data: existingUser, error: checkError } = await db
    .from("students")
    .select("*")
    .eq("name", name);

if (checkError) {
    alert(checkError.message);
    return;
}

if (existingUser.length > 0) {
    alert("❌ A profile with this name already exists.\n\nPlease log in instead.");
    return;
}

    const profile = {

        name: name,
        class: studentClass,
        hobbies: hobbies,
        interests: interests,
        bio: bio

    };

    const { error } = await db
        .from("students")
        .insert([profile]);

    if (error) {

        alert(error.message);

        return;

    }

    currentUser = profile;

    alert("✅ Profile created!");

    document.getElementById("name").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("hobbies").value = "";
    document.getElementById("interests").value = "";
    document.getElementById("bio").value = "";

    await loadProfiles();
    await loadUsers();

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

        alert(error.message);

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

<button onclick="editProfile(${profile.id})">
    ✏️ Edit Profile
</button>

<button onclick="deleteProfile(${profile.id})">
    🗑️ Delete Profile
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
        alert("Please log in first.");
        return;
    }

    const myHobbies = (currentUser.hobbies || "")
        .toLowerCase()
        .split(",");

    const myInterests = (currentUser.interests || "")
        .toLowerCase()
        .split(",");

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

            hobby = hobby.trim();

            if (
                hobby !== "" &&
                (profile.hobbies || "")
                    .toLowerCase()
                    .includes(hobby)
            ) {
                score += 25;
            }

        });

        myInterests.forEach(interest => {

            interest = interest.trim();

            if (
                interest !== "" &&
                (profile.interests || "")
                    .toLowerCase()
                    .includes(interest)
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

                <button onclick="sendFriendRequest('${profile.name}')">
                    ➕ Add Friend
                </button>

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
// Send Friend Request
// =========================

async function sendFriendRequest(receiver) {

    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    if (receiver === currentUser.name) {
        alert("You can't add yourself!");
        return;
    }

    const { data: existing } = await db
        .from("friend_requests")
        .select("*")
        .eq("sender", currentUser.name)
        .eq("receiver", receiver);

    if (existing && existing.length > 0) {
        alert("You have already sent a friend request.");
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

// =========================
// Delete Profile
// =========================

async function deleteProfile(id) {

    if (!confirm("Delete this profile?")) {
        return;
    }

    const { error } = await db
        .from("students")
        .delete()
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("🗑️ Profile deleted!");

    if (currentUser && currentUser.id === id) {
        currentUser = null;
    }

    await loadProfiles();
    await loadUsers();

}

// =========================
// View Friend Requests
// =========================

async function viewFriendRequests() {

    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    const { data, error } = await db
        .from("friend_requests")
        .select("*")
        .eq("receiver", currentUser.name)
        .eq("status", "pending");

    if (error) {
        alert(error.message);
        return;
    }

    if (data.length === 0) {
        alert("No pending friend requests.");
        return;
    }

    let message = "Pending Friend Requests:\n\n";

    data.forEach(request => {
        message += "• " + request.sender + "\n";
    });

    alert(message);

}
