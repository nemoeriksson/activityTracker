<head>
    <link rel="stylesheet" href="style/homepage.css">
</head>

<script lang="ts">
    export let data;

    let isLoggedIn = data.loggedIn;
    console.log(isLoggedIn);
</script>

<body>
    <script>
        particlesJS.load('particles-js', '/assets/particles.json', function() {
            console.log('callback - particles.js config loaded');
        });
    </script>
</body>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
        
        {#if isLoggedIn}
            <a href="/dashboard">Dashboard</a>
            <a href="#">Log Out</a> <!-- TODO: Logout logic -->
        {:else}
            <a href="/login">Log In</a>
            <a href="/login?tab=register">Register</a>    
        {/if}
    </section>
</nav>

<main id="particles-js">
    <div class="text">
        <p class="title">OnFit - Gain points for being active</p>
        <p class="description">Register now and start climbing the leaderboard. Gain points by completing user submitted activities and compete with out ever-growing userbase for the number 1 spot</p>
        <a href="/login?tab=register" class="cta">Sign Up Now</a>
    </div>
</main>
