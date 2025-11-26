<template>
   <div class="p24 user-center">
      <p class="m-title">个人中心</p>
      <div class="info">
         <p class="label-text">头像</p>
         <div class="avatar-cell mb16">
            <img :src="userStore.avatar"/>
            <div class="upload-avatar">
               <userAvatar />
               <p>建议上传500*500px的jpg、png、gif、BMP图像</p>
            </div>
         </div>
         <p class="label-text">账户</p>
         <el-input disabled v-model="state.user.userName" class="mb16 w250"/>
         <el-form
            :rules="rules"
            :model="state.user"
            ref="userRef"
            class="user-form"
         >
            <el-form-item prop="nickName">
               <p class="label-text">昵称</p>
               <el-input class="w250" v-model="state.user.nickName" maxlength="20"/>
            </el-form-item>
            <el-form-item>
               <p class="label-text">性别</p>
               <el-select class="w250" v-model="state.user.sex">
                  <el-option
                     v-for="item in sexOpt"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                  />
               </el-select>
            </el-form-item>
         </el-form>
         <p class="label-text">登录密码</p>
         <el-input disabled class="w250 mb16" type="password" v-model="state.user.password">
            <template #suffix>
               <span class="edit-text" @click="editPassword">修改</span>
            </template>
         </el-input>
         <div class="btn-list mb16">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
         </div>
      </div>
      <resetPwd ref="passwordRef"/>
   </div>
</template>

<script setup name="Profile">
import userAvatar from "./userAvatar";
import resetPwd from "./resetPwd";
import { getUserProfile, updateUserProfile } from "@/api/system/user";
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();
const { proxy } = getCurrentInstance();


const state = reactive({
   user: {},
   roleGroup: {},
   postGroup: {}
});
const sexOpt = shallowRef([
   {label: '男', value: '1'},
   {label: '女', value: '0'}
])
const rules = ref({
   nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
})
//  保存
function submit() {
   proxy.$refs.userRef.validate(valid => {
      if (valid) {
         const {nickName, sex} = state.user
         updateUserProfile({nickName, sex}).then(response => {
            proxy.$modal.msgSuccess("修改成功");
         });
      }
   });
};
// 取消
function cancel() {
   proxy.$tab.closePage();
}
// 修改密码
function editPassword() {
   proxy.$refs.passwordRef.open()
}
function getUser() {
   getUserProfile().then(response => {
      state.user = response.data;
      state.roleGroup = response.roleGroup;
      state.postGroup = response.postGroup;
   });
};

getUser();
</script>

<style scoped lang='scss'>
.user-center {
   .mb16 {
      margin-bottom: 16px;
   }
   .w250 {
      width: 250px;
   }
   .m-title {
      margin-bottom: 32px;
   }
   .info {
      padding-left: 16px;
      .label-text {
         margin-bottom: 8px;
         font-size: 14px;
         font-weight: 500;
      }
   }
   .avatar-cell {
      display: flex;
      column-gap: 16px;
      img {
         height: 80px;
         width: 80px;
         border-radius: 50%;
      }
      .upload-avatar {
         padding-top: 12px;
         p {
            font-size: 12px;
            color: #8C8C8C;
            margin-top: 8px;
         }
      }
   }
   :deep(.user-form)  {
      .el-form-item {
         display: block;
         .el-form-item__content {
            display: block;
            p {
               line-height: initial;
            }
         }
      }
   }
   :deep(.el-input) {
      .edit-text {
         font-size: 14px;
         color: #262626;
         text-decoration: underline;
         &:hover {
            cursor: pointer;
         }
      }
   }
}
</style>
