<script setup>
import prolHome from './prol/home.vue'
</script>
<template>
    <nav>
        <ul>
            <li>
                <a>{{ username }}</a>
            </li>
            <li>
                <!-- <a href="home.vue">Prol home</a> -->
                <router-link to="/prol/home">Home</router-link>
                <router-view></router-view>
            </li>
        </ul>
    </nav>
    <main><div id="vacancies">xd</div></main>
</template>
<script defer>
console.log(new URLSearchParams(document.location.search))
export default {
    name: 'rootPage'
}
</script>
