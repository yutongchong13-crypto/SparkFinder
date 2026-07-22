// This function runs when the button is clicked
function startApp(){

    // Get the values from the form
    const name = document.getElementById("name").value;
    const studentClass = document.getElementById("class").value;
    const hobbies = document.getElementById("hobbies").value;
    const bio = document.getElementById("bio").value;

    // Check that the user filled in their name
    if(name===""){
        alert("Please enter your name!");
        return;
    }

    // Display the profile
    document.getElementById("profile").innerHTML = `
        <div class="card">
            <h2>${name}</h2>
            <p><strong>Class:</strong> ${studentClass}</p>
            <p><strong>Hobbies:</strong> ${hobbies}</p>
            <p><strong>About Me:</strong> ${bio}</p>
        </div>
    `;
}
