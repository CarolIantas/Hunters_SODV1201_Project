function Registration() {
    console.log("Registration function called");

    $(function () {
        const $registrationContainer = $("<div>");
        $registrationContainer.addClass("flex flex-col items-center gap-6 p-7");

        const title = $("<h1>")
            .addClass("text-lg font-semibold mb-4 text-gray-800")
            .text("Registration");
        $registrationContainer.append(title);

        // Name input 
        const name = $("<input>")
            .attr({
                type: "text",
                placeholder: "Enter your name",
                id: "name",
                name: "name"
            })
            .addClass("w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400");

        $registrationContainer.append(name);
        
        // register button
        const submit = $("<button>")
            .text("Register")
            .addClass("mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors");

        $registrationContainer.append(submit);

        // Append everything to #main
        $("#main").empty().append($registrationContainer);
    });
}