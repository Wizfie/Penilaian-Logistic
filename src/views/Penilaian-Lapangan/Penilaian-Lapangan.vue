<template>
	<div>
		<Header />

		<main id="main" class="main">
			<div class="pagetitle">
				<h1 class="my-4 fs-1">Penilaian Lapangan</h1>
			</div>

			<section>
				<div>
					<div class="card">
						<div class="card-body d-flex justify-content-between">
							<strong>
								Hello, <span>{{ tokenUser.user }}</span>
							</strong>
							<router-link to="/history-lapangan" class="btn btn-success"
								>History</router-link
							>
						</div>
					</div>

					<form @submit.prevent="savePoint" action="">
						<div class="input-group mb-3">
							<label class="input-group-text" for="teams-select"
								>Pilih Team</label
							>
							<select
								class="form-select"
								id="teams-select"
								required
								v-model="selectedTeam"
							>
								<option disabled selected>List Teams</option>
								<option v-for="team in teamList" :value="team.name">
									{{ team.name }}
								</option>
							</select>
						</div>
						<template v-for="(criteria, index) in questions" :key="index">
							<div class="card">
								<div class="card-header">{{ criteria.name }}</div>
								<div class="card-body">
									<template
										v-for="(subCriteria, subIndex) in criteria.subCriteria"
										:key="subIndex"
									>
										<p class="card-text fw-bold mb-3 mt-3">
											{{ subCriteria.name }}
										</p>
										<div class="card-footer mt-3">
											<template
												v-for="(
													question, questionIndex
												) in subCriteria.questions"
												:key="question.id"
											>
												<p class="card-text mb-3">
													{{ questionIndex + 1 }}.
													{{ question.question }}
												</p>
												<div
													class="form-check form-check-inline"
													v-for="(option, optionIndex) in question.options"
													:key="optionIndex"
												>
													<input
														class="form-check-input mb-3"
														type="radio"
														:id="
															'exampleRadios' +
															index +
															subIndex +
															questionIndex +
															optionIndex
														"
														:name="
															'questionRadios' +
															index +
															subIndex +
															questionIndex
														"
														:value="{
															questionId: question.id,
															optionValue: option,
														}"
														v-model="selectedValues[question.id]"
													/>
													<label
														class="form-check-label mb-3"
														:for="
															'exampleRadios' +
															index +
															subIndex +
															questionIndex +
															optionIndex
														"
													>
														{{ option }}
													</label>
												</div>
											</template>
										</div>
									</template>
								</div>
							</div>
						</template>
						<button class="btn btn-primary w-100">Submit</button>
					</form>
				</div>
			</section>
			<!-- End Page Title -->
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
				teamList: [],
				questions: [],
				selectedValues: [],
				tokenUser: {
					user: null,
					nip: null,
					role: null,
				},
			};
		},
		methods: {
			async savePoint() {
				if (confirm("save nilai?")) {
					try {
						const data = [];

						for (const questionId in this.selectedValues) {
							if (Object.hasOwnProperty.call(this.selectedValues, questionId)) {
								const selectedValue = this.selectedValues[questionId];
								console.log(selectedValue);

								data.push({
									questionId: questionId,
									nilai: parseFloat(
										selectedValue.optionValue.replace(",", ".")
									),
									username: this.tokenUser.user,
									teamName: this.selectedTeam,
									// timestamp: new Date().toISOString().slice(0, 10), // Format tanggal "YYYY-MM-DD"
									timestamp: null, // Format tanggal "YYYY-MM-DD"
									nip: this.tokenUser.nip,
								});
							}
						}

						console.log("=========");
						console.log(
							"🚀 ~ file: Penilaian-Lapangan.vue:158 ~ savePoint ~ data:",
							data
						);

						const response = await this.axios.post("/save-nilai", data);
						console.log("Data successfully sent: ", response.data);
						alert("saved data");
						this.selectedValues = [];
						scrollTo(0, 0);

						// Tambahkan logika atau tindakan setelah pengiriman berhasil jika diperlukan
					} catch (error) {
						console.error("Failed to send data: ", error);
						alert("fail saved");
						// Handle error, tampilkan pesan kesalahan, dll.
					}
				}
			},
			getQuestion() {
				try {
					this.axios.get("/kriteria/all").then((response) => {
						this.questions = response.data;
						console.log(response.data);
					});
				} catch (error) {
					console.error("Fail get Question :  ", error);
				}
			},
			getAllTeam() {
				try {
					this.axios.get("/teams-all").then((response) => {
						this.teamList = response.data;
						console.log(this.teamList);
					});
				} catch (error) {
					console.error("Error fetching Team data:", error);
				}
			},
		},
		created() {
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData) {
				this.tokenUser.user = userData.username;
				this.tokenUser.nip = userData.nip;
				this.tokenUser.role = userData.role;

				this.getQuestion();
				this.getAllTeam();
			}
		},
	};
</script>
<style></style>
