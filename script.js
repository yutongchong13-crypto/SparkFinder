function startApp(){

    // Get what the student typed
    let name = document.getElementById("name").value;
    let studentClass = document.getElementById("studentClass").value;
    let hobbies = document.getElementById("hobbies").value;
    let bio = document.getElementById("bio").value;

    // Make sure they entered a name
    if(name==""){
        alert("Please enter your name!");
        return;
    }

    // Show the student's profile
    document.getElementById("profile").innerHTML = `
        <h2>Your Profile</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Class:</b> ${studentClass}</p>

        <p><b>Hobbies:</b> ${hobbies}</p>

        <p><b>About Me:</b> ${bio}</p>
    `;

}
