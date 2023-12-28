<template lang="">
	<div>
		<Header></Header>
		<div class="main" id="main">
			<div class="pagetitle mb-4">
				<h1>Penilaian Yel-Yel</h1>
			</div>

			<Section>
				<div class="card-body mb-3">
					<div class="card-header d-flex justify-content-between">
						<p class="fw-bold">History</p>
						<button class="btn btn-secondary" @click="$router.back()">
							Back
						</button>
					</div>
					<div class="card-body">
						<Label class="form-label fw-semibold">Filter By Date</Label>

						<div class="d-flex gap-1 col-lg-6 col-12">
							<input type="date" v-model="startDate" class="form-control" />

							<input type="date" v-model="endDate" class="form-control" />
							<button @click.prevent="btnReset()" class="btn btn-warning">
								<i class="bi bi-arrow-clockwise"></i>
							</button>
						</div>
					</div>
				</div>

				<div class="table table-responsive">
					<table class="table table-striped-columns">
						<thead>
							<tr>
								<th>No</th>
								<th>Team</th>
								<th>Score</th>
								<th>Date</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(team, index) in teams" :key="index">
								<td>{{ index + 1 }}</td>
								<td>{{ team.teamName }}</td>
								<td>{{ team.totalNilai }}</td>
								<td class="fw-bold">{{ team.totalNilai }}</td>
								<td>{{ team.createdAt }}</td>
								<td>
									<router-link
										:to="`/details-yelyel/${team.nip}/${team.teamName}/${team.createdAt}`"
										class="btn btn-primary"
									>
										View
									</router-link>
								</td>
							</tr>
							<tr class="text-center" v-if="teams.length === 0">
								<td colspan="4">No data</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Section>
		</div>
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
				startDate: "",
				endDate: "",
				pointList: [],
				tokenUser: {
					user: null,
					nip: null,
					role: null,
				},
			};
		},
		methods: {
			btnReset() {
				(this.startDate = ""), (this.endDate = "");
			},
			getPointByNip() {
				try {
					const nip = this.tokenUser.nip;
					this.axios.get(`/point?nip=` + nip).then((response) => {
						this.pointList = response.data;
						console.log(response.data);
					});
				} catch (error) {
					console.log(
						"🚀 ~ file: History-Yelyel.vue:60 ~ getPointByNip ~ error:",
						error
					);
				}
			},
		},
		computed: {
			teams() {
				const filteredData = this.pointList.filter((item) => {
					if (this.startDate && this.endDate) {
						const start = new Date(this.startDate);
						const end = new Date(this.endDate);
						const itemDate = new Date(item.createdAt);
						return itemDate >= start && itemDate <= end;
					}
					return true; // Return true by default if no date filters applied
				});

				const groupedData = filteredData.reduce((result, item) => {
					const key = `${item.teamName}_${item.createdAt}`;
					if (!result[key]) {
						result[key] = {
							nip: item.nip,
							teamName: item.teamName,
							createdAt: item.createdAt,
							totalNilai: 0,
							entries: [],
						};
					}
					result[key].entries.push({
						nip: item.nip,
						point: parseFloat(item.point.toFixed(2)),
					});
					result[key].totalNilai += item.point;
					return result;
				}, {});

				const teamsArray = Object.values(groupedData).sort((a, b) => {
					return new Date(b.createdAt) - new Date(a.createdAt);
				});

				return teamsArray;
			},
		},

		created() {
			try {
				const userData = JSON.parse(localStorage.getItem("userData"));
				if (userData) {
					this.tokenUser.user = userData.username;
					this.tokenUser.role = userData.role;
					this.tokenUser.nip = userData.nip;
				} else {
					console.error("userData is null or undefined");
				}
			} catch (error) {
				console.error("Error retrieving userData from localStorage:", error);
			}

			this.getPointByNip();
		},
	};
</script>
<style lang=""></style>
