<template>
	<div>
		<Header></Header>
		<main id="main" class="main">
			<div class="card">
				<div
					class="card-body d-flex justify-content-between align-content-center"
				>
					<p class="card-subtitle">
						Hello,
						<span class="fw-bold fs-6">{{ tokenUser.user.toUpperCase() }}</span>
						<br />
					</p>

					<div>
						<!-- <router-link
							v-if="tokenUser.role === 'admin'"
							to="/input-point"
							class="btn btn-success"
							>History</router-link
						> -->
						<button
							v-if="tokenUser.role === 'user'"
							class="btn btn-success w-auto"
							@click="$router.back()"
						>
							Back
						</button>
					</div>
				</div>
			</div>

			<!-- HIstory Start -->
			<div class="card">
				<form>
					<div
						class="card-header d-flex justify-content-between align-content-center"
					>
						<h5 class="my-auto fw-bold">History</h5>
						<div>
							<!-- <button type="submit" class="btn btn-primary p-2 m-2 w-auto">
                Submit
              </button> -->
						</div>
					</div>
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-bordered">
								<thead>
									<tr class="fs-5 fw-bold text-center">
										<th class="text-center p-4">No</th>
										<th class="text-center p-4">Question</th>
										<th class="text-center p-4">Max</th>
										<!-- Kolom untuk setiap tim -->
										<template
											v-for="(team, teamIndex) in teamData"
											:key="teamIndex"
										>
											<th class="text-center p-4">{{ team.teamName }}</th>
										</template>
									</tr>
								</thead>
								<tbody>
									<template
										v-for="(question, questionIndex) in questionData"
										:key="questionIndex"
									>
										<tr>
											<td class="text-center">{{ questionIndex + 1 }}</td>
											<td class="text-wrap question-cell w-25">
												{{ question.subscriteriaName }}
											</td>
											<td class="text-center">{{ question.maxPoint }}</td>

											<template
												v-for="(team, teamIndex) in teamData"
												:key="teamIndex"
											>
												<td class="text-center">
													<input
														type="number"
														:value="
															getPointByUsernameAndTeam(
																question.subscriteriaName,
																team.teamName
															)
														"
														disabled
														min="0"
														class="form-control text-center"
														:id="'input-' + questionIndex + '-' + teamIndex"
													/>
												</td>
											</template>
										</tr>
									</template>
								</tbody>
								<tfoot>
									<tr class="fs-5 fw-bold text-center">
										<td colspan="3" class="text-center p-2">Total</td>
										<!-- Menghitung total poin untuk setiap tim -->
										<template v-for="(team, teamIndex) in teamData">
											<td class="text-center p-2">
												{{ calculateTotalPoints(team.teamName) }}
											</td>
										</template>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</form>
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
				btnHistory: "History",
				username: "",
				selectedTeam: "",
				inputValues: [],
				questionData: [],
				teamData: [],
				pointData: [],
				totalPoint: 0,
				showTable: false,
				pointByUser: [],
				tokenUser: {
					nip: null,
					user: null,
					role: null,
				},
			};
		},

		methods: {
			calculateTotalPoints(teamName) {
				let total = 0;
				this.questionData.forEach((question, questionIndex) => {
					// Menambahkan poin dari tiap tim pada setiap pertanyaan
					total += parseInt(
						this.getPointByUsernameAndTeam(question.subscriteriaName, teamName)
					);
				});
				return total;
			},
			updateTotalPoint() {
				this.totalPoint = this.pointData.reduce((acc, currentValue) => {
					return acc + (parseInt(currentValue) || 0);
				}, 0);
			},
			getPointByUsernameAndTeam(subcriteriaName, teamName) {
				// Filter respons pointByUser berdasarkan pertanyaan (subcriteriaName) dan nama tim (teamName)
				const filteredPoint = this.pointByUser.find(
					(point) =>
						point.subscriteriaName === subcriteriaName &&
						point.teamName === teamName
				);

				// Jika data ditemukan, kembalikan nilai poin, jika tidak, kembalikan 0 atau nilai default lainnya
				return filteredPoint ? filteredPoint.point : 0;
			},
			getTotalPointByTeam(teamName) {
				// Filter respons pointByUser berdasarkan nama tim (teamName)
				const filteredPoints = this.pointByUser.filter(
					(point) => point.teamName === teamName
				);

				// Menghitung total nilai berdasarkan nama tim
				const total = filteredPoints.reduce(
					(acc, currentPoint) => acc + currentPoint.point,
					0
				);

				// Kembalikan nilai total
				return total;
			},
			saveData() {
				if (confirm("Save Points?")) {
					const sendData = this.questionData.map((quest, index) => ({
						subscriteriaName: quest.subscriteriaName,
						teamName: this.selectedTeam,
						username: this.tokenUser.user,
						point: this.pointData[index],
						createdAt: null,
					}));

					const invalidIndex = this.questionData.findIndex((quest, index) => {
						return (
							this.pointData[index] < 0 ||
							this.pointData[index] > quest.maxPoint
						);
					});

					if (invalidIndex !== -1) {
						const invalidColumnName =
							this.questionData[invalidIndex].subscriteriaName;
						alert(
							`Pastikan Pointnya tidak melebihi Max Point \nPoint ${invalidColumnName}`
						);
						return; // Menghentikan proses penyimpanan jika ada nilai yang tidak valid
					}

					this.$axios
						.post("/savePoint", sendData)
						.then((response) => {
							console.log("Data disimpan!", response.data);
							alert("Points Data Saved");

							this.selectedTeam = "";
							this.pointData = [];
							this.totalPoint = 0;
						})
						.catch((error) => {
							console.error("Data gagal disimpan!", error);
							alert("Fail Save Data Points ");
						});
				}
			},

			toggleTable() {
				this.showTable = !this.showTable;

				this.btnHistory = this.showTable ? "Back" : "History";

				if (this.showTable) {
					this.getPointByUsername();
				}
			},
			async getQuestion() {
				try {
					const response = await this.$axios.get("/question");
					this.questionData = response.data;
					console.log(this.questionData);
				} catch (error) {
					console.error("Error fetching Question data:", error);
				}
			},

			async getTeamsAll() {
				try {
					const response = await this.$axios.get("/teams/all");
					this.teamData = response.data;
				} catch (error) {
					console.error("Error fetching Teams data:", error);
				}
			},
			async getPointByUsername() {
				try {
					const username = this.tokenUser.user;
					const response = await this.$axios.get(`/point?username=${username}`);
					this.pointByUser = response.data;
					console.log(this.pointByUser);
				} catch (error) {
					console.error("Error fetching point data by username:", error);
					// Tambahkan pesan kesalahan yang lebih spesifik atau tambahkan penanganan kesalahan yang lebih detail di sini
				}
			},
		},

		created() {
			try {
				const userData = JSON.parse(localStorage.getItem("userData"));
				if (userData) {
					this.tokenUser.user = userData.username;
					this.tokenUser.role = userData.role;
					this.tokenUser.nip = userData.nip;
					console.log(this.tokenUser.user); // pastikan nilai ini tidak null
				} else {
					console.error("userData is null or undefined");
				}
			} catch (error) {
				console.error("Error retrieving userData from localStorage:", error);
			}

			this.getQuestion();
			this.getTeamsAll();
			this.getPointByUsername();
		},
	};
</script>

<style scoped></style>
