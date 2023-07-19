<template>
  <div id="app">
    <form @submit.prevent="addTodo">
      <input v-model="newTodo" type="text" placeholder="Add todo" />
      <input type="submit" value="Add" />
    </form>

    <div v-if="todos.length">
      <h2>Todos:</h2>
      <TodoItem
        v-for="(todo, index) in todos"
        :key="index"
        :todo="todo"
        @remove="removeTodo"
        @toggle-completed="toggleCompleted"
      />
    </div>

    <div v-else>
      <h2>No todos!</h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TodoItem from './components/TodoItem.vue'

export default {
  components: { TodoItem },
  data() {
    return {
      todos: [],
      newTodo: '',
    }
  },
  methods: {
    async addTodo() {
      const response = await axios.post('https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos', { title: this.newTodo });
      this.todos.push(response.data.todos);
      this.newTodo = '';
    },
    async removeTodo(todo) {
      await axios.delete(`https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos/${todo.id}`);
      this.todos = this.todos.filter(t => t.id !== todo.id);
    },
    toggleCompleted(todo) {
      todo.completed = !todo.completed;
    },
  },
  async created() {
    const response = await axios.get('https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos');
    this.todos = response.data.todos;
  }
}
</script>

<style>
/* Styles here */
</style>
