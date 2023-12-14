import { createRouter, createWebHistory } from "vue-router";
import login from "./views/Auth/Login.vue";
import register from "./views/Auth/Register.vue";
import dashboard from "./views/Dashboard.vue";
import penilaianLapangan from "./views/Penilaian-Lapangan/Penilaian-Lapangan.vue";
import historyLapangan from "./views/Penilaian-Lapangan/History-Lapangan.vue";
import detailNilai from "./views/Penilaian-Lapangan/Edit-Nilai.vue";
import penilaianYelyel from "./views/Penilaian-Yelyel/Home-Yelyel.vue";
import homePresentasi from "./views/Presentasi/Home-Presentasi.vue";
import detailPresentasi from "./views/Presentasi/Details-Presentasi.vue";
import notFound from "./components/NotFound.vue";

// Admin
import adminLapangan from "./views/Admin/History-Lapangan-admin.vue";
import adminYelyel from "./views/Admin/History-Yelyel-admin.vue";
// admin
const routes = [
	{
		path: "/",
		component: login,
	},
	{
		path: "/register",
		component: register,
	},
	{
		path: "/dashboard",
		component: dashboard,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/history-lapangan",
		component: historyLapangan,
		beforeEnter: checkAuthorization,
	},t
	{
		path: "/penilaian-lapangan",
		component: penilaianLapangan,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/penilaian-yelyel",
		component: penilaianYelyel,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/detail/:teamName/:timestamp",
		component: detailNilai,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/history-lapangan-admin",
		component: adminLapangan,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/history-yelyel-admin",
		component: adminYelyel,
		beforeEnter: checkAuthorization,
	},

	{
		path: "/presentasi",
		component: homePresentasi,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/presentasi/detail-presentasi",
		component: detailPresentasi,
		beforeEnter: checkAuthorization,
	},
	{
		path: "/:catchAll(.*)",
		component: notFound,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

function checkAuthorization(to, from, next) {
	if (localStorage.getItem("userData")) {
		next();
	} else {
		next("/");
	}
}

export default router;
