// Store profiles locally (temporary)
let profiles = [];

// Create a profile and save it to Supabase
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

    // Save to Supabase
    const { error } = await supabase
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
        console.error(error);
        alert("❌ Error saving profile:\n" + error.message);
        return;
    }

    alert("✅ Profile saved!");

    // Also display it on this page
    profiles.push({
        name,
        studentClass,
        hobbies,
        interests,
        bio
    });

    displayProfiles();

    // Clear the form
    document.getElementById("name").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("hobbies").value = "";
    document.getElementById("interests").value = "";
    document.getElementById("bio").value = "";
}

// Display profiles on the page
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
