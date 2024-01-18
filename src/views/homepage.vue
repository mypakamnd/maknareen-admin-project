<script setup>
</script>

<template>
  <div class="admin-menu">
    <router-link to="/schedule">Schedule</router-link>
    <router-link to="/recommened-food">Recommened Food</router-link>
  </div>
  <router-view></router-view>
</template>

<style scoped>
.admin-menu {
  display: flex;
  flex-direction: column;
}
</style>
