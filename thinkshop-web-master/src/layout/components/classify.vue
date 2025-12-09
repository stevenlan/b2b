<template>
  <div class="sticky-header-wrapper" @mouseleave="handleMouseleave">
    <div class="header-container w-width" style="width: 66%">
      <!-- Left Section: Categories Dropdown -->
      <div class="left-section">
        <a-dropdown :trigger="['click']">
          <a-button class="categories-btn" @click.prevent>
            <template #icon><MenuOutlined /></template>
            {{$t('layout.categories')}}
            <DownOutlined style="margin-left: 60px"/>
          </a-button>
          <template #overlay>
            <a-menu>
              <div v-for="item in tabList"  @click="toRoute(item)">
                <a-menu-item :key="item.categoryId">{{item.name}}</a-menu-item>
                <a-menu-divider />
              </div>
            </a-menu>
          </template>
        </a-dropdown>
<!--        <a-dropdown :open="popShow">-->
<!--          <template #overlay>-->
<!--            <div class="classify-pop">-->
<!--                <div class="pop-con">-->
<!--                  <a-flex warp="warp" :gap="100">-->
<!--                    <div class="c-item-box" v-for="it in child" :key="it.categoryId">-->
<!--                      <p class="cursor-p" @click="toRoute(it)">{{it.name}}</p>-->
<!--                      <ul v-if="it.child&&it.child.length">-->
<!--                        <li v-for="item in it.child" :key="item.categoryId" class="cursor-p" @click="toRoute(item)">-->
<!--                          {{item.name}}-->
<!--                        </li>-->
<!--                      </ul>-->
<!--                    </div>-->
<!--                  </a-flex>-->
<!--                </div>-->
<!--            </div>-->
<!--          </template>-->
<!--          <a-button class="categories-btn" @mouseenter="handleMouseenter({ isCategory: true })">-->
<!--            <template #icon><MenuOutlined /></template>-->
<!--            {{$t('layout.categories')}}-->
<!--            <DownOutlined style="margin-left: 60px"/>-->
<!--          </a-button>-->
<!--        </a-dropdown>-->
      </div>

      <!-- Center Section: Navigation Tabs -->
      <div class="center-section" style="padding: 0 40px;">
        <a-tabs v-model:activeKey="activeKey" size="large">
          <a-tab-pane v-for="it in tabList" :key="it.categoryId">
            <template #tab>
              <div class="s-tab" @click="toRoute(it)" @mouseenter="handleMouseenter(it)">
                {{it.name}}
              </div>
            </template>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- Right Section: Action Icons -->
      <div class="right-section">
        <classify-right/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {categoryList} from '@/api/product';
import {
  MenuOutlined,
  DownOutlined
} from '@ant-design/icons-vue';
import ClassifyRight from "@/layout/components/classify-right.vue";

const router = useRouter()
const {proxy} = getCurrentInstance()

const tabList = ref([])
const activeKey = ref('home')
const popShow = ref(false)
const child = ref([])

watch(() => router.currentRoute.value, val => {
  if(val.path==='/index') {
    activeKey.value = 'home'
  }
}, {deep: true})

function handleMouseenter(it) {
  // Logic for categories button hover
  if (it.isCategory) {
    const mainCategories = tabList.value.filter(c => c.categoryId !== 'home' && c.child?.length);
    if (mainCategories.length > 0) {
        // For simplicity, let's just show the children of the first main category
        // You might want a more sophisticated way to display all categories
        child.value = mainCategories.flatMap(c => c.child);
        popShow.value = true;
    } else {
        resetPop();
    }
    return;
  }

  // Logic for tabs hover (to show sub-categories)
  if(it.categoryId!=='home'&&it.child?.length) {
    popShow.value = true
    child.value = it.child
  } else {
    resetPop()
  }
}
// 重置下拉分类状态
function resetPop() {
  popShow.value = false
  child.value = []
}
function handleMouseleave() {
  resetPop()
}
function queryCategory() {
  categoryList().then(res => {
    const {rows} = res
    tabList.value = [
      {
        name: proxy.$t('layout.home'),
        categoryId: 'home'
      },
      ...rows
    ]
  })
}
function toRoute(it) {
  const {categoryId} = it
  let query = {}
  const path = categoryId==='home'?'/index':'/product-list'
  if(categoryId!=='home') query = {categoryId, fullPath: encodeURIComponent(it.path)}
  router.push({path, query})
  resetPop()
}

queryCategory()
</script>

<style lang="scss" scoped>
.sticky-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #1a202c; /* Dark background color from image */
  color: #fff;
  height: 70px;
  border-bottom: 1px solid #2d3748;

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    margin: 0 auto;
  }

  .left-section,
  .right-section {
    flex-shrink: 0;
  }

  .center-section {
    flex-grow: 1;
    overflow-x: auto;
    height: 100%;
    user-select: none; /* Standard syntax */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ and Edge */

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .categories-btn {
    background-color: #4a5568; /* Button color from image */
    color: #fff;
    border: none;
    height: 40px;
    &:hover,
    &:focus {
      background-color: #2d3748;
      color: #fff;
    }
  }

  .action-icon {
    font-size: 18px;
    cursor: pointer;
    color: #cbd5e0;
    &:hover {
      color: #fff;
    }
  }

  :deep(.ant-tabs) {
    height: 100%;
    .ant-tabs-nav {
      margin: 0;
      height: 100%;
      white-space: nowrap; // Prevent tabs from wrapping
      flex-wrap: nowrap;
      &::before {
        display: none;
      }
    }
    .ant-tabs-tab {
      font-size: 16px;
      padding: 0;
      margin: 0;
      color: #cbd5e0;
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          font-weight: 600;
          color: #ffffff;
        }
      }
      &:hover {
        .ant-tabs-tab-btn {
          color: #ffffff;
        }
      }
      .s-tab {
        padding: 0 28px;
        height: 76px;
        line-height: 76px;
      }
    }
    .ant-tabs-ink-bar {
      background: #ffffff;
      height: 2px;
    }
  }

  .classify-pop {
    background: #ffffff;
    color: #333;
    padding: 24px 40px;
    border-radius: 4px;
    margin-top: 10px;
    .pop-con {
      width: auto;
      margin: 0 auto;
      .c-item-box {
        p {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 20px;
        }
        ul {
          li {
            font-size: 16px;
            margin-bottom: 8px;
            &:hover {
              text-decoration: underline;
              text-underline-position: under;
            }
          }
        }
      }
    }
  }
}
</style>
