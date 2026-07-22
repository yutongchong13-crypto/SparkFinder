function startApp() {

    // Get what the user typed
    let name = document.getElementById("name").value;
    let studentClass = document.getElementById("studentClass").value;
    let hobbies = document.getElementById("hobbies").value;
    let bio = document.getElementById("bio").value;

    // Make sure the name isn't empty
    if (name === "") {
        alert("Please enter your name!");
        return;
    }

    // Show the profile below the button
    document.getElementById("profile").innerHTML = `
        <h2>Your Profile</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Class:</strong> ${studentClass}</p>

        <p><strong>Hobbies:</strong> ${hobbies}</p>

        <p><strong>About Me:</strong> ${bio}</p>
    `;
}
