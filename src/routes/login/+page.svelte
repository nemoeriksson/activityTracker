<script lang="ts">

enum Tabs {
	LOGIN, 
	REGISTER 
}

let tab = Tabs.LOGIN;
</script>

<div class="container">
	{#if tab == Tabs.LOGIN}
		<form action="?/login" method="post">
			<div class="inputField">
				<label for="user">Name or Email</label>
				<input type="text" id="user" name="user">
			</div>
			<div class="inputField">
				<label for="password-login">Password</label>
				<input type="text" id="password-login" name="password">
			</div>
		</form>
	{/if}
	{#if tab == Tabs.REGISTER}
		<form action="?/register" method="post">
			<div class="inputField">
				<label for="name">Name</label>
				<input type="text" id="name" name="name"/>
			</div>
			<div class="inputField">
				<label for="email">Email</label>
				<input type="email" id="email" name="email">
			</div>
			<div class="inputField">
				<label for="password-register">Password</label>
				<input type="password" id="password-register" name="password">
			</div>
		</form>
	{/if}
</div>
