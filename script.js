// Load all profiles when the page opens
window.onload = function () {
    loadProfiles();
};

// Create a profile
async function createProfile() {

    const name = document.getElementById("name").value;
    const studentClass = document.getElementById("studentClass").value;
    const hobbies = document.getElementById("hobbies").value;
    const interests = document.getElementById("interests").value;
    const bio = document.getElementById("bio").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    try {

        const { error } = await db
            .from("students")
            .insert([
                {
                    name: name,
                    class: studentClass,
                    hobbies: hobbies,
                    interests: interests,
                    bio: bio
                }
            ]);

        if (error) {
            alert("❌ " + error.message);
            return;
        }

        alert("✅ Profile created!");

        document.getElementById("name").value = "";
        document.getElementById("studentClass").value = "";
        document.getElementById("hobbies").value = "";
        document.getElementById("interests").value = "";
        document.getElementById("bio").value = "";

        loadProfiles();

    } catch (err) {

        alert("❌ Network Error\n" + err.message);

    }

}

// Load every profile
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

// Friend Matching
async function findMatches() {

    const hobbies = document.getElementById("hobbies").value
        .toLowerCase()
        .split(",");

    const interests = document.getElementById("interests").value
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

    let foundMatch = false;

    data.forEach(profile => {

        const profileHobbies = (profile.hobbies || "").toLowerCase();
        const profileInterests = (profile.interests || "").toLowerCase();

        let matched = false;

        hobbies.forEach(hobby => {
            if (
                hobby.trim() !== "" &&
                profileHobbies.includes(hobby.trim())
            ) {
                matched = true;
            }
        });

        interests.forEach(interest => {
            if (
                interest.trim() !== "" &&
                profileInterests.includes(interest.trim())
            ) {
                matched = true;
            }
        });

        if (matched) {

            foundMatch = true;

            html += `
            <div class="profile-card">

                <h2>❤️ ${profile.name}</h2>

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

    if (!foundMatch) {
        html += "<p>No matching friends found yet.</p>";
    }

    document.getElementById("matches").innerHTML = html;

}

// Send Friend Request
async function sendFriendRequest(receiver) {

    const sender = prompt("Enter your name:");

    if (!sender) return;

    const { error } = await db
        .from("friend_requests")
        .insert([
            {
                sender: sender,
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
