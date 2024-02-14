<head>
    <link rel="stylesheet" href="style/leaderboard.css">
</head>

<script lang="ts">
    import { enhance } from '$app/forms';
    import { getTier } from '$lib';
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
    <p class="title">Leaderboard</p>
    <div class="leaderboardContainer">
        <table class="header">
            <tr class="rank">
                <th>#</th>
                <th>Name</th>
                <th>Points</th>
                <th>Submitted</th>
                <th>Tier</th>
            </tr>
        </table>
        <section class="leaderboard">
            <table class="rankTable">
                {#each rankings as rank, index}
                    <tr class="rank">
                        <td>{index+1}</td>
                        <td>{rank.username}</td>
                        <td>{rank.points}</td>
                        <td>-1</td>
                        <td>{getTier(rank.points)}</td>
                    </tr>
                {/each}
            </table>
        </section>
    </div>
</main>


