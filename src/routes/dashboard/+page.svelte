<head>
	<link rel="stylesheet" href="style/dashboard.css">
</head>

<script lang="ts">
    import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	import { deserialize } from "$app/forms";
    import { onMount } from "svelte";
    import { generateRadarChart } from "$lib/index";
    import { getTier } from "$lib/index";
	export let data: PageData;

	let radarChartElement:HTMLCanvasElement;
	let ctx:CanvasRenderingContext2D|null;	

	onMount(async ()=>{
		ctx = radarChartElement.getContext('2d'); 
		if(ctx){
			await generateRadarChart(data.performances, ctx);
		}
	});
 
	const now = new Date;
	const time = `${now.getHours()}:${now.getMinutes()}`;

	let tier = getTier( data.points );
	
	const stats = [
		{
			"title": "Completed Activities",
			"value": data.finished,
			"updated": time
		}, {
			"title": "Submitted Activities",
			"value": data.submitted,
			"updated": time
		}, {
			"title": "Total Points",
			"value": data.points,
			"updated": time
		}, {
			"title": "Tier",
			"value": tier,
			"updated": time
		},
	];

	let viewed = -1;
	let activities = data.activites;

	let showActivityCreatePanel = false;
	let activityCreateDiv: HTMLDivElement;

	async function sendCreateActivity(e: any) {
		e.preventDefault();
		const formData = new FormData(e.srcElement.form);
		
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
        <a href="/submissions">Submissions</a>
        <form action=".?/logout" method="post" use:enhance>
			<input type="hidden" name="origin" value="/dashboard">
            <button>Log Out</button>
        </form>
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
	
	<div class="boxContainer">
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
							<td>
								<span on:click={()=>{toggleView(i)}}>{viewed==i ? 'Hide' : 'View'}</span>
							</td>
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
							<span></span>
							<div class="options">
								<form action="?/complete" method="post" use:enhance>
									<input type="hidden" name="activityId" value={activity.id}>
									<input type="hidden" name="username" value={data.username}>
									<button>Mark Completed</button>
								</form>
							</div>
						</section>
					{/each}
				</table>
			</div>
		</section>
	
		<section class="graphContainer nonMobile">
			<div class="canvasContainer">
				<canvas bind:this={radarChartElement}></canvas>
			</div>
		</section>
	</div>
</main>
