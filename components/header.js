$(document).ready(function () {
  const $header = $("#header").addClass("bg-white shadow-sm sticky top-0 z-50");

  const $container = $("<div>").addClass("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8");
  const $flex = $("<div>").addClass("flex justify-between items-center h-16");

  // Left: Logo + Text
  const $left = $("<div>").addClass("flex items-center");
  const $svg = $(`
    <svg class="h-8 w-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
      </path>
    </svg>
  `);
  const $title = $("<span>").addClass("text-2xl font-bold text-gray-900").text("WorkSpace");
  $left.append($svg, $title);

  // Center: Nav links
  const $nav = $("<nav>").addClass("hidden md:flex space-x-8");
  const links = [
    { href: "#features", text: "Features" },
    { href: "#how-it-works", text: "How It Works" },
    { href: "#benefits", text: "Benefits" }
  ];
  links.forEach(link => {
    const $a = $("<a>")
      .attr("href", link.href)
      .addClass("text-gray-700 hover:text-blue-600 transition-colors")
      .text(link.text);
    $nav.append($a);
  });

  // Right: Buttons
  const $right = $("<div>").addClass("flex items-center space-x-4");
  const $signIn = $("<button>")
    .attr("id", "signInButton")
    .addClass("text-gray-700 hover:text-blue-600 transition-colors")
    .text("Sign In");

  const $getStarted = $("<button>")
    .attr("id", "getStartedButton")
    .addClass("bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors")
    .text("Get Started");

  $right.append($signIn, $getStarted);

  // Compose everything
  $flex.append($left, $nav, $right);
  $container.append($flex);
  $header.append($container);

  // Inject into the DOM element with id="header"
  $("#header").append($header);
});
