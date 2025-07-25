//add actions for sign in and get started button with JQuery
$(() => {
    $('#signInButton').on('click', () => {  
        Login();
    }); 
    $('#getStartedButton').on('click', () => {
        Registration();
    }
    );
});