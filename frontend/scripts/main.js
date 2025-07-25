//function to clear the body
function ClearBody(){
    console.log(document.getElementsByTagName("body")[0].innerHTML = "");
}

//add actions for sign in and get started button with JQuery
$(() => {        
    $('#signInButton').on('click', () => {          
        ClearBody()
        Login();
    }); 
    $('#getStartedButton').on('click', () => {        
        ClearBody()
        Registration();
    }
    );
});