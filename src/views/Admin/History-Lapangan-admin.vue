<template>
	<div>
		<Header></Header>

		<main id="main" class="main">
			<div class="pagetitle">
				<h1 class="fs-3">Penilaian Lapangan Admin</h1>
			</div>
			<!-- End Page Title -->
			<div class="card-body">
				<label class="form-label fw-semibold">Filter By Date</label>

				<div class="d-flex gap-1 col-lg-6 col-12">
					<input type="date" v-model="startDate" class="form-control" />

					<input type="date" v-model="endDate" class="form-control" />
				</div>

				<hr style="height: 2px" />
				<label class="form-label fw-semibold" for="">Export Excel</label>
			</div>

			<label for="user-nip">Select User:</label>
			<div class="d-flex gap-1 col-lg-6 col-12">
				<select
					class="form-control"
					v-model="selectedUserNIP"
					placeholder="Select User"
					name="user-nip"
					id="user-nip"
					required
				>
					<option
						v-for="(user, index) in usersWithNIP"
						:key="index"
						:value="user.nip"
					>
						{{ user.username }} - [ {{ user.nip }} ]
					</option>
				</select>

				<input type="date" v-model="exportDate" class="form-control" required />
				<button class="btn btn-success" @click="exportToExcel">Export</button>
			</div>

			<table class="table table-group-divider mt-3">
				<thead>
					<tr>
						<th>NO</th>
						<th>Team</th>
						<th>Score</th>
						<th>CreatedBy</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(nilai, index) in groupedData" :key="index">
						<td>{{ index + 1 }}</td>
						<td>{{ nilai.teamName }}</td>
						<td>{{ nilai.totalNilai }}</td>
						<td>{{ nilai.username }} - [ {{ nilai.nip }} ]</td>
						<td>{{ nilai.timestamp }}</td>
					</tr>
				</tbody>
			</table>
		</main>
	</div>
</template>

<script>
	import { Alert } from "bootstrap";
	import Header from "../../components/Header.vue";
	import ExcelJS from "exceljs";

	export default {
		components: {
			Header,
		},

		data() {
			return {
				nilaiLapangan: [],
				usersWithNIP: [],
				selectedUserNIP: null,
				exportDate: null,
				startDate: null,
				endDate: null,
				groupedData: [],
				tokenUser: {
					user: null,
					nip: null,
					role: null,
				},
			};
		},

		methods: {
			async exportToExcel() {
				if (!this.selectedUserNIP || !this.exportDate) {
					alert("Pilih pengguna dan tanggal sebelum melakukan export.");
					return;
				}

				const selectedUserNIP = this.selectedUserNIP;
				const exportDate = new Date(this.exportDate);
				const endDate = new Date(this.exportDate);
				endDate.setDate(endDate.getDate() + 1);

				const exportData = this.nilaiLapangan.filter(
					(item) =>
						item.nip === selectedUserNIP &&
						new Date(item.timestamp) >= exportDate &&
						new Date(item.timestamp) < endDate
				);

				const uniqueQuestions = Array.from(
					new Set(exportData.map((item) => item.questionText))
				);
				const uniqueTeams = Array.from(
					new Set(exportData.map((item) => item.teamName))
				);

				const teamScores = {};
				// Loop untuk mengisi nilai-nilai tim untuk setiap pertanyaan
				uniqueQuestions.forEach((question) => {
					const questionScores = {};
					uniqueTeams.forEach((team) => {
						const filteredData = exportData.find(
							(item) => item.questionText === question && item.teamName === team
						);
						if (filteredData) {
							questionScores[team] = filteredData.nilai;
						} else {
							questionScores[team] = "NaN";
						}
					});
					teamScores[question] = questionScores;
				});

				const workbook = new ExcelJS.Workbook();
				const worksheet = workbook.addWorksheet("Exported Data");

				const user = this.usersWithNIP.find(
					(user) => user.nip === selectedUserNIP
				);
				const exportedAt = new Date().toLocaleString();

				// Membuat informasi yang diminta
				const userInfo = [
					[`Nama : ${user.username}`],
					[`Nip : ${selectedUserNIP}`],
					[`Tanggal Penilaian ${exportDate.toLocaleString()}`],
					[`Tanggal Cetak ${exportedAt}`],
				];

				// Menambahkan informasi di atas tabel pada baris pertama
				userInfo.forEach((info) => {
					const row = worksheet.addRow(info);
					row.font = { bold: true }; // Membuat teks tebal untuk informasi pengguna
				});

				// Membuat spasi sebelum data tabel
				worksheet.addRow([]); // Baris kosong untuk pemisah

				// Membuat header
				const headerRow = ["No", "Question", ...uniqueTeams];
				const header = worksheet.addRow(headerRow);

				header.eachCell((cell, colNumber) => {
					cell.style = {
						alignment: { horizontal: "center" },
						font: { bold: true },
					};
					worksheet.getColumn(colNumber).width = Math.max(
						10,
						cell.value.toString().length + 2
					);
				});

				// Menuliskan data ke dalam file Excel
				let rowIndex = 2;
				const teamScoresArray = [];
				const totalNilaiPerTeam = {}; // Total nilai untuk setiap tim
				uniqueQuestions.forEach((question, index) => {
					const rowData = [index + 1, question];
					const totalNilaiPerQuestion = {}; // Total nilai untuk setiap pertanyaan
					uniqueTeams.forEach((team) => {
						const nilai = teamScores[question][team];
						rowData.push(nilai);

						// Mengakumulasi total nilai untuk setiap tim
						if (!totalNilaiPerTeam[team]) {
							totalNilaiPerTeam[team] = 0;
						}
						totalNilaiPerTeam[team] += isNaN(parseFloat(nilai))
							? 0
							: parseFloat(nilai);

						// Mengakumulasi total nilai untuk setiap pertanyaan
						if (!totalNilaiPerQuestion[team]) {
							totalNilaiPerQuestion[team] = 0;
						}
						totalNilaiPerQuestion[team] += isNaN(parseFloat(nilai))
							? 0
							: parseFloat(nilai);
					});

					teamScoresArray.push(totalNilaiPerQuestion);
					worksheet.addRow(rowData);
					rowIndex++;
				});

				// Menambahkan baris total nilai untuk setiap tim
				const totalNilaiRow = ["", "Total Nilai"];
				uniqueTeams.forEach((team) => {
					let totalNilai = 0;
					teamScoresArray.forEach((score) => {
						totalNilai += isNaN(parseFloat(score[team]))
							? 0
							: parseFloat(score[team]);
					});
					totalNilaiRow.push(totalNilai);
				});
				const grandTotal = worksheet.addRow(totalNilaiRow);
				grandTotal.font = { bold: true };
				// Menyimpan file Excel
				const buffer = await workbook.xlsx.writeBuffer();
				const blob = new Blob([buffer], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});

				const filename = `${user.username}-${user.nip}-Penilaian-Lapangan.xlsx`;
				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(blob, filename);
				} else {
					const a = document.createElement("a");
					document.body.appendChild(a);
					const url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = filename;
					a.click();
					window.URL.revokeObjectURL(url);
					document.body.removeChild(a);
				}
			},

			async getAllData() {
				try {
					const response = await this.axios.get("/nilai-lapangan");
					this.usersWithNIP = response.data.reduce((acc, item) => {
						const existingUser = acc.find(
							(user) => user.username === item.username && user.nip === item.nip
						);
						if (!existingUser) {
							acc.push({ username: item.username, nip: item.nip });
						}
						return acc;
					}, []);

					this.nilaiLapangan = response.data;
					console.log(
						"🚀 ~ file: History-Lapangan-admin.vue:195 ~ getAllData ~ nilaiLapangan:",
						this.nilaiLapangan
					);
				} catch (error) {
					console.log("Error:", error);
				}
			},
		},
		computed: {
			groupedData() {
				const grouped = this.nilaiLapangan.reduce((result, item) => {
					const key = `${item.nip}_${item.teamName}_${item.timestamp}`;
					if (!result[key]) {
						result[key] = {
							questionText: item.questionText,
							username: item.username,
							teamName: item.teamName,
							nip: item.nip,
							nilai: item.nilai,
							timestamp: item.timestamp,
							totalNilai: 0,
						};
					}
					result[key].totalNilai += item.nilai;
					return result;
				}, {});
				for (const key in grouped) {
					grouped[key].totalNilai = parseFloat(
						grouped[key].totalNilai.toFixed(2)
					);
				}

				const sortedData = Object.values(grouped).sort((a, b) => {
					return new Date(b.timestamp) - new Date(a.timestamp);
				});

				if (this.startDate && this.endDate) {
					const start = new Date(this.startDate);
					const end = new Date(this.endDate);

					return sortedData.filter((item) => {
						const itemDate = new Date(item.timestamp);
						return itemDate >= start && itemDate <= end;
					});
				} else {
					return sortedData;
				}
			},
		},
		created() {
			try {
				const userData = JSON.parse(localStorage.getItem("userData"));
				if (userData) {
					this.tokenUser.name = userData.username;
					this.tokenUser.nip = userData.nip;
					this.tokenUser.role = userData.role;
					this.getAllData();
				}
			} catch (error) {
				console.log("Error fetching userData:", error);
			}
		},
	};
</script>

<style lang=""></style>
