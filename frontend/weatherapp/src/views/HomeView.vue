<template>
  <navWrapper>
    <section
      class="absolute top-0 w-full bg-[url(https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)] bg-cover bg-center bg-no-repeat">
      <div class="absolute inset-0 bg-white/75">
      </div>

      <div
        class="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center justify-between lg:px-8">
        <div class="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 class="text-3xl font-extrabold sm:text-5xl">
            Your very own

            <strong class="block font-extrabold text-primary">
              Weather Station
            </strong>
          </h1>

          <p class="mt-4 max-w-lg sm:text-xl/relaxed">
            Signup now to experience amazing dashboard for live
            weather sensor data
          </p>

          <div class="mt-8 flex flex-wrap gap-4 text-center justify-center">
            <a
              class="btn btn-primary block w-full rounded px-12 py-3 text-sm font-medium text-white shadow focus:outline-none sm:w-auto">
              Get Started
            </a>

            <a @click="toggleModal"
              class="btn btn-secondary block w-full rounded px-12 py-3 text-sm font-medium shadow focus:outline-none focus:ring sm:w-auto">
              Learn More
            </a>
          </div>
        </div>
        <div>
          <div v-if="loading" class="spinner">
            <span className="loading loading-spinner text-primary"></span>
          </div>

          <div v-else>
            <h1>Hello loaded</h1>
          </div>
        </div>
      </div>
    </section>

    <BaseModal :modal-active="modalActive" @close-modal="toggleModal">
      <div class="text-black">
        <h1 class="text-2xl mb-1">About:</h1>
        <p class="mb-4">
          The Local Weather allows you to track the current and
          future weather of cities of your choosing.
        </p>
        <h2 class="text-2xl">How it works:</h2>
        <ol class="list-decimal list-inside mb-4">
          <li>
            Search for your city by entering the name into the
            search bar.
          </li>
          <li>
            Select a city within the results, this will take
            you to the current weather for your selection.
          </li>
          <li>
            Track the city by clicking on the "+" icon in the
            top right. This will save the city to view at a
            later time on the home page.
          </li>
        </ol>

        <h2 class="text-2xl">Removing a city</h2>
        <p>
          If you no longer wish to track a city, simply select
          the city within the home page. At the bottom of the
          page, there will be am option to delete the city.
        </p>
      </div>
    </BaseModal>
  </navWrapper>
</template>

<script setup>
import navWrapper from '../components/navWrapper.vue'
import BaseModal from '../components/BaseModal.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true);
const modalActive = ref(false)
const toggleModal = () => modalActive.value = !modalActive.value
let coords = ref({})

onMounted(async () => {
  coords.value = await axios.get('http://ip-api.com/json')
  let { lat, lon } = coords.value.data

  coords = {
    lat: lat,
    lon: lon
  }
  console.log(coords)
  loading.value = false
})
</script>