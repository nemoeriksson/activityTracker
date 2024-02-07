
<title>Fire site</title>

<div id="site">
	<nav>
		<a id="name" href="/">OnFit</a>
		<p class="seperator">|</p>
		<section class="links">
			<a href="/leaderboard">leaderboard</a>
			<a href="/login">sign-up/sign-in</a>
		</section>
	</nav>
	<slot/>
</div>

<style>
	.links {
		display: flex;
		gap: 10px;
	}
	#site {
		position: absolute;
		left: 0;
		top: 0;
		margin: 0;
	}
	nav {
		display: flex;
		background-color: red;
		margin: 0;
		width: 100vw;
	}
	nav * {
		font-size: 1rem;
		padding: 0;
		margin: 0;
	}
</style>
