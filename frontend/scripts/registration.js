function Registration() {
    console.log("Registration function called");

    $(function () {
        const $registrationContainer = $("<div>");
        $registrationContainer.addClass("flex flex-col items-center gap-6 p-7");

        $(function () {
            const $mainWrapper = $("<div>").addClass("flex min-h-full flex-col justify-center px-6 py-12 lg:px-8");
            
            // Form Section
            const $formSection = $("<div>").addClass("mt-10 sm:mx-auto sm:w-full sm:max-w-sm");
            const $form = $("<form>")
                .attr({ action: "#", method: "POST" })
                .addClass("space-y-6");

            // Email input
            const $emailGroup = $("<div>");
            const $emailLabel = $("<label>")
                .attr({ for: "email" })
                .addClass("block text-sm/6 font-medium text-gray-900")
                .text("Email address");

            const $emailInput = $("<input>")
                .attr({
                    id: "email",
                    name: "email",
                    type: "email",
                    required: true,
                    autocomplete: "email"
                })
                .addClass("block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm")

            $emailGroup.append($emailLabel, $("<div>").addClass("mt-2").append($emailInput));
            
            const $passwordGroup = $("<div>");
            const $passwordHeader = $("<div>").addClass("flex items-center justify-between");

            const $passwordLabel = $("<label>")
                .attr("for", "password")
                .addClass("block text-sm/6 font-medium text-gray-900")
                .text("Password");
            
            $passwordHeader.append($passwordLabel, $("<div>").addClass("text-sm"));

            const $passwordInput = $("<input>")
                .attr({
                    id: "password",
                    name: "password",
                    type: "password",
                    required: true,
                    autocomplete: "current-password"
                })
                .addClass("block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm")

            $passwordGroup.append($passwordHeader, $("<div>").addClass("mt-2").append($passwordInput));

            // Submit Button
            const $submitButton = $("<button>")
                .attr("type", "submit")
                .addClass("flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")
                .text("Sign up");

            const $submitGroup = $("<div>").append($submitButton);

            // Form assembly
            $form.append($emailGroup, $passwordGroup, $submitGroup);
            $formSection.append($form);
            
            // Assemble all
            $mainWrapper.append($formSection);
            $registrationContainer.append($mainWrapper);
        });

        // Append everything to #main
        $("#main").empty().append($registrationContainer);
    });
}