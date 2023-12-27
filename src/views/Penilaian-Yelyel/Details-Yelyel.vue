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
										<th class="text-center">No</th>
										<th col-6 class="text-center">Question</th>
										<!-- Kolom untuk setiap tim -->
										<th class="text-center">{{ teamName }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(detail, index) in DetailsList" :key="index">
										<td class="text-center">{{ index + 1 }}</td>
										<td class="fs-5 text-wrap question-cell">
											{{ detail.subscriteriaName }}.
											<br />
											<small class="fw-semibold"
												>Max Point : {{ detail.maxPoint }}</small
											>
										</td>

										<td class="text-center">
											<input
												:disabled="!updateMode"
												type="number"
												min="0"
												class="fw-bold form-control text-center"
												v-model="detail.point"
											/>
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr class="fs-5 fw-bold text-center">
										<td colspan="2" class="text-center p-2">Total</td>
										<!-- Menghitung total poin untuk setiap tim -->
										<td>{{ totalPoints }}</td>
									</tr>
								</tfoot>
							</table>
						</div>
						<div class="d-flex gap-2">
							<button
								v-if="!updateMode"
								@click="enableUpdate"
								type="button"
								class="btn btn-primary w-100"
							>
								Update
							</button>
							<button
								v-else="cancelUpdate"
								@click.prevent="cancelUpdate"
								type="button"
								class="btn btn-danger w-100"
							>
								Cancel
							</button>
							<button
								v-if="updateMode"
								@click.prevent="collectAndSaveChanges"
								class="btn btn-primary w-100"
							>
								Save
							</button>
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
				teamName: this.$route.params.teamName,
				createdAt: this.$route.params.createdAt,
				updatedDetails: [],
				totalPoints: 0,
				DetailsList: [],
				updateMode: false,
				tokenUser: {
					nip: null,
					user: null,
					role: null,
				},
			};
		},

		methods: {
			enableUpdate() {
				this.updateMode = true;
			},
			cancelUpdate() {
				this.updateMode = false;
			},
			getDetails() {
				const nip = this.tokenUser.nip;
				const team = this.teamName;
				const date = this.createdAt;

				console.log(date);

				try {
					this.axios
						.get(`/details-yelyel/${nip}/${team}/${date}`)
						.then((response) => {
							this.DetailsList = response.data;
							console.log(response.data);
						});
				} catch (error) {
					console.log(
						"🚀 ~ file: Details-Yelyel.vue:122 ~ getDetails ~ error:",
						error
					);
				}
			},
			collectAndSaveChanges() {
				// Memeriksa apakah ada input yang kosong atau tidak valid sebelum menyimpan
				this.updatedDetails = [];
				for (const detail of this.DetailsList) {
					if (
						detail.point === "" ||
						detail.point === null ||
						isNaN(detail.point) ||
						detail.point > detail.maxPoint
					) {
						console.error("Invalid or empty input detected.");
						alert(
							`Harap isi poin dengan benar \nPada Question ${detail.subscriteriaName}.`
						);
						return; // Menghentikan proses penyimpanan jika ada input tidak valid
					}

					detail.isModified = true;
					this.updatedDetails.push({
						subscriteriaName: detail.subscriteriaName,
						point: detail.point,
						nip: detail.nip,
						teamName: detail.teamName,
						username: detail.username,
						createdAt: detail.createdAt,
					});
				}

				// Jika semua input valid, simpan perubahan ke backend
				this.saveChangesToBackend();
			},

			async saveChangesToBackend() {
				try {
					// Send the updated data to the backend
					await this.axios.post("/savePoint", this.updatedDetails);
					console.log("All changes saved successfully!");
					alert("Saved");
					this.$router.back();
				} catch (error) {
					console.error("Error saving changes:", error);
					alert("Fail");
				}
			},
		},

		computed: {
			totalPoints() {
				return this.DetailsList.reduce((total, detail) => {
					return total + (detail.point ? parseInt(detail.point) : 0);
				}, 0);
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

					this.getDetails();
				} else {
					console.error("userData is null or undefined");
				}
			} catch (error) {
				console.error("Error retrieving userData from localStorage:", error);
			}
		},
	};
</script>

<style scoped></style>
