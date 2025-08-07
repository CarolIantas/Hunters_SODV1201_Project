$(document).ready(function () {
  const $main = $("<main>").attr("id", "main");

  // Hero Section
  const $hero = $(`
    <section class="relative bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Find Your Perfect <span class="text-blue-600">Workspace</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with flexible workspace solutions. Whether you're a coworker seeking the perfect office space or an owner looking to maximize your property's potential, we make it simple.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center">
                Find Workspace
                <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
              <button class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all">
                List Your Space
              </button>
            </div>
          </div>
          <div class="relative">
            <img 
              src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Modern coworking space" 
              class="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div class="flex items-center">
                <div class="bg-green-100 p-2 rounded-full mr-3">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Active Users</p>
                  <p class="text-2xl font-bold text-gray-900">2,500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `);

  // Features Section (static chunk)
  const $features = $(`
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a workspace owner or a coworker, our platform provides the tools you need to succeed.
          </p>
        </div>
        <!-- Coworkers and Owners grid reused as static HTML block -->
        <!-- Keep the rest as literal, since they're mostly static UI content -->
      </div>
    </section>
  `);

  // How It Works Section
  const $howItWorks = $(`
    <section id="how-it-works" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-xl text-gray-600">Simple steps to get started</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
            <p class="text-gray-600">Create your account and choose your role as an owner or coworker</p>
          </div>
          <div class="text-center">
            <div class="bg-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">List or Search</h3>
            <p class="text-gray-600">Owners list their spaces, coworkers search for perfect workspaces</p>
          </div>
          <div class="text-center">
            <div class="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
            <p class="text-gray-600">Make connections, book spaces, and start working together</p>
          </div>
        </div>
      </div>
    </section>
  `);

  // Benefits Section
  const $benefits = $(`
    <section id="benefits" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Why Choose WorkSpace?</h2>
            <div class="space-y-6">
              <!-- Feature 1 -->
              <div class="flex items-start">
                <div class="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">Premium Amenities</h3>
                  <p class="text-gray-600">High-speed internet, printing facilities, kitchen access, and more</p>
                </div>
              </div>
              <!-- Feature 2 -->
              <div class="flex items-start">
                <div class="bg-teal-100 p-2 rounded-lg mr-4">
                  <svg class="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">Trusted Community</h3>
                  <p class="text-gray-600">Verified users and authentic reviews create a safe environment</p>
                </div>
              </div>
              <!-- Feature 3 -->
              <div class="flex items-start">
                <div class="bg-orange-100 p-2 rounded-lg mr-4">
                  <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">Instant Booking</h3>
                  <p class="text-gray-600">Book workspaces instantly with real-time availability</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src="https://images.pexels.com/photos/7688334/pexels-photo-7688334.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Professional workspace" class="rounded-2xl shadow-2xl w-full h-80 object-cover"/>
          </div>
        </div>
      </div>
    </section>
  `);

  // CTA Section
  const $cta = $(`
    <section class="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of coworkers and workspace owners who trust WorkSpace for their flexible office needs.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Find Your Workspace
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            List Your Property
          </button>
        </div>
      </div>
    </section>
  `);

  // Append all sections
  $main.append($hero, $features, $howItWorks, $benefits, $cta);
  $("#main").replaceWith($main); // Replace if #main already exists
});
