<template>
    <div class="todo-item">
      <input type="checkbox" v-model="todo.completed" />
      <span>{{ todo.title }}</span>
      <button @click="removeTodo">Remove</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['todo'],
    methods: {
      removeTodo() {
        this.$emit('remove', this.todo);
      }
    }
  }
  </script>
  
  <style scoped>
  .todo-item {
    /* Styles here */
  }
  </style>
  