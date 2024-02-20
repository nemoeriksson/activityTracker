<head>
	<link rel="stylesheet" href="style/dashboard.css">
</head>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
            <a href="/dashboard">Dashboard</a>
            <form action="?/logout" method="post" use:enhance>
                <input type="hidden" name="origin" value="/">
                <button>Log Out</button>
            </form>
    </section>
</nav>

{#if data.user.admin}
<h1>We have got a admin in here!</h1>
{:else}
	<h1>We even got submissions in 2024???!!11!</h1>
	<h1>Hello {data.user.username} to OnFit</h1>
	<h2>List of your aktiviter</h2>
	<div class="restrainingOrder">
		<div class="activityContainer">
			<button on:click={activateActivityCreatePanel}>Create new activity</button>
			{#each activities as activity}
				<div class="activity">
					<p>name: {activity.name}</p>
					<p>description: {activity.description}</p>
					<p>category: {activity.category}</p>
					<p>theme: {activity.theme}</p>
					<p>createdBy: {activity.creatorName}</p>
					<p>points: {activity.points}</p>
				</div>
			{/each}
		</div>
	</div>

	{#if showActivityCreatePanel}
		<div class="jumpscare" bind:this={activityCreateDiv}>
			<h2>Activity creation form</h2>
			<form action="?/createActivity" method="POST" autocomplete="off" id="createActivityForm" use:enhance>
				<input required type="text" name="name" placeholder="Name"/>
				<br>
				<textarea rows="4" cols="50" name="description" placeholder="description" form="createActivityForm"></textarea>
				<br>
				<button on:click={sendCreateActivity}>Send activity to admin</button>
			</form>
		</div>
	{/if}
{/if}

<script lang="ts">
	import {deserialize} from "$app/forms";
    import { enhance } from '$app/forms';

    export let data;
	
	let activityCreateDiv: HTMLDivElement;
	function activateActivityCreatePanel() {
		showActivityCreatePanel = true;
	}
	// might be filtered
	let activities = data.activites;

	let showActivityCreatePanel = false;

	async function sendCreateActivity(e: any) {
		e.preventDefault();
		const formData = new FormData(e.srcElement.form);
		console.log(formData);
		
		// EPIC CODE!
		try {
			const response = await fetch("?/createActivity", {
				method: "POST",
				// Set the FormData instance as the request body
				body: formData,
			});
			//console.log((await response.json()).data.split(",").slice(1)[0].split("").slice(1, -2));
			let returnValue = deserialize(await response.text());
			// @ts-ignore
			let object = await JSON.parse(returnValue.data.error);
			if (object.activity != null) {
				activities.push(object.activity);
				activities = [...activities]
			}
		} catch (e) {
			alert("form failed: " + e);
		}
		showActivityCreatePanel = false;
	}

</script>
