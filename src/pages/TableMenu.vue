<template>
  <q-page>
    <div class="row bg-grey-3">
      <div class="col-12 col-md-4"></div>
      <div class="col-12 col-md-4 relative-position">
        <q-card>
          <q-card-section class="q-pa-none flex justify-center" style="background:#fdbe0f;">
            <q-img src="~assets/dine-logo.jpg" width="250px"></q-img>
          </q-card-section>
        </q-card>
        <div class="" style="position: -webkit-sticky; position:sticky; top:0; z-index:10" ref="headerRef">
          <q-card flat bordered>
            <q-card-section>
              <q-avatar>
                <q-img src="~assets/g.jpg"></q-img>
              </q-avatar>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <div class="row">
                <div class="col-auto flex items-center justify-center">
                  <q-btn flat icon="menu"></q-btn>
                </div>
                <q-separator vertical />
                <div class="col">
                  <q-tabs :model-value="active" @update:model-value="onUpdateTab" active-bg-color="grey-9"
                    active-color="white" no-caps switch-indicator outside-arrows mobile-arrows narrow-indicator>
                    <template v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="i">
                      <q-tab :name="i" :label="'Sample ' + i.toString()"></q-tab>
                    </template>
                  </q-tabs>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-card flat>
          <q-card-section>
            <template v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="i">
              <q-card style="z-index:9;" :data-id="i" ref="refElements">
                <q-card-section style="height:200px">
                  <q-img src="~assets/dine-logo.jpg" width="150px"></q-img>
                  <div class="text-h6">{{ 'Sample ' + i }}</div>
                </q-card-section>
              </q-card>
            </template>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4"></div>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import { QPage, QCard, QCardSection, QImg, QAvatar, QSeparator, QBtn } from 'quasar';
import { onMounted, ref } from 'vue';
const active = ref(1)
const headerRef = ref<HTMLElement | null>(null)
const refElements = ref([])
onMounted(() => {
  const rootMargin = '-133px 0px -' + (window.innerHeight - 133) + 'px' + ' 0px'
  console.log(rootMargin)
  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('data-id')
      if (entry.isIntersecting) {
        active.value = parseInt(id as string)
      }
    })
  }, {
    root: null,
    rootMargin: rootMargin,
    threshold: 0
  })

  refElements.value.forEach((item: QCard) => {
    observer.observe(item.$el)
  })
})
function onUpdateTab(val: number) {
  const card = refElements.value[val] as QCard
  const el = card.$el as HTMLElement
  const headerHeight = headerRef.value?.offsetHeight as number
  const elPos = el.getBoundingClientRect().top
  const offsetPos = elPos + window.scrollY - headerHeight - el.offsetHeight
  console.log(offsetPos)
  window.scrollTo({
    top: offsetPos,
    behavior: 'smooth'
  })
}
</script>