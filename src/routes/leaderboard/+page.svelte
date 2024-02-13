<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;

    const rankings = data.rankings;
    const isLoggedIn = data.loggedIn;
</script>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/">Home</a>
        
        {#if isLoggedIn}
            <a href="/dashboard">Dashboard</a>
            <form action=".?/logout" method="post" use:enhance>
                <input type="hidden" name="origin" value="/leaderboard">
                <button>Log Out</button>
            </form>
        {:else}
            <a href="/login">Log In</a>
            <a href="/login?tab=register">Register</a>    
        {/if}
    </section>
</nav>

<main>
    <section class="header">
        <div class="rank left">
            <p>
                <span>Rank</span>
                <span>Name</span>
                <span>Points</span>
            </p>
        </div>
    </section>
    <section class="leaderboard">
        {#each rankings as rank, index}
            <div class="rank" class:left={index%2} class:right={!(index%2)}>
                <p>#{rank.rank} {rank.username} {rank.points}</p>
            </div>
        {/each}
    </section>
</main>


