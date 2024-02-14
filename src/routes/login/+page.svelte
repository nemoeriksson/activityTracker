<head>
	<link rel="stylesheet" href="style/login.css">
</head>

<script lang="ts">
    import { enhance } from "$app/forms";
	import { page } from "$app/stores";

	export let form;
	$: errored = form?.errorType ? true : false;

	enum Tabs {
		LOGIN='Login',
		REGISTER='Register',
	}

	$: isRegistering = $page.url.searchParams.get("tab") == "register";
	$: tab = isRegistering ? Tabs.REGISTER : Tabs.LOGIN;
</script>

<main>
	<section class="formSection">
		<div class="mobileOnly customBackground"></div>
		<div class="mobileOnly customBackground"></div>
		{#if tab == Tabs.LOGIN}
			<p class="sectionTitle">Sign In</p>
			<div class="icons">
				<div class="icon-fb"></div>
				<div class="icon-ig"></div>
				<div class="icon-git"></div>
			</div>
			<form action="?/login" method="post" autocomplete="off" use:enhance>
				<p>Sign in to your account</p>	
				<div class="inputField">
					<input required type="text" id="username" name="username" placeholder="Username"/>
				</div>
				<div class="inputField">
					<input required type="password" id="password-login" name="password" placeholder="Password"/>
				</div>
				{#if form?.error}
					<span>{form.error}</span>
				{/if}
				<button>Sign In</button>
			</form>
			<p class="mobileOnly changeText">Don't have an account? <a href="/login?tab=register">Sign Up</a></p>
		{/if}
		{#if tab == Tabs.REGISTER}
			<p class="sectionTitle">Sign Up</p>
			<div class="icons">
				<div class="icon-fb"></div>
				<div class="icon-ig"></div>
				<div class="icon-git"></div>
			</div>
			<form action="?/register" method="post" autocomplete="off" use:enhance>
				<p>Create a new account</p>	
				<div class="inputField">
					<input required type="text" id="username" name="username" placeholder="Username" 
						class:error={form?.errorType==1 && errored} on:input={()=>{errored=false}}/>
				</div>
				<div class="inputField">
					<input required type="password" id="password-register" name="password" placeholder="Password" 
						class:error={form?.errorType==2 && errored} on:input={()=>{errored=false}}/>
				</div>
				<div class="inputField">
					<input required type="password" id="password-confirm" name="password-confirm" placeholder="Confirm Password" 
						class:error={form?.errorType==2 && errored} on:input={()=>{errored=false}}/>
				</div>
				{#if form?.error}
					<span>{form.error}</span>
				{/if}
				<button>Sign Up</button>
			</form>
			<p class="mobileOnly changeText">Already have an account? <a href="/login">Sign in</a></p>
		{/if}
	</section>
	<section class="secondary nonMobile">
		<div class="text">
			{#if tab == Tabs.LOGIN}
				<p class="title">Create an account</p>
				<p class="description">Create an account now and start collecting points while training</p>
				<a href="/login?tab=register">Sign Up</a>
			{:else if tab == Tabs.REGISTER}
				<p class="title">Sign in to your account</p>
				<p class="description">Already signed up? Sign in to your account and continue collecting points</p>
				<a href="/login">Sign In</a>
			{/if}
		</div>
	</section>
</main>