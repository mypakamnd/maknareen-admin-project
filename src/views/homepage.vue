<script setup>
</script>

<template>
  <div class="admin-menu">
    <router-link to="/schedule">Schedule</router-link>
    <router-link to="/recommened-food">Recommened Food</router-link>
    <router-link to="/BirtdayCard">birthdayCard</router-link>
    <router-link to="/meencgm48-birthday-card"
      >meencgm48-birthday-card</router-link
    >
  </div>
  <router-view></router-view>
</template>

<style scoped>
.admin-menu {
  display: flex;
  flex-direction: column;
}
</style>
