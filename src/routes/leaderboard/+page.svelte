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
                <th class="nonMobile">Submitted</th>
                <th>Tier</th>
            </tr>
        </table>
        <section class="leaderboard">
            <table class="rankTable">
                {#each rankings as rank, index}
                    <tr class="rank">
                        <td>
                            <span class="rankNumber"
                            class:leader={index==0}
                            class:top3={index<2}
                            class:top10={index<5}>
                                {index+1}
                            </span>
                        </td>
                        <td>{rank.username}</td>
                        <td>{rank.points}</td>
                        <td class="nonMobile">{rank.submissions}</td>
                        <td>{getTier(rank.points)}</td>
                    </tr>
                {/each}
                {#if !rankings.length}
                    <tr class="rank"> 
                        <td>
                            No users have joined yet - 
                            <a href="/login?tab=register">
                                Be the first!
                            </a> 
                        </td>
                    </tr>
                {/if}
            </table>
        </section>
    </div>
</main>


