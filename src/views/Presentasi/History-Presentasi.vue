<template lang="">
	<div>
		<Header></Header>

		<main id="main" class="main">
			<div class="pagetitle my-3 mb-4">
				<h1 class="fs-1">Penilaian Presentasi QCC</h1>
			</div>

			<div class="card">
				<div class="card-body d-flex justify-content-between">
					<h4>Hello, <span>Wiz</span></h4>
					<button class="btn btn-secondary" @click="$router.back()">
						Back
					</button>
				</div>
			</div>

			<div class="card">
				<div class="card-header fw-bold">History Presentasi</div>
				<div class="card-body">
					<Label class="form-label p-2 fw-semibold">Filter By Date</Label>
					<div class="d-flex p-2 gap-2 col-lg-6 col-12">
						<input type="date" v-model="startDate" class="form-control" />
						<input type="date" v-model="endDate" class="form-control" />
						<button @click.prevent="btnReset()" class="btn btn-warning">
							<i class="bi bi-arrow-clockwise"></i>
						</button>
					</div>
				</div>
				<div class="card-body">
					<div class="table-responsive">
						<table class="table table-group-divider">
							<thead>
								<tr>
									<th>No</th>
									<th>Team</th>
									<th>Score</th>
									<th>Created</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in dataBynip" :key="index" class="">
									<td>{{ index + 1 }}</td>
									<td>{{ item.teamName }}</td>
									<td>{{ item.totalScore }}</td>
									<td>{{ item.createdAt }}</td>
									<td>
										<router-link
											class="btn btn-secondary"
											:to="{
												path: '/presentasi/detail-presentasi',
												query: { team: item.teamName, date: item.createdAt },
											}"
										>
											View
										</router-link>
									</td>
								</tr>
								<tr v-if="dataBynip.length === 0" class="text-center">
									<td colspan="4">No Data</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
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
				scoreByNip: [],
				questionData: [],
				teamList: [],
				selectedTeam: null,
				totalScore: 0,
				startDate: null,
				endDate: null,

				tokenUser: {
					nip: null,
					name: null,
					role: null,
				},
			};
		},

		methods: {
			btnReset() {
				(this.startDate = ""), (this.endDate = "");
			},
			getByNip() {
				try {
					this.axios
						.get(`/score/byNip/${this.tokenUser.nip}`)
						.then((response) => {
							console.log(response.data);
							this.scoreByNip = response.data;
						});
				} catch (error) {
					console.log("Fail getByNip " + error);
				}
			},

			getTeams() {
				try {
					this.axios.get("/teams-all").then((response) => {
						console.log(response.data);
						this.teamList = response.data;
					});
				} catch (error) {
					console.log("fail fetch teams" + error);
				}
			},

			getQuestion() {
				try {
					this.axios.get("/items-presentasi").then((response) => {
						// console.log(response.data);
						this.questionData = response.data;
						// console.log(this.questionData);
					});
				} catch (error) {
					console.log("fail fetch question" + error);
				}
			},
		},

		computed: {
			dataBynip() {
				const groupedData = this.scoreByNip.reduce((result, item) => {
					const key = `${item.teamName}_${item.createdAt}`;
					if (!result[key]) {
						result[key] = {
							teamName: item.teamName,
							createdAt: item.createdAt,
							totalScore: 0,
						};
					}

					result[key].totalScore += item.score;
					return result;
				}, {});

				for (const key in groupedData) {
					groupedData[key].totalScore = parseFloat(
						groupedData[key].totalScore.toFixed(2)
					);
				}
				// Mengubah objek menjadi array dan mengurutkannya berdasarkan createdAt
				const sortedData = Object.values(groupedData).sort((a, b) => {
					return new Date(b.createdAt) - new Date(a.createdAt);
				});

				// Filter data berdasarkan rentang tanggal jika tanggal sudah dipilih
				if (this.startDate && this.endDate) {
					const start = new Date(this.startDate);
					const end = new Date(this.endDate);
					return sortedData.filter((item) => {
						const itemDate = new Date(item.createdAt);
						return itemDate >= start && itemDate <= end;
					});
				} else {
					return sortedData;
				}
			},

			totalScoreInput() {
				let total = 0;
				for (const question of this.questionData) {
					const title = question.title;
					const scoreValue = this.score[title] || 0;
					total += Math.max(0, Math.min(scoreValue, question.maxScore));
				}
				this.totalScore = total;
			},
		},

		created() {
			try {
				const userData = JSON.parse(localStorage.getItem("userData"));
				if (userData) {
					this.tokenUser.name = userData.username;
					this.tokenUser.nip = userData.nip;
					this.tokenUser.role = userData.role;

					this.getQuestion();
					this.getTeams();
					this.getByNip();

					// console.log(this.tokenUser);
				}
			} catch (error) {
				console.log("fail fetch userData " + error);
			}
		},
	};
</script>
<style lang=""></style>
