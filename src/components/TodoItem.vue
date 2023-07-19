<template>
    <div class="todo-item">
      <input type="checkbox" :checked="todo.completed" @change="toggleCompleted" />
      <span>{{ todo.title.S }}</span>
      <button @click="removeTodo">Remove</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['todo'],
    methods: {
      removeTodo() {
        this.$emit('remove', this.todo);
      },
      toggleCompleted() {
        this.$emit('toggle-completed', this.todo);
      }
    }
  }
  </script>
  
  <style scoped>
  .todo-item {
    /* Styles here */
  }
  </style>
  
  