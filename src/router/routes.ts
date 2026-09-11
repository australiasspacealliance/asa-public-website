import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: async () => import("layouts/HomeLayout.vue"),
		children: [
			{ path: "", component: async () => import("pages/HomePage.vue") },
			{ path: "roster", component: async () => import("pages/RosterPage.vue") },
		],
	},
	{
		path: "/:catchAll(.*)*",
		component: async () => import("pages/ErrorNotFound.vue"),
	},
];

export default routes;
