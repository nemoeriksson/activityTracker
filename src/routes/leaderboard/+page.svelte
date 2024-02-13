<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#each data.users as user}
    <div>
        <p>{user.username}</p>
        <p>{user.points}</p>
    </div>
{/each}


