<head>
	<link rel="stylesheet" href="style/dashboard.css">
</head>

<script lang="ts">
    import { enhance } from "$app/forms";
	import type {PageData} from "./$types";
	import {onMount} from "svelte";
	import {deserialize} from "$app/forms";
	export let data: PageData;

	const stats = [
		{
			"title": "Completed Activities",
			"value": 21,
			"updated": "14:20"
		},{
			"title": "Submitted Activities",
			"value": 2,
			"updated": "14:20"
		},{
			"title": "Total Points",
			"value": 150,
			"updated": "14:20"
		},{
			"title": "Tier",
			"value": "Beginner",
			"updated": "14:20"
		},
	];

	let viewed = -1;
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

	function toggleView(target:number){
		if(viewed == target){
			viewed = -1;
		} 
		else{
			viewed = target
		}
	}
</script>

<nav>
    <a class="title" href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
        <a href="/dashboard">Dashboard</a>
        <form action=".?/logout" method="post" use:enhance>
			<input type="hidden" name="origin" value="/dashboard">
            <button>Log Out</button>
        </form>
        <a href="/submissions">Submissions</a>
    </section>
</nav>

<main>
	<section class="achievements">
		{#each stats as stat}
			<div class="statContainer">
				<div class="stat">
					<div>
						<p class="value">{stat.value}</p>
						<p class="title">{stat.title}</p>
					</div>
					<span class="statIcon nonMobile"></span>
				</div>
				<div class="footer nonMobile">
					<hr>
					<p class="updated">
						<span class="clockIcon"></span>
						<span class="date">Updated {stat.updated}</span>
					</p>
				</div>
			</div>
		{/each}
	</section>
	
	<section class="activityListContainer">
		<table>
			<tr class="header">
				<th>Title</th>
				<th>Category</th>
				<th>Points</th>
				<th>Details</th>
			</tr>
		</table>
		<div class="activities">
			<table>
				{#each activities as activity, i}
					<tr class="activity">
						<td>{activity.name}</td>
						<td>{activity.category}</td>
						<td>{activity.points}</td>
						<td><span on:click={()=>{toggleView(i)}}>View</span></td>
					</tr>
					<section class="description"
						class:viewed={viewed==i}>
						{#if activity.description}
							<span>{activity.description}</span>
						{/if}
						<div class="details">
							{#if activity.reps}
								<p>Reps: {activity.reps}</p>
							{/if}
							{#if activity.sets}
								<p>Sets: {activity.sets}</p>
							{/if}
						</div>
					</section>
				{/each}
			</table>
		</div>
	</section>
	
	<section class="graphContainer">

	</section>
</main>
