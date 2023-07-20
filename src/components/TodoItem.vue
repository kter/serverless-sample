<template>
    <li class="p-d-flex p-ai-center p-jc-between">
      <div class="p-d-flex p-ai-center">
        <Checkbox :modelValue="todo.completed.BOOL" :value="true" :false-value="false" class="p-mr-2" @update:modelValue="toggleCompleted" />
        <span>{{ todo.title.S }}</span>
        <Button icon="pi pi-times" class="p-button-danger" @click="removeTodo" />
      </div>
    </li>
  </template>
  
  <script>
  import { toRefs } from 'vue';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  
  export default {
    props: ['todo'],
    components: {
      Checkbox,
      Button
    },
    setup(props, { emit }) {
      const { todo } = toRefs(props);
  
      const removeTodo = () => {
        emit('remove', todo.value);
      };
  
      const toggleCompleted = (completed) => {
        emit('toggle-completed', { ...todo.value, completed: { BOOL: completed } });
      };
  
      return {
        removeTodo,
        toggleCompleted
      };
    }
  };
  </script>
  
  <style scoped>
  li {
    padding: 1em;
    border: 1px solid #ddd;
    margin-bottom: 0.5em;
    border-radius: 5px;
  }
  </style>
  