<template lang="">
	<div>
		<Header></Header>

		<main id="main" class="main">
			<div class="pagetitle">
				<h1 class="fs-3">Penilaian Lapangan Admin</h1>
			</div>
			<!-- End Page Title -->
		</main>
	</div>
</template>

<script>
	import Header from "../../components/Header.vue";
	export default {
		components: {
			Header,
		},

		data() {
			return {
				nilaiLapangan: [],
				tokenUser: {
					user: null,
					nip: null,
					role: null,
				},
			};
		},

		methods: {
			getAllData() {
				try {
					this.$axios.get("/nilai-lapangan").then((response) => {
						console.log(
							"🚀 ~ file: History-Lapangan-admin.vue:154 ~ this.$axios.get ~ response.data:",
							response.data
						);
						this.nilaiLapangan = response.data;
					});
				} catch (error) {
					console.log(
						"🚀 ~ file: History-Lapangan-admin.vue:45 ~ getAllData ~ error:",
						error
					);
				}
			},
		},
		created() {
			console.log("Ada");
			try {
				const userData = JSON.parse(localStorage.getItem("userData"));
				if (userData) {
					this.tokenUser.name = userData.username;
					this.tokenUser.nip = userData.nip;
					this.tokenUser.role = userData.role;
					console.log(
						"🚀 ~ file: History-Lapangan-admin.vue:59 ~ created ~ tokenUser.role:"
					);

					console.log(userData);

					this.getAllData();
				}
			} catch (error) {
				console.log("fail fetch userData " + error);
			}
		},
	};
</script>

<style lang=""></style>
