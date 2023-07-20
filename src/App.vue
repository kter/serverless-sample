<template>
  <div class="p-d-flex p-jc-center p-ai-center p-dir-col" style="height: 100vh;">
    <Card>
      <template #title>
        <h2>TODO App</h2>
      </template>
      <template #content>
        <div class="p-d-flex p-ai-center">
          <InputText v-model="newTodo" placeholder="New todo" class="p-mr-2" />
          <Button icon="pi pi-plus" @click="addTodo" />
        </div>
        <ul class="p-mt-3">
          <TodoItem v-for="(todo, index) in todos" :key="index" :todo="todo" @remove="removeTodo" @toggle-completed="updateTodo" />
        </ul>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import TodoItem from './components/TodoItem.vue';

export default {
  components: {
    Card,
    InputText,
    Button,
    TodoItem
  },
  setup() {
    const todos = ref([]);
    const newTodo = ref('');

    const addTodo = async () => {
      await axios.post('https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos', { title: newTodo.value });
      fetchTodos();
      newTodo.value = '';
    };

    const removeTodo = async (todo) => {
      await axios.delete(`https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos/${todo.id}`);
      todos.value = todos.value.filter(t => t.id !== todo.id);
    };

    const updateTodo = async (updatedTodo) => {
      const index = todos.value.findIndex(todo => todo.id === updatedTodo.id);
      if (index !== -1) {
        todos.value.splice(index, 1, updatedTodo);
      }
      console.log(updatedTodo);
      await axios.put(`https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos/${updatedTodo.id.S}`, updatedTodo);
    };

    const fetchTodos = async () => {
      const response = await axios.get('https://azbwhqaqg2.execute-api.ap-northeast-1.amazonaws.com/prod/todos');
      todos.value = response.data.todos.map(todo => ({
        ...todo,
        completed: { BOOL: todo.completed.S === 'true' }
      }));
    };

    fetchTodos();

    return {
      todos,
      newTodo,
      addTodo,
      removeTodo,
      updateTodo
    };
  }
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.todo-item {
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}
</style>
