import { createApp } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AppVue from "./App.vue";
import HelloWorldVue from "./components/HelloWorld.vue";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/home",
			component: HelloWorldVue,
		},
	] as RouteRecordRaw[],
});

const app = createApp(AppVue);

app.use(router);

app.mount("#app");
