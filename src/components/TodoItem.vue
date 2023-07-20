<template>
    <ul class="p-d-flex p-ai-center p-jc-between">
      <div class="p-d-flex p-ai-center">
        <Checkbox binary :modelValue="todo.completed.BOOL" :value="true" :false-value="false" @update:modelValue="toggleCompleted" />
        <span>{{ todo.title.S }}</span>
        <Button icon="pi pi-times" class="p-button-text p-button-danger" @click="removeTodo" />
      </div>
    </ul>
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
  ul {
    padding: 1em;
    border: none;
    margin-bottom: 0.5em;
    margin-right: 20em;
    margin-left: 20em;
    border-radius: 5px;
    background-color: #f8f9fa;
  }
  
  ul .p-button-text.p-button-danger {
    color: #dc3545;
  }
  
  ul .p-checkbox .p-checkbox-box {
    border-color: #6c757d;
  }
  
  ul .p-checkbox.p-checkbox-checked .p-checkbox-box {
    border-color: #28a745;
    background-color: #28a745;
  }

  ul .p-d-flex .p-ai-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .p-checkbox.p-component {
    margin-right: 1em;
  }
  </style>
  
  