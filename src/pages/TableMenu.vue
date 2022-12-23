<template>
  <q-page>
    <div class="row">
      <div class="col-12 col-md-4"></div>
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="q-pa-none flex justify-center" style="background:#fdbe0f;">
            <q-img src="~assets/dine-logo.jpg" width="250px"></q-img>
          </q-card-section>
          <q-card-section>
            <q-tabs v-model="tab">
              <template v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="i">
                <q-tab :name="'sample' + i.toString()" :label="'Sample ' + i.toString()"></q-tab>
              </template>
            </q-tabs>
          </q-card-section>
          <q-card-section>
            <template v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="i">
              <q-btn :label="'Sample ' + i.toString()" @click="tab = 'sample' + i.toString()"></q-btn>
            </template>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4"></div>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const tab = ref('sample1')
</script>