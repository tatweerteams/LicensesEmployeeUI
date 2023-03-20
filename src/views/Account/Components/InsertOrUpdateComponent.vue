<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn color="#536DFE" class="white--text " @click="openDialog" v-on="on" elevation="5">
          <v-icon class="ml-2">mdi-plus-circle</v-icon><span> إضافة حساب جديد</span>
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
          <v-form ref="formAccount" v-model="valid">

            <v-row>
              <v-col cols="12" sm="6" v-if="hasPermission(['AdminSystem']) && !id">
                <v-autocomplete v-model="selectedBank" :items="banks" :loading="isLoading" single-line dense
                  :search-input.sync="searchBank" item-text="name" item-value="bankId" label="اختر المصرف"
                  placeholder="بحث عن المصرف" return-object no-data-text=" ابحث عن اسم المصرف" clearable
                  prepend-icon="mdi-bank" @change="onBankChangeLoadRegions">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" v-if="hasPermission(['AdminSystem', 'AddAccountsToOtherBranches'])">
                <v-autocomplete v-model="selectedRegion" :items="regions" :loading="isLoadingRegion" single-line dense
                  required :search-input.sync="searchRegion" item-text="regionName" item-value="bankRegionId"
                  label="اختر المنطقة" placeholder="بحث عن المنطقة" return-object no-data-text="لايوجد بيانات" clearable
                  prepend-icon="mdi-map-marker" @change="onRegionChangeLoadBranches">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" v-if="hasPermission(['AdminSystem', 'AddAccountsToOtherBranches'])">
                <v-autocomplete v-model="selectedBranch" :items="activeBranchs" :loading="isLoadingBranch" single-line
                  dense :search-input.sync="searchBranch" item-text="name" item-value="id" label="اختر الفرع"
                  allow-overflowplaceholder="بحث عن الفرع" return-object no-data-text="لايوجد بيانات" clearable
                  prepend-icon="mdi-bank" @change="onBranchChanges">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select v-model="selectAccountType" :items="accountTypeOptions" item-text="text" item-value="value"
                  dense label="نوع الحساب" placeholder="نوع الحساب" no-data-text="لايوجد بيانات" return-object single-line
                  prepend-icon="mdi-bank" clearable>
                </v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field prepend-icon="smartphone" v-model="phoneNumber" label="رقم الهاتف" :maxlength="10" :rules="[
                  validationInput.numbersOrEmpty,
                  phoneNumberOrEmpty(),
                  phoneNumberLength()
                  //validationInput.phoneNumberOrEmpty,
                  //validationInput.phoneLengthOrEmpty,
                ]" dense>
                </v-text-field>
              </v-col>

              <v-col cols="8" sm="6">
                <v-row>
                  <v-col cols="8">
                    <v-text-field prepend-icon="mdi-bank" v-model="accountNumber" label="رقم الحساب" dense :maxlength="11"
                      :rules="[
                        validationInput.numberOnly,
                        validationInput.minLengthAccount,
                        IsvalidAccount()
                      ]" required>
                    </v-text-field>
                  </v-col>

                  <v-col cols="4">
                    <v-text-field v-model="accountBranchNumber" dense :maxlength="3" required disabled>
                    </v-text-field>
                  </v-col>

                </v-row>
              </v-col>

              <v-col cols="8" sm="6">
                <v-text-field prepend-icon="person" v-model="accountName" label="إسم الحساب" dense :maxlength="150"
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.currectInput,
                    validationInput.minLength,
                    validationInput.numEngAr,
                  ]" required>
                </v-text-field>
              </v-col>

            </v-row>

          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn @click="save" class="mx-2 white--text" :disabled="!valid" color="#536DFE">
            <v-icon>save</v-icon>
            <span>حفظ البيانات</span>
          </v-btn>
          <v-btn class="ma-3" @click="close" outlined color="#E91D62">
            <v-icon dark>clear</v-icon><span>رجوع</span>
          </v-btn>

        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { validationInput } from "../../../models/validationInput.js";

import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
    dialogProp: {},
  },

  data: () => ({

    banks: [],
    regions: [],
    activeBranchs: [],

    accountNumber: null,
    accountBranchNumber: null,

    userInfo: null,
    selectedBranchNum: null,

    dialog: false,
    valid: false,
    isLoading: false,
    isLoadingRegion: false,
    isLoadingBranch: false,

    validationInput: validationInput,

    selectedBank: null,
    selectedBranch: null,
    selectedRegion: null,

    searchRegion: null,
    searchBank: null,
    searchBranch: null,

    filterRegionData: {
      bankId: null,
      regionName: null,
    },

    filterBankData: {
      bankName: null,
    },

    selectAccountType: null,

    filterBranchData: {
      branchRegionId: null,
      NameOrNumber: null,
    },

    accountTypeOptions: [
      { text: "افراد", value: 1 },
      { text: "شركات", value: 2 },
    ],

  }),

  computed: {
    ...mapFields("accountStore", {
      id: "editedItem.id",
      accountName: "editedItem.accountName",
      accountNo: "editedItem.accountNo",
      phoneNumber: "editedItem.phoneNumber",
      branchId: "editedItem.branchId",
      accountType: "editedItem.accountType",
      accountState: "editedItem.accountState",
      inputType: "editedItem.inputType",
    }),

    formTitle() {
      return this.id ? "تعديل بيانات الحساب" : "إضافة حساب جديد";
    },

  },

  watch: {

    dialogProp: {
      handler(data) {
        this.dialog = data;
        this.getUserInfo();
      },
      immediate: true,
    },

    accountNo: {
      handler(data) {
        if (data) {
          this.accountBranchNumber = this.accountNo.substring(0, 3),
            this.accountNumber = this.accountNo.substring(3)
        }
      },
      immediate: true,
    },

    selectedBranch: {
      handler(data) {
        if (data) {
          this.accountBranchNumber = this.selectedBranch?.branchNo
        }
      },
      immediate: true,
    },

    updateItemProp: {
      handler(data) {
        if (data) this.editDialogAppear(data)
      },
      immediate: true,
    },

    selectedBank(val) {
      if (!val) this.clearRegionData();
    },

    selectedRegion(val) {
      if (!val) this.clearRegionData();
    },

    searchBank(val) {
      if (this.isLoading) return;
      this.filterBankData.bankName = val;
      this.getBanks();
    },

    searchRegion(val) {
      if (this.isLoadingRegion) return;
      if (val === this.selectedRegion?.regionName) return;
      this.filterRegionData.regionName = val;
      this.getBankRegions();
    },

    searchBranch(val) {
      if (this.isLoadingBranch) return;
      if (val === this.selectedBranch?.name) return;
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.filterBranchData.NameOrNumber = val;
      this.GetBranches();
    },

  },

  methods: {

    ...mapActions({
      SetDataUpdateStore: "accountStore/SetDataUpdate",
      GetBankStore: "bankStore/GetBanks",
      ClearDataItem: "accountStore/ClearDataItem",
      GetActiveBranchesAction: "branchStore/GetActiveBranchs",
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      InsertAccountAction: "accountStore/InsertAccount",
      UpdateAccountAction: "accountStore/UpdateAccount",
      SetBranchItemList: "branchStore/SetBranchItemList",
      SetBankItemList: "bankStore/SetBankItemList",
      SetBankRegionItemList: "bankRegionStore/SetBankRegionItemList",
    }),

    phoneNumberLength() {
      if (!this.phoneNumber)
        return true;

      if (this.phoneNumber.length === 10) {
        return true;
      } else {
        return ' رقم الهاتف يجب ان يتكون من 10 ارقام';
      }
    },

    phoneNumberOrEmpty() {
      if (!this.phoneNumber) return true;

      if (!(
        this.phoneNumber.substring(0, 3) === "092" ||
        this.phoneNumber.substring(0, 3) === "091" ||
        this.phoneNumber.substring(0, 3) === "094" ||
        this.phoneNumber.substring(0, 3) === "095" ||
        this.phoneNumber.substring(0, 3) === "023" ||
        this.phoneNumber.substring(0, 3) === "025" ||
        this.phoneNumber.substring(0, 3) === "024" ||
        this.phoneNumber.substring(0, 3) === "053" ||
        this.phoneNumber.substring(0, 3) === "051" ||
        this.phoneNumber.substring(0, 3) === "054" ||
        this.phoneNumber.substring(0, 3) === "061" ||
        this.phoneNumber.substring(0, 3) === "067" ||
        this.phoneNumber.substring(0, 3) === "069" ||
        this.phoneNumber.substring(0, 3) === "063" ||
        this.phoneNumber.substring(0, 3) === "062" ||
        this.phoneNumber.substring(0, 3) === "071"

      )) {
        return 'تأكد  من صحة رقم الهاتف ';
      }

      return true;
    },

    IsvalidAccount() {
      // if (!this.accountNo) return false;
      // let branchNo = "";

      // if (this.selectedBranch) {
      //   if (this.selectedBranch?.branchNo) branchNo = this.selectedBranch?.branchNo;
      // }
      // else {
      //   branchNo = this.userInfo.branchNumber;
      // }

      // if (this.accountNo.substring(0, 3) === branchNo) return true;
      // else return 'تأكد من رقم الفرع بالحساب';
      return true;
    },

    hasPermission(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    getUserInfo() {
      this.userInfo = this.$store.getters["auth/getInfo"];
    },

    openDialog() {
      this.dialog = true;
      this.getBanks();
      this.accountBranchNumber = this.selectedBranch ? this.selectedBranch?.branchNumber : this.userInfo.branchNumber
    },

    getBanks() {
      try {
        this.isLoading = true;
        this.GetBankStore(this.filterBankData)
          .then(() => {
            this.banks = [];
            this.banks = [
              ...this.$store.getters["bankStore/GET_ACTIVE_BANKS"],
            ];
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

    onBankChangeLoadRegions() {
      this.getBankRegions();
    },

    onRegionChangeLoadBranches() {
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.GetBranches();
    },

    onBranchChanges(item) {
      this.selectedBranchNum = item?.branchNo;
    },

    getBankRegions() {
      //if (!this.selectedBank) return;
      this.filterRegionData.bankId = this.selectedBank?.bankId;
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {
            this.regions = [];
            this.regions = [...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],];
            this.isLoadingRegion = false;
          })
          .catch(() => {
            //this.notify(`${error}`, "#1d262d");
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        //this.notify(error, "#1d262d");
      }
    },

    GetBranches() {
      try {
        //this.isLoadingBranch = true;
        this.GetActiveBranchesAction(this.filterBranchData)
          .then(() => {
            this.activeBranchs = [
              ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
            ];
            this.isLoadingBranch = false;
          })
          .catch(() => {
            //this.notify(`${error}`, "#1d262d");
            this.isLoadingBranch = false;
          });
      } catch (error) {
        //this.isLoadingBranch = false;
        this.notify(error, "#1d262d");
      }
    },

    editDialogAppear(item) {
      this.SetDataUpdateStore(item);
      this.SetBankDetailsWhenEditDialogAppear(item);
      this.SetBankRegionDetailsWhenEditDialogAppear(item);
      this.SetBranchDetailsWhenEditDialogAppear(item);
      this.SetAccountTypeWhenEditDialogAppear(item);
      if (this.accountNo && this.id) {
        this.selectedBranchNum = this.accountNo.substring(0, 3);
      }
      this.dialog = true;
    },

    SetBranchDetailsWhenEditDialogAppear(item) {
      this.activeBranchs.push({
        id: item.branchId,
        name: item.branchName,
        branchNo: item.branchNo,
      });
      this.selectedBranch = this.activeBranchs.find((x) => x.id == item.branchId);
    },

    SetBankDetailsWhenEditDialogAppear(item) {
      this.banks.push({
        name: item.bankName,
        bankId: item.bankId,
      });
      this.selectedBank = this.banks.find((x) => x.bankId == item.bankId);
    },

    SetBankRegionDetailsWhenEditDialogAppear(item) {
      this.regions.push({
        regionName: item.regionName,
        bankRegionId: item.bankRegionId,
      });
      this.selectedRegion = this.regions.find((x) => x.bankRegionId == item.bankRegionId);
    },

    SetAccountTypeWhenEditDialogAppear(item) {
      if (item.bankRegionId) {
        this.selectAccountType = this.accountTypeOptions.find((pred) => pred.value == item.accountTypeValue);
      }
    },

    clearRegionData() {
      this.isLoadingRegion = false;
      this.regions = [];
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterRegionData.bankId = null;
      this.filterRegionData.regionName = null;
      this.clearBranchData();
    },

    clearBranchData() {
      this.isLoadingBranch = false;
      this.activeBranchs = [];
      this.searchBranch = null;
      this.selectedBranch = null;
      this.filterBranchData.branchRegionId = null;
      this.filterBranchData.NameOrNumber = null;
    },

    close() {
      this.dialog = false;
      this.ClearDataItemStore();
      this.resetValidation();
      this.selectedBank = null;
      this.selectedBranch = null;

      this.$emit("close-edit-account");
    },

    save() {
      this.branchId = this.selectedBranch?.id
      if (this.id) {
        this.updateAccount();
      } else {
        this.insertAccount();
      }
    },

    insertAccount() {
      this.inputType = 1;
      this.accountState = 1;
      this.accountType = this.selectAccountType.value;
      this.branchId = this.selectedBranch?.id ?? this.userInfo.branchId;
      this.accountNo = this.accountBranchNumber + this.accountNumber

      this.$store.dispatch("loading", true);
      this.InsertAccountAction()
        .then((res) => {
          this.$emit("refresh-data");
          this.$store.dispatch("loading", false);
          this.notify(`${res}`, "#1d262d");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    updateAccount() {
      this.accountType = this.selectAccountType.value;
      this.$store.dispatch("loading", true);

      this.accountNo = this.accountBranchNumber + this.accountNumber

      this.UpdateAccountAction()
        .then((res) => {
          this.$emit("refresh-data");
          this.notify(`${res}`, "#1d262d");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formAccount?.reset();
    },

    ClearDataItemStore() {
      this.ClearDataItem();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },

  },
};
</script>

<style></style>
