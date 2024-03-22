<head>
	<link rel="stylesheet" href="style/submissions.css">
</head>

<script lang="ts">
	import { enhance } from '$app/forms';
    import toast, { Toaster } from 'svelte-french-toast';
    
    export let data;

	enum tab_alts {
		CREATION_FORM,
		USER_LIST,
		ACTIVITY_LIST
	}
	let viewedTab = tab_alts.CREATION_FORM;

	let userSearchQuery = "";
	let activitySearchQuery = "";
	
	enum filters {
		SHOW_ALL,
		ADMINS,
		USERS,
		APPROVED,
		UNAPPROVED
	}
	let filter = filters.SHOW_ALL;

	const activities = data.activities;
	const users = data.users;

	function setView(target:tab_alts){
		viewedTab = target;
	}

	function setFilter(target:filters){
		filter = target;
	}

	function short(str:string, to=8){
		return str.length > to ? `${str.slice(0, to)}..` : str;
	}

	async function sendAdminToggleRequest(username:string, isAdmin:boolean, id:number){
		const content:FormData = new FormData();
		content.set('admin', isAdmin.toString());
		content.set('userId', id.toString());

		if(data.userId == id){
			toast.error('Cannot remove admin from yourself');
			return;
		}
		
		await fetch('?/toggleAdminRole', {
			method: 'post',
			body: content
		}).then(r=>{
			window.location.reload();
		});
	}
</script>

<Toaster />

<nav>
    <a href="/">OnFit</a>
    
    <section class="links">
        <a href="/leaderboard">Leaderboard</a>
            <a href="/dashboard">Dashboard</a>
            <form action=".?/logout" method="post" use:enhance>
                <input type="hidden" name="origin" value="/submissions">
                <button>Log Out</button>
            </form>
    </section>
</nav>

<div class="content">
	{#if data.isAdmin}
		<div class="sidebar">
			<button on:click={()=>{setView(tab_alts.CREATION_FORM)}}>Creation Form</button>
			<button on:click={()=>{setView(tab_alts.USER_LIST)}}>Users</button>
			<button on:click={()=>{setView(tab_alts.ACTIVITY_LIST)}}>Suggestions</button>
		</div>
	{/if}

	{#if viewedTab == tab_alts.CREATION_FORM}
		<div class="formContainer" class:centered={!data.isAdmin}>
			<p class="title">Send Activity Suggestion</p>
			<p class="description">Suggestions are validated by administrators and they will set points</p>
			<form action="?/createActivity" method="post" autocomplete="off" use:enhance>
				<div class="inputField">
					<label for="title" class="title">Activity Title</label>
					<input name="title" id="title" type="text" required>
				</div>
				<div class="inputField">
					<label for="description" class="title">Activity Description</label>
					<textarea name="description" id="description" cols="40" rows="4" required></textarea>
				</div>

				<div class="inputField category">
					<label for="category">Category</label>
					<select required name="category" id="category">
						<option value="Strength">Strength</option>
						<option value="Endurance">Endurance</option>
						<option value="Yoga">Yoga</option>
						<option value="Cardio">Cardio</option>
						<option value="Other">Other</option>
					</select>
				</div>
				
				<div class="inputFieldGroup">
					<div class="inputField">
						<label for="reps">Repetitions <span>(optional)</span></label>
						<input type="number" name="reps" id="reps" min="0" value="0" required>
					</div>
					<div class="inputField">
						<label for="sets">Sets <span>(optional)</span></label>
						<input type="number" name="sets" id="sets" min="0" value="0" required>
					</div>
				</div>
				<button>Send Suggestion</button>
			</form>
		</div>
	{:else}
		<div class="listContainer">
			{#if viewedTab == tab_alts.USER_LIST}
				<div class="stats nonMobile">
					<div class="stat">
						<p class="title">Total Users</p>
						<p class="value">{users.length}</p>
					</div>
					<div class="stat">
						<p class="title">Members</p>
						<p class="value">{users.filter(
							// @ts-ignore
							u => !u.admin).length}</p>
					</div>
					<div class="stat">
						<p class="title">Admins</p>
						<p class="value">{users.filter(
							// @ts-ignore
							u => u.admin).length}</p>
					</div>
				</div>
				<hr>
				<div class="filters">
					<div class="buttons">
						<button class:active={filter == filters.SHOW_ALL} on:click={()=>(setFilter(filters.SHOW_ALL))}>All Users</button>
						<button class:active={filter == filters.ADMINS} on:click={()=>(setFilter(filters.ADMINS))}>Admins</button>
						<button class:active={filter == filters.USERS} on:click={()=>(setFilter(filters.USERS))}>Casuals</button>
					</div>
					<input type="text" placeholder="Search" bind:value={userSearchQuery}>
				</div>
				<table class="header">
					<tr>
						<th>User</th>
						<th>ID</th>
						<th>Role</th>
						<th>Options</th>
					</tr>
				</table>
				<table class="list">
					{#each users as user}
						{#if (user.admin && filter == filters.ADMINS) || (!user.admin && filter == filters.USERS) || filter == filters.SHOW_ALL}
							{#if user.username.includes(userSearchQuery.trimStart().trimEnd())}
								<tr class="listItem">
									<td>{user.username}</td>
									<td>{user.id} {data.userId == user.id ? '(You)' : ''}</td>
									<td>
										<span class="role" class:admin={user.admin}>
											{user.admin ? 'Admin' : 'Casual'}		
										</span>
									</td>
									<td>
										<span class="btn" on:click={()=>{sendAdminToggleRequest(user.username, user.admin, user.id)}} aria-hidden="true">Toggle Admin Rights</span>
									</td>
								</tr>
							{/if}
						{/if}
					{/each}
				</table>
			{:else if viewedTab == tab_alts.ACTIVITY_LIST}
				<div class="stats nonMobile">
					<div class="stat">
						<p class="title">Total Activities</p>
						<p class="value">{activities.length}</p>
					</div>
					<div class="stat">
						<p class="title">Approved Activities</p>
						<p class="value">{activities.filter(
							// @ts-ignore
							a => a.approved).length}</p>
					</div>
					<div class="stat">
						<p class="title">Unapproved Activities</p>
						<p class="value">{activities.filter(
							// @ts-ignore
							a => !a.approved).length}</p>
					</div>
				</div>
				<hr>
				<div class="filters">
					<div class="buttons">
						<button class:active={filter == filters.SHOW_ALL} on:click={()=>(setFilter(filters.SHOW_ALL))}>All Activities</button>
						<button class:active={filter == filters.APPROVED} on:click={()=>(setFilter(filters.APPROVED))}>Approved</button>
						<button class:active={filter == filters.UNAPPROVED} on:click={()=>(setFilter(filters.UNAPPROVED))}>Suggestions</button>
					</div>
					<input type="text" bind:value={activitySearchQuery} placeholder="Search">
				</div>
				<div class="list">
					{#each activities as activity}
						{#if (activity.approved && filter == filters.APPROVED) || (!activity.approved && filter == filters.UNAPPROVED) || filter == filters.SHOW_ALL}
							{#if activity.name.includes(activitySearchQuery.trimStart().trimEnd())}
							<div class="listItem">
									{activity.name}
								</div>
							{/if}
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>