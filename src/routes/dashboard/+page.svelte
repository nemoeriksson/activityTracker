<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/dashboard">Dashboard</a>
        <form action=".?/logout" method="post" use:enhance>
			<input type="hidden" name="origin" value="/dashboard">
            <button>Log Out</button>
        </form>
    </section>
</nav>
<h1>Hello {data.username} to OnFit</h1>
<h2>List of aktiviter</h2>
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

<script lang="ts">
    import { enhance } from "$app/forms";
	import type {PageData} from "./$types";
	import {onMount} from "svelte";
	import {deserialize} from "$app/forms";
	export let data: PageData;

	// might be filtered
	let activities = data.activites;

	let showActivityCreatePanel = false;
	let activityCreateDiv: HTMLDivElement;

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

	function activateActivityCreatePanel() {
		showActivityCreatePanel = true;
	}

	onMount(async () => {
	});
</script>

<style>
	.restrainingOrder {
		width: 100vw;
	}
	.activityContainer {
		display: flex;
		flex-direction: row;
		gap: 10px;
		max-width: 100vw;
		width: 100vw;
		flex-wrap: wrap;
	}
	.activity {
		padding: 20px;
		background-color: red;
	}
	.jumpscare {
		position: fixed;
		left: 50vw;
		top: 50vh;
		transform: translate(-50%, -50%);
		background-color: red;
		opacity: 85%;
		padding: 20px;
	}
</style>
