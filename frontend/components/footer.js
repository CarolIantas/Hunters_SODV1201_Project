$(document).ready(function () {
  const $footer = $("#footer").addClass("bg-gray-900 text-white");

  const $container = $("<div>").addClass("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12");

  const $grid = $("<div>").addClass("grid grid-cols-1 md:grid-cols-4 gap-8");

  // Column 1: Logo and description
  const $col1 = $("<div>");
  const $logoWrap = $("<div>").addClass("flex items-center mb-4");
  const $logoSvg = $(`
    <svg class="h-8 w-8 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
      </path>
    </svg>
  `);
  const $logoText = $("<span>").addClass("text-2xl font-bold").text("WorkSpace");
  const $desc = $("<p>").addClass("text-gray-400").text("Connecting coworkers with perfect workspace solutions worldwide.");

  $logoWrap.append($logoSvg, $logoText);
  $col1.append($logoWrap, $desc);

  // Reusable function to build a column
  function createColumn(title, links) {
    const $col = $("<div>");
    const $heading = $("<h3>").addClass("text-lg font-semibold mb-4").text(title);
    const $ul = $("<ul>").addClass("space-y-2 text-gray-400");

    links.forEach(text => {
      const $a = $("<a>").attr("href", "#").addClass("hover:text-white transition-colors").text(text);
      $ul.append($("<li>").append($a));
    });

    $col.append($heading, $ul);
    return $col;
  }

  // Column 2
  const $col2 = createColumn("For Coworkers", [
    "Find Workspace", "Browse Locations", "Pricing", "Reviews"
  ]);

  // Column 3
  const $col3 = createColumn("For Owners", [
    "List Property", "Manage Listings", "Owner Resources", "Support"
  ]);

  // Column 4
  const $col4 = createColumn("Company", [
    "About Us", "Contact", "Privacy Policy", "Terms of Service"
  ]);

  // Assemble grid
  $grid.append($col1, $col2, $col3, $col4);

  // Bottom section
  const $bottom = $("<div>").addClass("border-t border-gray-800 mt-8 pt-8 text-center text-gray-400");
  const $copyright = $("<p>").html("&copy; 2025 WorkSpace. All rights reserved.");

  $bottom.append($copyright);
  $container.append($grid, $bottom);
  $footer.append($container);

  // Inject into element with id="footer"
  $("#footer").append($footer);
});
