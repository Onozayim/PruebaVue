<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { TaskType } from "../types/TaskType";
import Task from "./Task.vue";
const bool = true;

export default defineComponent({
	components: {
		Task,
	},

	data(): {
		list: Array<TaskType>;
		newTask: TaskType;
		showTasks: boolean;
		url: string;
	} {
		return {
			list: [],
			newTask: {
				created_at: "",
				completed: 0,
				description: "",
				id: 0,
				name: "",
			},
			showTasks: false,
			url: "http://localhost/prueba/task.php",
		};
	},

	methods: {
		async add() {
			const res = await fetch(this.url, {
				method: "POST",
				body: JSON.stringify({
					name: this.newTask.name,
					description: this.newTask.description,
					created_at: this.newTask.created_at,
				}),
			});

			const json = await res.json();

			if (res.status == 400) {
				alert(json.error);
				return;
			}
			this.list.push(json);

			this.newTask.created_at = "";
			this.newTask.completed = 0;
			this.newTask.description = "";
			this.newTask.id = 0;
			this.newTask.name = "";
		},

		async deleteTask(task: TaskType) {
			const res = await fetch(this.url, {
				method: "DELETE",
				body: JSON.stringify({
					id: task.id,
				}),
			});

			const json = await res.json();

			if (res.status == 400) {
				alert(json.error);
				return;
			}

			this.list = this.list.filter((item) => {
				return item.id != json.id;
			});
		},

		async updateTask(newTask: TaskType) {
			let newTasks: Array<TaskType> = [];

			const res = await fetch(this.url, {
				method: "PUT",
				body: JSON.stringify(newTask),
			});

			const json = await res.json();

			if (res.status == 400) {
				alert(json.error);
				return;
			}

			this.list.map((item) => {
				if (newTask.id == item.id) newTasks.push(json);
				else newTasks.push(item);
			});

			this.list = newTasks;
		},

		async completeTask(newTask: TaskType) {
			const res = await fetch("http://localhost/prueba/completeTask.php", {
				method: "PUT",
				body: JSON.stringify(newTask),
			});

			this.list.map((item) => {
				if (item.id == newTask.id) {
					if (item.completed == 0) item.completed = 1;
					else item.completed = 0;
				}
			});
		},
	},

	mounted() {
		const fetchData = async () => {
			const res = await fetch(this.url, {
				method: "GET",
			});

			if (res.status != 200) {
				return;
			}

			this.list = await res.json();
			this.showTasks = true;
		};

		fetchData();
	},

	created() {
		if (!bool) {
			window.location.href = "/login";
			return;
		}
	},
});
</script>

<template>
	<div class="container">
		<div style="width: 30%">
			<form class="taskForm" v-on:submit.prevent="add">
				<label for="">Nombre</label>
				<input type="text" v-model="newTask.name" />
				<label for="">Descripcion</label>
				<input type="text" v-model="newTask.description" />
				<label for="">Fecha</label>
				<input type="date" v-model="newTask.created_at" />
				<button type="submit">AGREGAR</button>
			</form>
		</div>
		<div style="width: 70%">
			<Task
				v-if="showTasks"
				:tasksToShow="list"
				@delete-task="deleteTask"
				@update-task="updateTask"
				@complete-task="completeTask"
			/>
			<h1 v-else>CARGANDO</h1>
		</div>
	</div>
</template>

<style lang="scss">
@import "../assets/styles.scss";

.container {
	display: flex;
	justify-content: space-between;
	width: 90%;
	margin: auto;
}

.taskForm {
	background-color: $white;
	width: fit-content;
	padding: 20px;
	border: black solid 2px;
	position: fixed;
	top: 50%;
	transform: translate(0, -50%);
}

.taskForm input {
	display: block;
	width: 300px;
	height: 25px;
}

.taskForm input:focus {
	outline: none;
}

.taskForm label {
	color: black;
	display: block;
	margin-bottom: 5px;
	margin-top: 5px;
	font-weight: 550;
}

.taskForm button {
	width: 308px;
	border: none;
	background-color: $header;
	margin-top: 5px;
	font-size: 15px;
	color: rgb(10, 10, 10);
	font-weight: 550;
	height: 30px;
}
</style>
