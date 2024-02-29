<head>
	<link rel="stylesheet" href="style/dashboard.css">
</head>

<script lang="ts">
    import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { generateChartDataset, generateRadarChart } from "$lib/index";
    import { getTier } from "$lib/index";
    import type { Chart, ChartDataset } from "chart.js";
    import toast, { Toaster } from "svelte-french-toast";
    export let data: PageData;

	let radarChartElement:HTMLCanvasElement;
	let ctx:CanvasRenderingContext2D|null;	
	let chart:Chart;

	async function createRadarChart(){
		ctx = radarChartElement.getContext('2d');
		if(ctx)
			chart = await generateRadarChart(performances, ctx);
	}

	async function updateRadarChart(){
		const chartData:{
			datasets: ChartDataset[],
			maxRange: number
		} = await generateChartDataset(performances);
		
		chart.data.datasets = chartData.datasets;
		
		if(chart.config.options?.scales?.r?.suggestedMax)
			chart.config.options.scales.r.suggestedMax = chartData.maxRange;

		chart.update();
	}

	onMount(createRadarChart);
 
	const now = new Date;
	const time = `${now.getHours()}:${now.getMinutes()}`;
	$: tier = getTier(data.points);

	$: stats = [
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
	$: activities = data.activites;
	$: performances = data.performances;

	function toggleView(target:number){
		if(viewed == target){
			viewed = -1;
		} 
		else{
			viewed = target
		}
	}

	function isCompleted(activityName:string){
		return [...performances].map(v => v.aktivitet.name).includes(activityName);
	}

	function sendToast(activityName:string){
		const completed = isCompleted(activityName);
		
		if(!completed){
			toast.success(`Marked ${activityName} as complete`);
		}else{
			toast.success(`Marked ${activityName} as incomplete`);
		}
	}
</script>

<Toaster />

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
								<span aria-hidden="true" on:click={()=>{toggleView(i)}}>{viewed==i ? 'Hide' : 'View'}</span>
							</td>
						</tr>
						<section class="description"
							class:viewed={viewed==i}>
							<span class="description">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, modi cupiditate libero quae provident laborum animi ipsum, doloremque repellat sunt soluta minima? Dolor perspiciatis eligendi sunt, sequi nostrum tenetur quaerat commodi, illum alias excepturi repellat molestias repudiandae, accusantium quia animi?
							</span>
							<div class="details">
								<p>Reps: {activity.reps || 0}</p>
								<p>Sets: {activity.sets || 0}</p>
							</div>
							<div class="options">
								<form action="?/complete" method="post" use:enhance={()=>{
									return async ({update}) => {
										await update({invalidateAll:true});
										await updateRadarChart();
									}}}>
									<input type="hidden" name="activityId" value={activity.id}>
									<input type="hidden" name="username" value={data.username}>
									<button on:click={()=>{sendToast(activity.name)}}>{isCompleted(activity.name) ? 'Unfinish' : 'Complete'}</button>
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
