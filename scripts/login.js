function Login() {
    fetch("../data/users.json")
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json(); // Parse the JSON
        })
        .then(data => {
            console.log("Login function called", "DATA ->", data); // Now you get the actual JSON data
        })
        .catch(error => {
            console.error("Fetch error:", error); // Handle errors
        });
}