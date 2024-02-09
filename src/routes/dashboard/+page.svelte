<script lang="ts">
	import type {PageData} from "./$types";
	export let data: PageData;
</script>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/dashboard">Dashboard</a>
        <a href="#">Log Out</a> <!-- TODO: Logout logic -->
    </section>
</nav>

<h1>Hello {data.username} to OnFit</h1>
<h2>Your aktiviter</h2>
<h2>List of aktiviter</h2>