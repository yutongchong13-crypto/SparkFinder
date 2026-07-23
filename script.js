// Load profiles when the page opens
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

    const { error } = await db
        .from("students")
        .insert([
            {
                name,
                class: studentClass,
                hobbies,
                interests,
                bio
            }
        ]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("✅ Profile created!");

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("hobbies").value = "";
    document.getElementById("interests").value = "";
    document.getElementById("bio").value = "";

    // Reload all profiles
    loadProfiles();
}

// Load all profiles from Supabase
async function loadProfiles() {

    const { data, error } = await db
        .from("students")
        .select("*");

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

        </div>
        `;
    });

    document.getElementById("profile").innerHTML = html;
}
