<template>
	<div>
		<Header />

		<main id="main" class="main">
			<div class="pagetitle">
				<h1 class="my-4 fs-1">Penilaian Yel-yel</h1>
			</div>
			<div class="card">
				<div class="card-header">
					<div class="d-flex justify-content-between">
						<h4>History</h4>
					</div>

					<hr />

					<form @submit.prevent="search(0)">
						<div>
							<label for="keyword">Search:</label>
							<input
								class="form-control w-auto"
								type="text"
								id="keyword"
								placeholder="Username / Team Name"
								v-model="searchKeyword"
							/>
						</div>

						<div class="d-flex my-2">
							<div>
								<label for="startDate">Tanggal Awal:</label>
								<input
									class="form-control w-auto"
									type="date"
									id="startDate"
									v-model="startDate"
								/>
							</div>

							<div>
								<label for="endDate">Tanggal Akhir:</label>
								<input
									class="form-control w-auto"
									type="date"
									id="endDate"
									v-model="endDate"
								/>
							</div>
						</div>
						<button class="btn btn-primary my-2" type="submit">Cari</button>
						<button class="btn btn-warning ms-1" @click="refreshData">
							<i class="bi bi-arrow-clockwise"></i>
						</button>
					</form>
				</div>
				<div class="p-3">
					<div class="export">
						<label class="mb-2">Select User</label>
						<div class="d-flex gap-2 col-lg-6 col">
							<select
								class="form-control"
								name="user"
								id="user"
								v-model="selectedUser"
							>
								<option value="" disabled selected>Users</option>
								<option v-for="item in teams" :key="item">{{ item }}</option>
							</select>

							<input class="form-control" type="date" v-model="selectedDate" />
							<button class="btn btn-success" @click.prevent="exportToExcel">
								Export
							</button>
						</div>
					</div>
				</div>
			</div>

			<div>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>No</th>
							<th>Team Name</th>
							<th>Score</th>
							<th>CreatedBy</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						<!-- Gunakan v-for untuk menampilkan data skor tim -->
						<tr v-for="(result, index) in searchResults.content" :key="index">
							<td>{{ index + 1 }}</td>
							<td>{{ result.teamName }}</td>
							<td>{{ result.totalPoints }}</td>
							<td>{{ result.username }} - [ {{ result.nip }} ]</td>
							<td>{{ result.createdAt }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<nav aria-label="Page navigation" v-if="searchResults.totalPages > 0">
				<!-- Penempatan pagination code di sini -->
				<ul class="pagination justify-content-center">
					<li
						class="page-item"
						:class="{ disabled: searchResults.number === 0 }"
					>
						<button class="page-link" @click="prevPage">Previous</button>
					</li>

					<li
						v-for="page in searchResults.totalPages"
						:key="page"
						class="page-item"
						:class="{ active: searchResults.number === page - 1 }"
					>
						<button class="page-link" @click="gotoPage(page - 1)">
							{{ page }}
						</button>
					</li>

					<li
						class="page-item"
						:class="{
							disabled: searchResults.number === searchResults.totalPages - 1,
						}"
					>
						<button class="page-link" @click="nextPage">Next</button>
					</li>
				</ul>
			</nav>

			<!-- Tampilkan pesan jika tidak ada data -->
			<div v-else>
				<p class="text-center">No data available.</p>
			</div>

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
				searchResults: {
					content: [],
					totalPages: 0,
					number: 0,
				},
				searchKeyword: "",
				startDate: null,
				endDate: null,
				requestData: {
					user: null,
					team: null,
				},
				searchQuery: "",
				selectedUser: "",
				selectedDate: "",
				teamScores: [],
				teams: [],
			};
		},
		methods: {
			getUsers() {
				try {
					this.axios
						.get("/point/all")
						.then((response) => {
							const uniqueUsers = new Set();
							response.data.forEach((item) => {
								const userKey = `${item.username} - [${item.nip}]`;
								uniqueUsers.add(userKey);
							});
							this.teams = Array.from(uniqueUsers);
							console.log(this.teams);
						})
						.catch((error) => {
							console.error("Error fetching users:", error);
						});
				} catch (error) {
					console.error("Error in getUsers:", error);
				}
			},
			async search(page = 0) {
				try {
					const response = await this.axios.get("/pointsYelyel", {
						params: {
							usernameOrTeamName: this.searchKeyword,
							startDate: this.startDate,
							endDate: this.endDate,
							page: page, // Gunakan nomor halaman yang diteruskan sebagai parameter
							size: 10,
						},
					});
					this.searchResults = response.data;
					console.log("Data dari backend:", this.searchResults);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			},

			// Metode pagination diperbarui
			prevPage() {
				if (this.searchResults.number > 0) {
					this.search(this.searchResults.number - 1);
				}
			},

			nextPage() {
				if (this.searchResults.number < this.searchResults.totalPages - 1) {
					this.search(this.searchResults.number + 1);
				}
			},

			gotoPage(page) {
				this.search(page);
			},

			async refreshData() {
				try {
					this.searchKeyword = ""; // Mengosongkan input pencarian
					this.startDate = null; // Mengatur ulang tanggal awal
					this.endDate = null; // Mengatur ulang tanggal akhir
					this.searchResults = {
						// Mengatur ulang hasil pencarian
						content: [],
						totalPages: 0,
						number: 0,
					};
				} catch (error) {
					console.error(error);
				}
			},

			exportToExcel() {
				const [selectedUsername, selectedNip] = this.selectedUser.split(" - [");
				const nip = selectedNip ? selectedNip.slice(0, -1) : null; // Mengambil nip dari selectedUser jika ada
				const penilai = selectedUsername
					? `${selectedUsername} / ${nip}`
					: null; // Menggabungkan username dan nip jika ada

				if (!penilai || !this.selectedDate) {
					alert("Silakan pilih Users dan tanggal sebelum mengekspor data.");
					return; // Berhenti dari eksekusi jika pengguna dan tanggal belum dipilih
				}

				this.axios
					.get("/export-yelyel", {
						params: {
							nip: nip,
							penilai: penilai,
							createdAt: this.selectedDate,
						},
						responseType: "blob",
					})
					.then((response) => {
						const blob = new Blob([response.data], {
							type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						});

						const url = window.URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute(
							"download",
							`${selectedUsername}-${nip}-${this.selectedDate}-score-Yelyel.xlsx`
						);

						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link); // Hapus link setelah di-klik
					})
					.catch((error) => {
						console.error("Error exporting to Excel:", error);
						if (error.response.status === 404) {
							alert("Data tidak tersedia");
						}
					});
			},
		},

		updateSelectedUser(event) {
			this.selectedUser = event.target.value;
		},

		mounted() {
			this.getUsers();
			this.search();
		},
		created() {
			const userData = JSON.parse(localStorage.getItem("userData"));
			if (userData) {
				this.requestData.user = userData.username;
			}
		},
	};
</script>
<style></style>
