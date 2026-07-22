function createProfile() {

    // Get the values from the form
    const name = document.getElementById("name").value;
    const studentClass = document.getElementById("studentClass").value;
    const hobbies = document.getElementById("hobbies").value;
    const interests = document.getElementById("interests").value;
    const bio = document.getElementById("bio").value;

    // Check if the name is empty
    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    // Show the profile
    document.getElementById("profile").innerHTML = `
        <div class="profile-card">

            <h2>👤 ${name}</h2>

            <p><strong>🏫 Class:</strong> ${studentClass}</p>

            <p><strong>🎯 Interests:</strong> ${interests}</p>

            <p><strong>🎮 Hobbies:</strong> ${hobbies}</p>

            <p><strong>📝 About Me:</strong></p>

            <p>${bio}</p>

        </div>
    `;
}
