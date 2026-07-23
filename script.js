// Store profiles locally
let profiles = [];

// Create a profile and save it to Supabase
async function createProfile() {

    const name = document.getElementById("name").value;
    const studentClass = document.getElementById("studentClass").value;
    const hobbies = document.getElementById("hobbies").value;
    const interests = document.getElementById("interests").value;
    const bio = document.getElementById("bio").value;

    // Check required field
    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    // Save to Supabase
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
        console.error(error);
        return;
    }

    alert("✅ Profile created!");

    // Add to page
    profiles.push({
        name,
        studentClass,
        hobbies,
        interests,
        bio
    });

    displayProfiles();

    // Clear form
    document.getElementById("name").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("hobbies").value = "";
    document.getElementById("interests").value = "";
    document.getElementById("bio").value = "";
}

// Display profiles
function displayProfiles() {

    let html = "";

    profiles.forEach(profile => {

        html += `
        <div class="profile-card">
            <h2>👤 ${profile.name}</h2>

            <p><strong>🏫 Class:</strong> ${profile.studentClass}</p>

            <p><strong>🎮 Hobbies:</strong> ${profile.hobbies}</p>

            <p><strong>🎯 Interests:</strong> ${profile.interests}</p>

            <p>${profile.bio}</p>

        </div>
        `;

    });

    document.getElementById("profile").innerHTML = html;

}
