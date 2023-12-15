<template>
	<div>
		<Header />

		<main id="main" class="main">
			<div class="pagetitle">
				<h1 class="my-4 fs-1">Penilaian Lapangan</h1>
				<!-- <nav>
					<ol class="breadcrumb">
						<li class="breadcrumb-item">
							<router-link to="/dashboard"><a>Home</a></router-link>
						</li>
					</ol>
				</nav> -->
			</div>
			<!-- End Page Title -->

			<section class="section">
				<div class="row">
					<div class="col-lg-12">
						<div class="card">
							<div class="card-header d-flex justify-content-between p-3">
								<p class="fw-normal ms-2">
									Hello, <Span class="fw-bold">{{ user }}</Span>
								</p>
								<button
									v-if="role === `user`"
									class="btn btn-secondary"
									@click="$router.back()"
								>
									Back
								</button>
							</div>

							<div class="card-body">
								<div class="card-header d-flex justify-content-between">
									<h5>History</h5>
									<button class="btn btn-warning d-none">
										<i class="bi bi-arrow-clockwise"></i>
									</button>
								</div>
								<div class="card-body">
									<Label class="form-label fw-semibold">Filter By Date</Label>

									<div class="d-flex gap-1 col-lg-6 col-12">
										<input
											type="date"
											v-model="startDate"
											class="form-control"
										/>

										<input type="date" v-model="endDate" class="form-control" />
									</div>
								</div>
								<div class="table-responsive">
									<table v-if="role === `user`" class="table table-striped">
										<thead>
											<tr>
												<th scope="col">#</th>
												<th scope="col">Team Name</th>
												<th scope="col">Nilai</th>
												<th scope="col">Waktu</th>
												<th scope="col">Action</th>
											</tr>
										</thead>
										<tbody>
											<tr
												class="table datatable"
												v-for="(team, index) in teams"
												:key="index"
											>
												<th scope="row">{{ index + 1 }}</th>
												<td class="fw-normal" style="text-transform: uppercase">
													{{ team.teamName }}
												</td>
												<td class="fw-bold">{{ team.totalNilai }}</td>
												<td>{{ team.timeStamp }}</td>
												<td class="d-flex gap-1 flex-wrap">
													<router-link
														:to="
															'/detail/' + team.teamName + '/' + team.timeStamp
														"
														class="btn btn-primary"
													>
														View
													</router-link>
													<button
														type="button"
														@click="
															deleteNilai(user, team.teamName, team.timeStamp)
														"
														class="btn btn-danger btn-sm btn-responsive d-none"
													>
														Del
													</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<center v-if="teams.length === 0" class="fs-3 fw-bold">
									Tidak data 🧐
								</center>
								<!-- End Table with hoverable rows -->
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
		<!-- End #main -->
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
				user: null,
				role: null,
				startDate: null,
				endDate: null,
				nilaiList: [],
			};
		},
		methods: {
			signOut() {
				localStorage.clear("userData");
				this.$router.push("/");
			},

			getNilaiByUser() {
				try {
					this.$axios
						.get("/nilai-list?username=" + this.user)
						.then((response) => {
							this.nilaiList = response.data;
						});
				} catch (error) {
					console.error("Error fetching nilai data:", error);
				}
			},
			async deleteNilai(username, teamName, timestamp) {
				if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
					try {
						const response = await this.$axios.delete(
							`/${username}/${teamName}/${timestamp}`
						);
						if (response.status === 200) {
							console.log(response.status);
							this.getNilaiByUser();
							alert("Delete Success");
						}
					} catch (error) {
						console.error("Error deleting nilai data:", error);
					}
				}
			},
		},
		created() {
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData) {
				this.user = userData.username;
				this.role = userData.role;
			}
		},

		computed: {
			teams() {
				const groupedData = this.nilaiList.reduce((result, item) => {
					const key = `${item.teamName}_${item.formattedTimestamp}`;
					if (!result[key]) {
						result[key] = {
							teamName: item.teamName,
							timeStamp: item.formattedTimestamp,
							totalNilai: 0,
						};
					}
					result[key].totalNilai += item.nilai;
					return result;
				}, {});

				for (const key in groupedData) {
					groupedData[key].totalNilai = parseFloat(
						groupedData[key].totalNilai.toFixed(2)
					);
				}
				const sortedData = Object.values(groupedData).sort((a, b) => {
					return new Date(b.timeStamp) - new Date(a.timeStamp);
				});

				if (this.startDate && this.endDate) {
					const start = new Date(this.startDate);
					const end = new Date(this.endDate);
					return sortedData.filter((item) => {
						const itemDate = new Date(item.timeStamp);
						return itemDate >= start && itemDate <= end;
					});
				} else {
					return sortedData;
				}
			},
		},

		mounted() {
			this.getNilaiByUser();
		},
	};
</script>
<style></style>
