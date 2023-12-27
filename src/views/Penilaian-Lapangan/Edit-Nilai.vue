<template>
	<div>
		<Header />
		<main id="main" class="main">
			<section class="section">
				<div class="row">
					<div class="col-lg-12">
						<div class="card">
							<div class="card-body">
								<div class="d-flex justify-content-between p-2">
									<h5 class="card-title fw-bold">Detail Nilai</h5>
									<button
										@click="this.$router.back()"
										class="btn btn-secondary m-2"
									>
										Back
									</button>
								</div>

								<!-- Form  -->
								<div class="table-responsive">
									<table class="table-bordered align-content-center">
										<thead>
											<tr>
												<th class="text-center" scope="col">#</th>
												<th class="text-center" scope="col">Question</th>
												<th class="text-center p-3" scope="col">Nilai</th>
												<!-- <th class="text-center" scope="col">Max</th> -->
											</tr>
										</thead>
										<tbody>
											<tr
												v-for="(item, index) in nilaiList.filter(
													(list) =>
														list.formattedTimestamp === timestamp &&
														list.teamName === teamName
												)"
												:key="index"
											>
												<th class="text-center p-2" scope="row">
													{{ index + 1 }}
												</th>
												<td class="text-wrap fw-semibold p-2">
													{{ item.questionText }}.
													<br />
													<small> Max Point = {{ item.maxValue }} </small>
												</td>
												<td class="p-2">
													<input
														:id="'nilaiInput_' + item.nilaiId"
														type="number"
														class="form-control text-center w-100 fw-bold p-2"
														v-model="item.nilai"
														@input="TotalNilai"
														:disabled="!updateMode"
														required
													/>
												</td>
												<!-- <td class="text-center">
													{{ item.maxValue }}
												</td> -->
											</tr>
											<tr>
												<td class="text-center fw-bold" colspan="2">
													Total Nilai
												</td>
												<td class="fw-bolder text-center">{{ totalNilai }}</td>
												<!-- <td class="text-center">-</td> -->
											</tr>
										</tbody>
									</table>
								</div>
								<div class="d-flex my-2 gap-3 w-100">
									<!-- <button type="button" class="btn btn-danger w-100">
											Cancel
										</button> -->
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
										@click="cancelUpdate"
										type="button"
										class="btn btn-danger w-100"
									>
										Cancel
									</button>
									<button
										v-if="updateMode"
										@click.prevent="updateNilai"
										class="btn btn-primary w-100"
									>
										Submit
									</button>
								</div>
								<!-- End Form -->
							</div>
						</div>
					</div>
				</div>
			</section>
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
				timestamp: this.$route.params.timestamp,
				teamName: this.$route.params.teamName,
				user: null,
				nilaiList: [],
				totalNilai: null,
				updateMode: false,
			};
		},

		methods: {
			enableUpdate() {
				this.updateMode = true;
			},
			cancelUpdate() {
				this.updateMode = false;
			},
			getNilaiByUser() {
				try {
					this.axios
						.get("/nilai-list?username=" + this.user)
						.then((response) => {
							this.nilaiList = response.data;
							console.log(this.nilaiList);
							this.filterNilaiList(); // Call the new method to filter the list
							this.TotalNilai();
						});
				} catch (error) {
					console.error("Error fetching nilai data:", error);
				}
			},

			filterNilaiList() {
				// Filter nilaiList based on both timestamp and team name
				this.nilaiList = this.nilaiList.filter(
					(item) =>
						item.formattedTimestamp === this.timestamp &&
						item.teamName === this.teamName
				);
			},
			updateNilai() {
				for (const item of this.nilaiList.filter(
					(item) => item.formattedTimestamp === this.timestamp
				)) {
					const nilai = parseFloat(item.nilai || 0); // Mengganti koma dengan titik dan mengonversi ke float
					const maxValue = parseFloat(item.maxValue);

					if (
						isNaN(nilai) ||
						isNaN(maxValue) ||
						nilai < 0 ||
						nilai > maxValue
					) {
						alert(
							"Nilai tidak valid untuk pertanyaan nomor: " +
								item.questionId +
								"\n\nPastikan Nilai Berupa Angka dan tidak melebihi nilai maksimal"
						);
						return;
					}
				}
				const updatedValues = [];

				for (const item of this.nilaiList) {
					updatedValues.push({
						nilaiId: item.nilaiId,
						nilai: item.nilai,
					});
				}

				this.axios
					.put("/update-nilai", updatedValues)
					.then((response) => {
						console.log(response.data);
						console.log("Data updated successfully");
						alert("Data updated successfully");
						this.updateMode = false;
						this.$router.back();
					})
					.catch((error) => {
						console.error("Error updating data:", error);
						alert("Error updating data:", error);
					});
			},

			TotalNilai() {
				const filteredNilaiList = this.nilaiList.filter(
					(item) => item.formattedTimestamp === this.timestamp
				);
				// Cek apakah semua nilai adalah angka
				const allAreNumbers = filteredNilaiList.every(
					(item) => !isNaN(parseFloat(item.nilai))
				);

				if (!allAreNumbers) {
					// Jika ada nilai yang bukan angka, tampilkan pesan error
					this.totalNilai = "Error";
				} else {
					// Jika semua nilai adalah angka, hitung totalnya
					const total = filteredNilaiList.reduce(
						(acc, item) => acc + parseFloat(item.nilai || 0),
						0
					);

					this.totalNilai = total.toFixed(2);
				}
			},
			getAllChoice() {
				try {
					this.axios.get("/choiceAll").then((response) => {
						this.choiceList = response.data;
						//   console.log(this.choiceList);
					});
				} catch (error) {
					console.error("Error fetching choice data:", error);
				}
			},
		},

		created() {
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData) {
				this.user = userData.username;
			}
			this.TotalNilai();
		},

		mounted() {
			this.getNilaiByUser();
		},
	};
</script>

<style>
	/* CSS styles go here */
</style>
