<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { TaskType, Option } from "../types/TaskType";

export default defineComponent({
	props: {
		tasksToShow: Array as () => Array<TaskType>,
	},

	data(): {
		taskToUpdate: number | null;
		newTaskInfo: TaskType;
		selected: String;
		options: Array<Option>;
	} {
		return {
			taskToUpdate: null,
			newTaskInfo: {
				created_at: "",
				completed: 0,
				description: "",
				id: 0,
				name: "",
			},
			selected: "A",
			options: [
				{ text: "Todas las tareas", value: "A" },
				{ text: "Tareas completadas", value: "B" },
				{ text: "Tares no completadas", value: "C" },
			],
		};
	},

	methods: {
		deleteTask(task: TaskType) {
			console.log(task.id);

			this.$emit("delete-task", task);
		},

		updateTask(task: TaskType) {
			this.taskToUpdate = task.id;
			this.resetTask(task);
		},

		resetTask(task: TaskType) {
			this.newTaskInfo = {
				created_at: task.created_at,
				completed: task.completed,
				description: task.description,
				id: task.id,
				name: task.name,
			};
		},

		submitHandler() {
			this.$emit("update-task", this.newTaskInfo);

			this.taskToUpdate = null;

			this.newTaskInfo = {
				created_at: "",
				completed: 0,
				description: "",
				id: 0,
				name: "",
			};
		},

		cancel(task: TaskType) {
			this.taskToUpdate = null;
			this.resetTask(task);
		},

		completeTask(task: TaskType) {
			this.$emit("complete-task", task);
		},

		onChangeHandler() {
			console.log(this.selected);
		},
	},

	emits: ["delete-task", "update-task", "complete-task"],
});
</script>

<template>
	<select
		v-model="selected"
		style="margin-bottom: 20px"
		@change="onChangeHandler"
		class="select"
	>
		<option
			v-for="option in options"
			v-bind:value="option.value"
			v-bind:key="option.value"
		>
			{{ option.text }}
		</option>
	</select>
	<div v-for="task in tasksToShow" :key="task.id">
		<div v-if="selected == 'A'">
			<div
				v-if="task.id != taskToUpdate"
				v-bind:class="[task.completed == 1 ? 'taskContainer' : 'taskNeg']"
			>
				<div v-bind:class="[task.completed == 1 ? 'taskName' : 'taskNameNeg']">
					<p class="title">{{ task.name }}</p>
					<p class="date">Entregar el: {{ task.created_at }}</p>
				</div>
				<div class="taskInfo">
					<p class="info">{{ task.description }}</p>
					<div>
						<button class="delete" @click="deleteTask(task)">BORRAR</button>
						<button class="update" @click="updateTask(task)">EDITAR</button>
						<button class="update" @click="completeTask(task)">
							{{ task.completed == 0 ? "COMPLETAR" : "CANCELAR" }}
						</button>
					</div>
				</div>
			</div>

			<div v-else>
				<div
					class="taskContainer"
					v-bind:class="[task.completed == 1 ? 'taskContainer' : 'taskNeg']"
				>
					<form @submit.prevent="submitHandler">
						<div
							v-bind:class="[task.completed == 1 ? 'taskName' : 'taskNameNeg']"
						>
							<input class="title" v-model="newTaskInfo.name" />
							<input
								class="date"
								v-model="newTaskInfo.created_at"
								type="date"
							/>
						</div>
						<div class="taskInfo">
							<input class="info" v-model="newTaskInfo.description" />
							<div>
								<button class="delete" type="button" @click="cancel(task)">
									CANCELAR
								</button>
								<button class="update" type="submit">GUARDAR</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

		<div v-else-if="selected == 'B'">
			<div v-if="task.completed == 1">
				<div
					v-if="task.id != taskToUpdate"
					v-bind:class="[task.completed == 1 ? 'taskContainer' : 'taskNeg']"
				>
					<div
						v-bind:class="[task.completed == 1 ? 'taskName' : 'taskNameNeg']"
					>
						<p class="title">{{ task.name }}</p>
						<p class="date">Entregar el: {{ task.created_at }}</p>
					</div>
					<div class="taskInfo">
						<p class="info">{{ task.description }}</p>
						<div>
							<button class="delete" @click="deleteTask(task)">BORRAR</button>
							<button class="update" @click="updateTask(task)">EDITAR</button>
							<button class="update" @click="completeTask(task)">
								CANCELAR
							</button>
						</div>
					</div>
				</div>

				<div v-else>
					<div class="taskContainer">
						<form @submit.prevent="submitHandler">
							<div class="taskName">
								<input class="title" v-model="newTaskInfo.name" />
								<input
									class="date"
									v-model="newTaskInfo.created_at"
									type="date"
								/>
							</div>
							<div class="taskInfo">
								<input class="info" v-model="newTaskInfo.description" />
								<div>
									<button class="delete" type="button" @click="cancel(task)">
										CANCELAR
									</button>
									<button class="update" type="submit">GUARDAR</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div v-else-if="selected == 'C'">
			<div v-if="task.completed == 0">
				<div v-if="task.id != taskToUpdate" class="taskNeg">
					<div class="taskNameNeg">
						<p class="title">{{ task.name }}</p>
						<p class="date">Entregar el: {{ task.created_at }}</p>
					</div>
					<div class="taskInfo">
						<p class="info">{{ task.description }}</p>
						<div>
							<button class="delete" @click="deleteTask(task)">BORRAR</button>
							<button class="update" @click="updateTask(task)">EDITAR</button>
							<button class="update" @click="completeTask(task)">
								COMPLETAR
							</button>
						</div>
					</div>
				</div>

				<div v-else>
					<div class="taskNeg">
						<form @submit.prevent="submitHandler">
							<div class="taskNameNeg">
								<input class="title" v-model="newTaskInfo.name" />
								<input
									class="date"
									v-model="newTaskInfo.created_at"
									type="date"
								/>
							</div>
							<div class="taskInfo">
								<input class="info" v-model="newTaskInfo.description" />
								<div>
									<button class="delete" type="button" @click="cancel(task)">
										CANCELAR
									</button>
									<button class="update" type="submit">GUARDAR</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "../assets/styles.scss";

.taskContainer {
	border: solid 2px $header;
}

.taskNeg {
	border: solid 2px $red;
}

.taskNeg,
.taskContainer {
	margin-bottom: 20px;
	background-color: $white;
	width: 95%;
}

.taskName,
.taskNameNeg {
	display: flex;
	justify-content: space-between;
	padding-left: 30px;
}

.taskNameNeg {
	border-bottom: solid 5px $red;
	background-color: $red;
}

.taskName {
	border-bottom: solid 5px $header;
	background-color: $header;
}

.title,
.date {
	font-size: 15px;
	color: rgb(10, 10, 10);
	font-weight: 550;
}

.date {
	margin-right: 10px;
}

.info {
	margin-left: 35px;
	font-size: 20px;
	color: $boldColor;
}

.taskInfo {
	padding: 10px;
	display: flex;
	justify-content: space-between;
}

.taskInfo button {
	margin-left: 10px;
	margin-top: 15px;
}

.delete,
.update {
	padding: 10px;
	color: white;
	border: none;
	border-radius: 8px;
}

.delete {
	background-color: $red;
}

.update {
	background-color: $blue;
}

input:focus {
	outline: none;
}

input {
	border-color: transparent;
	margin: 3px;
	padding: 2px;
	font-size: 15px;
	background-color: $input;
}

.select {
	margin: auto;
	margin-top: 30px;
	border: 1px black solid;
	color: black;
	font-size: 20px;
	padding: 2px 10px;
	width: 350px;
}

.select option {
	overflow: hidden;
	width: 350px;
	-moz-border-radius: 9px 9px 9px 9px;
	-webkit-border-radius: 9px 9px 9px 9px;
	border-radius: 9px 9px 9px 9px;
	box-shadow: 1px 1px 11px #330033;
}
</style>
