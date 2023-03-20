<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text "
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon
          ><span> إضافة مستخدم</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formUser" v-model="valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.employeeNumber"
                  prepend-icon="mdi-id-card"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.numberOnly,
                    validationInput.minLength,
                    validationInput.numberNotZero,
                  ]"
                  label="رقم الوظيفي"
                  required
                  maxLength="4"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.name"
                  prepend-icon="mdi-account-tie"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.isArabic,
                    validationInput.minLength,
                    validationInput.currectInput,
                  ]"
                  label="اسم المستخدم"
                  required
                  maxLength="50"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.phoneNumber"
                  prepend-icon="mdi-phone"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.numberOnly,
                    validationInput.phoneNumber,
                    validationInput.phoneNumberNotZero,
                    validationInput.phoneLength,
                  ]"
                  label="رقم الهاتف"
                  required
                  maxLength="10"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.email"
                  prepend-icon="mdi-email"
                  dense
                  :rules="[validationInput.isEmpty,validationInput.emailRules]"
                  label="بريد الإلكتروني"
                  required
                  maxLength="50"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="!isUpdate">
                <v-text-field
                  v-model="editItem.passwordHash"
                  prepend-icon="mdi-lock"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.numberOnly,
                    validationInput.numberNotZero,
                  ]"
                  label="كلمة المرور"
                  placeholder="إصدار كلمة المرور"
                  required
                  readonly
                  maxLength="50"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="!isUpdate">
                <v-btn
                  color="#536DFE"
                  class="white--text "
                  @click="generatePassword"
                  elevation="5"
                  small
                >
                  <v-icon class="ml-2">mdi-lock-reset</v-icon
                  ><span>ضبط كلمة المرور</span>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" v-if="hasPermassion(['AdminSystem'])">
                <v-autocomplete
                  v-model="selectedBank"
                  :items="banks"
                  dense
                  :loading="isLoading"
                  single-line
                  :search-input.sync="searchBank"
                  @keyup="getBanks"
                  item-text="name"
                  item-value="bankId"
                  label="اختر المصرف"
                  placeholder="يجب إختيار المصرف"
                  return-object
                  no-data-text="قم بالبحث عن إسم المصرف"
                  clearable
                  :rules="[validationInput.selectedValidation]"
                  required
                  prepend-icon="mdi-bank"
                  @change="getRegionByBankId"
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AddUserOtherBranchs', 'AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedRegion"
                  :items="regions"
                  :loading="isLoadingRegion"
                  single-line
                  dense
                  :rules="[validationInput.selectedValidation]"
                  required
                  :search-input.sync="searchRegion"
                  item-text="regionName"
                  item-value="bankRegionId"
                  label="اختر المنطقة"
                  placeholder="يجب إختيار المنطقة"
                  return-object
                  no-data-text="لايوجد بيانات"
                  clearable
                  @keyup="searchBranchRegion"
                  @change="getBranchByRegionId"
                  prepend-icon="mdi-map-marker"
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AddUserOtherBranchs', 'AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedBranch"
                  :items="branchs"
                  :loading="isLoadingBranch"
                  single-line
                  :search-input.sync="searchBranch"
                  item-text="name"
                  item-value="id"
                  label="اختر الفرع"
                  placeholder="بحث عن طريق الفرع"
                  return-object
                  no-data-text="لايوجد بيانات"
                  clearable
                  @keyup="getBranchs"
                  prepend-icon="mdi-bank"
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectUserType"
                  :items="userTypes"
                  item-text="name"
                  item-value="id"
                  clearable
                  prepend-icon="search"
                  label="التبعية"
                  dense
                  :rules="[validationInput.selectedValidation]"
                  required
                  @change="getRoles"
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedRole"
                  :items="roles"
                  label="الدور"
                  placeholder="اختر الدور"
                  :rules="[validationInput.selectedValidation]"
                  required
                  item-text="name"
                  item-value="id"
                  :search-input.sync="searchRole"
                  @keyup="getRoles"
                  dense
                  return-object
                  persistent-hint
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="!isUpdate">
                <v-switch
                  label="إرسال كلمة المرور إلي رقم الهاتف و البريد الإلكتروني"
                  color="#536DFE"
                  dense
                  class="justify-center text-center d-inline-block"
                  v-model="editItem.sendPassword"
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn
            @click="save"
            class="mx-2 white--text"
            :disabled="!valid"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>حفظ البيانات</span>
          </v-btn>
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
            <span>إغلاق</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationInput } from "../../../../models/validationInput.js";
import { UserTypeStateList } from "../../../../models/enum";

import { mapActions } from "vuex";
// import { createHelpers } from "vuex-map-fields";
// const { mapMultiRowFields  } = createHelpers({
//   getterType: "getDataFields",
//   mutationType: "updateDataField",
// });
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
  },
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    showPassword: false,
    validationInput: validationInput,

    editItem: {
      id: null,
      userType: 0,
      name: null,
      email: null,
      roleId: null,
      phoneNumber: null,
      branchNumber: null,
      employeeNumber: null,
      branchId: null,
      branchName: null,
      regionId: null,
      regionName: null,
      bankId: null,
      bankName: null,
      passwordHash: null,
      sendPassword: false,
    },

    defaultItem: {
      id: null,
      userType: 0,
      name: null,
      email: null,
      roleId: null,
      phoneNumber: null,
      branchNumber: null,
      employeeNumber: null,
      branchId: null,
      branchName: null,
      regionId: null,
      regionName: null,
      bankId: null,
      bankName: null,
      passwordHash: null,
      sendPassword: false,
    },

    roles: [],

    searchRole: null,
    selectedRole: null,
    filterDataRole: {
      name: null,
      userType: 0,
    },

    banks: [],
    isLoading: false,
    selectedBank: null,
    searchBank: null,
    filterBankData: {
      bankName: null,
    },

    regions: [],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      bankId: null,
      regionName: null,
    },

    branchs: [],
    isLoadingBranch: false,
    selectedBranch: null,
    searchBranch: null,
    filterBranchData: {
      branchRegionId: null,
      nameOrNumber: null,
    },

    userTypes: UserTypeStateList,
    selectUserType: null,
  }),

  computed: {
    formTitle() {
      return this.editItem.id ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد";
    },
    isUpdate() {
      return this.editItem.id;
    },
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    searchPermisstion(data) {
      this.filterDataPermisstion.name = data;
    },
    searchBank(val) {
      if (this.isLoading) return;

      this.filterBankData.bankName = val;
    },

    searchRegion(val) {
      if (this.isLoadingRegion) return;
      this.filterRegionData.regionName = val;
    },
    searchBranch(val) {
      this.filterBranchData.nameOrNumber = val;
    },

    selectedBank(val) {
      if (!val) this.clearRegionData();
    },
    selectedRegion(val) {
      if (!val) this.clearBranchData();
    },
  },
  methods: {
    ...mapActions({
      InsertUserStore: "userStore/InsertUser",
      UpdateUserStore: "userStore/UpdateUser",
      GetRoles: "roleStore/GetActiveRoles",
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetBankStore: "bankStore/GetBanks",
      GetActiveBranchs: "branchStore/GetActiveBranchs",
    }),
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    generatePassword() {
      let min = 1000;
      let max = 99999;
      var password = Math.floor(Math.random() * (max - min + 1)) + min;
      this.editItem.passwordHash = `${password}`;
    },

    getRoles() {
      if (!this.selectUserType) return;
      this.filterDataRole.userType = this.selectUserType;
      this.GetRoles(this.filterDataRole)
        .then(() => {
          this.roles = [...this.$store.getters["roleStore/GET_ACTIVE_ROLES"]];
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
        });
    },

    openDialog() {
      this.dialog = true;
    },

    editSelected(item) {
      this.editItem = Object.assign({}, item);
      this._selectedBankEdit(item);
      this._selectedBankRegionEdit(item);
      this._selectedBranchEdit(item);
      this._selectedRoleEdit(item);
      this.selectUserType = item.userType;
      this.dialog = true;
    },

    _selectedBankEdit(item) {
      if (item.bankId && item.bankName) {
        this.banks.push({
          name: item.bankName,
          bankId: item.bankId,
        });

        this.selectedBank = this.banks.find(
          (pred) => pred.bankId == item.bankId
        );
      }
    },
    _selectedBankRegionEdit(item) {
      if (item.regionId && item.regionName) {
        this.regions.push({
          regionName: item.regionName,
          bankRegionId: item.regionId,
        });

        this.selectedRegion = this.regions.find(
          (pred) => pred.bankRegionId == item.regionId
        );
      }
    },
    _selectedBranchEdit(item) {
      if (item.branchId && item.branchName) {
        this.branchs.push({
          name: item.branchName,
          id: item.branchId,
          branchNo: item.branchNumber,
        });

        this.selectedBranch = this.branchs.find(
          (pred) => pred.id == item.branchId
        );
      }
    },
    _selectedRoleEdit(item) {
      if (item.roleId && item.roleName) {
        this.roles.push({
          name: item.roleName,
          id: item.roleId,
        });

        this.selectedRole = this.roles.find((pred) => pred.id == item.roleId);
      }
    },

    clearRole() {
      this.searchRole = null;
      this.filterDataRole.name = null;
      this.filterDataRole.userType = 0;
      this.selectedRole = null;
      this.roles = [];
    },

    close() {
      this.resetValidation();
      this.editItem = Object.assign({}, this.defaultItem);
      this.selectUserType = null;
      this.dialog = false;
      this.clearRole();
      this.clearBankData();
      this.clearRegionData();
      this.clearBranchData();
      this.$emit("close-dialog-InsertOrUpdate");
    },

    save() {

      if (!this.$refs.formUser.validate()) {
        this.notify("يجب إدخال جميع الحقول المطلوبة", "#1d262d");
        return;
      }


      this.editItem.userType = this.selectUserType;
      this.editItem.bankId = this.selectedBank?.bankId ?? null;
      this.editItem.bankName = this.selectedBank?.name ?? null;
      this.editItem.regionId = this.selectedRegion?.bankRegionId ?? null;
      this.editItem.regionName = this.selectedRegion?.regionName ?? null;
      this.editItem.branchId = this.selectedBranch?.id ?? null;
      this.editItem.branchName = this.selectedBranch?.name ?? null;
      this.editItem.branchNumber = this.selectedBranch?.branchNo ?? null;
      this.editItem.roleId = this.selectedRole?.id ?? null;

      if (this.editItem.id) {
        this.UpdateUser();
      } else {
        this.InsertUser();
      }
    },

    UpdateUser() {
      this.$store.dispatch("loading", true);
      this.UpdateUserStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },
    InsertUser() {
      this.$store.dispatch("loading", true);
      this.InsertUserStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");

          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    getRegionByBankId() {
      this.clearRegionData();
      this.getBankRegions();
    },

    getBankRegions() {
      // if (!this.selectedBank) return;
      this.filterRegionData.bankId = this.selectedBank?.bankId ??null;
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {
            this.regions = [
              ...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],
            ];
            this.isLoadingRegion = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        this.notify(error, "#1d262d");
      }
    },

    searchBranchRegion() {
      this.clearBranchData();
      this.getBankRegions();
    },

    clearRegionData() {
      this.isLoadingRegion = false;
      this.regions = [];
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterRegionData.bankId = null;
      this.filterRegionData.regionName = null;
    },

    getBanks() {
      try {
        this.isLoading = true;
        this.GetBankStore(this.filterBankData)
          .then(() => {
            this.banks = [...this.$store.getters["bankStore/GET_ACTIVE_BANKS"]];
            this.isLoading = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoading = false;
          });
      } catch (error) {
        this.isLoading = false;
        this.notify(error, "#1d262d");
      }
    },

    clearBankData() {
      this.isLoading = false;
      this.banks = [];
      this.selectedBank = null;
      this.searchBank = null;
      this.filterBankData.bankName = null;
    },

    getBranchs() {
      if (!this.selectedRegion) return;
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.isLoadingBranch = true;
      this.GetActiveBranchs(this.filterBranchData)
        .then(() => {
          this.branchs = [
            ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
          ];
          this.isLoadingBranch = false;
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.isLoadingBranch = false;
        });
    },

    getBranchByRegionId() {
      this.getBranchs();
    },

    clearBranchData() {
      this.isLoadingBranch = false;
      this.branchs = [];
      this.selectedBranch = null;
      this.searchBranch = null;
      this.filterBranchData.branchRegionId = null;
      this.filterBranchData.nameOrNumber = null;
    },

    resetValidation() {
      this.$refs.formUser?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
