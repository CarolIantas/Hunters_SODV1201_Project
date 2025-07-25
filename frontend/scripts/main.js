//function to clear the body
function ClearBodyMain(){
    console.log(document.getElementById("main").innerHTML = "");
}

//add actions for sign in and get started button with JQuery
$(() => {        
    $('#signInButton').on('click', () => {          
        ClearBodyMain()
        Login();
    }); 
    $('#getStartedButton').on('click', () => {        
        ClearBodyMain()
        Registration();
    }
    );
});