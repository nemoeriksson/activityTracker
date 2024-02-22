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
	<h1>Admin tools</h1>
	<h2>All aktivities</h2>
{:else}
	<h2>Your activities</h2>
{/if}
<div class="restrainingOrder">
	<div class="activityContainer">
		<button on:click={activateActivityCreatePanel}>Create new activity</button>
		{#each activities as activity, i}
			<div class="activity">
				<p>name: {activity.name}</p>
				<p>description: {activity.description}</p>
				<p>category: {activity.category}</p>
				<p>createdBy: {activity.creatorName}</p>
				<p>points:
					{#if data.user.admin}
						<input type="number" id="pn{i}" value={activity.points} on:change={onChangaroo}/>
					{:else}
						{activity.points}
					{/if}
				</p>
				<p>approved: <input type="checkbox" checked={activity.approved} disabled={!data.user.admin} on:change={() => activityOnApproveChange(i)} /></p>
			</div>
		{/each}
	</div>
</div>
{#if data.user.admin}
	<h2>All users</h2>
	<div class="restrainingOrder">
		<div class="userContainer">
			{#each data.users as user, i}
				<div class="user">
					<p>name: {user.username}</p>
					<p>admin: <input type="checkbox" checked={user.admin} on:change={() => userOnAdminChange(i)} /></p>
				</div>
			{/each}
		</div>
	</div>
{/if}

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
	import {deserialize} from "$app/forms";
    import { enhance } from '$app/forms';

    export let data;

	async function userOnAdminChange(i: number) {
		data.users[i].admin = !data.users[i].admin;
		const formData = new FormData();
		formData.set("id", ""+data.users[i].id);
		formData.set("admin", ""+data.users[i].admin);
		try {
			let response = await fetch("?/changeUserAdminBool", {
				method: "POST",
				// Set the FormData instance as the request body
				body: formData,
			});
			response = response;
		} catch (e) {
			alert("mimimimimi");
		}
	}

	let activityCreateDiv: HTMLDivElement;
	function activateActivityCreatePanel() {
		showActivityCreatePanel = true;
	}
	// might be filtered
	let activities = data.activities;

	let showActivityCreatePanel = false;

	async function onChangaroo(input: any) {
		let number = input.target.value;
		let id = data.activities[input.target.id.split("").slice(2).join("")].id;
		const formData = new FormData();
		console.log(id);
		formData.set("id", id);
		formData.set("number", number);
		try {
			let response = await fetch("?/changeActivityPoint", {
				method: "POST",
				// Set the FormData instance as the request body
				body: formData,
			});
			response = response;
		} catch (e) {
			alert("AHHHHHHhh");
		}
	}

	async function activityOnApproveChange(activityIndex: number) {
		activities[activityIndex].approved = !activities[activityIndex].approved;
		const formData = new FormData();
		formData.set("approved", activities[activityIndex].approved);
		formData.set("id", activities[activityIndex].id);
		try {
			let response = await fetch("?/changeActivityApprove", {
				method: "POST",
				// Set the FormData instance as the request body
				body: formData,
			});
			response = response;
		} catch (e) {
			alert("it did not do it");
		}
	}

	async function sendCreateActivity(e: any) {
		e.preventDefault();
		const formData = new FormData(e.srcElement.form);
		
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
<style>
	.userContainer {
		display: flex;
		flex-direction: row;
		gap: 10px;
		max-width: 100vw;
		width: 100vw;
		flex-wrap: wrap;
	}
	.user {
		padding: 20px;
		background-color: red;
	}
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
