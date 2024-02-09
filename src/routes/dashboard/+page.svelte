<script lang="ts">
    import { enhance } from "$app/forms";
	import type {PageData} from "./$types";
	export let data: PageData;
</script>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/dashboard">Dashboard</a>
        <form action="?/logout" method="post" use:enhance>
            <button>Log Out</button>
        </form>
    </section>
</nav>

<h1>Hello {data.username} to OnFit</h1>
<h2>Your aktiviter</h2>
<h2>List of aktiviter</h2>