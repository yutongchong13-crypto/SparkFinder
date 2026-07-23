// Load all profiles when the page opens
window.onload = function () {
    loadProfiles();
};

// Create a new profile
async function createProfile() {

    const name = document.getElementById("name").value;
    const studentClass = document.getElementById("studentClass").value;
    const hobbies = document.getElementById("hobbies").value;
    const interests = document.getElementById("interests").value;
    const bio = document.getElementById("bio").value;

    // Check if name is empty
    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    try {

        // Save profile to Supabase
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
            alert("❌ Supabase Error:\n" + error.message);
            console.error(error);
            return;
        }

        alert("✅ Profile created successfully!");

        // Clear the form
        document.getElementById("name").value = "";
        document.getElementById("studentClass").value = "";
        document.getElementById("hobbies").value = "";
        document.getElementById("interests").value = "";
        document.getElementById("bio").value = "";

        // Reload all profiles
        loadProfiles();

    } catch (err) {

        alert("❌ Network Error:\n" + err.message);
        console.error(err);

    }
}

// Load every profile from Supabase
async function loadProfiles() {

    try {

        const { data, error } = await db
            .from("students")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
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

    } catch (err) {

        console.error(err);

    }
}
