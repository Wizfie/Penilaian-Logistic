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
					<router-link to="/history-presentasi" class="btn btn-success">
						History
					</router-link>
				</div>
			</div>

			<form @submit.prevent="sendScore">
				<div class="input-group mb-3">
					<label class="input-group-text" for="teams-select">Pilih Team</label>
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

				<div v-for="(item, index) in questionData" :key="index">
					<div class="card p-1">
						<div class="card-header text-wrap fs-3 fw-bold">
							{{ item.title }}
						</div>
						<ol class="list-group list-group-flush">
							<li
								class="list-group-item fw-semibold"
								v-for="(point, pointIndex) in item.points"
								:key="pointIndex"
							>
								<strong>{{ pointIndex + 1 }}. </strong>{{ point.text }} <br />
								<strong>{{ "Point Max = " + point.maxValue }}</strong>
								<br />
							</li>
						</ol>
						<div class="card-footer">
							<input
								type="number"
								:id="'input-' + item.title + '-' + index"
								class="form-control"
								placeholder="Answer"
								v-model="score[item.title]"
								required
								@input="totalScoreInput()"
							/>
						</div>
					</div>
				</div>
				<div class="mb-2">
					<Strong>Total Score: {{ totalScore }}</Strong>
				</div>
				<button class="btn btn-primary w-100">Submit</button>
			</form>
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
				questionByTitle: {},
				selectedTeam: null,
				score: {},
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

			sendScore() {
				const evaluationData = [];

				for (const question of this.questionData) {
					const maxScore = question.maxScore;
					const title = question.title;

					const scoreValue = this.score[title] || 0;

					if (scoreValue < 0 || scoreValue > maxScore) {
						alert(
							`Invalid score for ${title}. Please enter a score between 0 and ${maxScore}.`
						);
						return; // Stop further processing if invalid score found
					}

					const limitedScore = Math.max(0, Math.min(scoreValue, maxScore));

					evaluationData.push({
						title: title,
						score: limitedScore,
						username: this.tokenUser.name,
						nip: this.tokenUser.nip,
						teamName: this.selectedTeam,
						maxScore: maxScore,
						createdAt: new Date().toISOString().slice(0, 10), // Format tanggal "YYYY-MM-DD"
					});
				}

				try {
					this.axios.post("/score/save", evaluationData).then((response) => {
						console.log(response.data);
						this.getByNip();
						alert("Score saved");

						for (const key in this.score) {
							this.score[key] = ""; // Mengatur nilai input ke string kosong ('')
						}

						this.totalScore = 0;
						window.scrollTo(0, 0);
					});
				} catch (error) {
					console.log("Failed to save score: " + error);
					alert("Failed to save score");
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
