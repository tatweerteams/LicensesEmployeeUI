<template>
  <v-dialog
    v-model="resetPasswordDialog"
    min-height="200px"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">إعادة ضبط كلمة المرور المستخدم ؟</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-5">
        <v-form ref="formRestPassword" v-model="valid">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="resetPasswordItem.newPassword"
                prepend-icon="mdi-file-document-alert"
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
            <v-col cols="12" sm="6">
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
            <v-col cols="12">
              <v-switch
                label="إرسال كلمة المرور إلي رقم الهاتف و البريد الإلكتروني"
                color="#536DFE"
                hide-details
                dense
                class="justify-center text-center d-inline-block"
                v-model="resetPasswordItem.sendPassword"
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn
            @click="resetPassword"
            class="mx-2 white--text"
            color="#536DFE"
            :disabled="!valid"
          >
            <v-icon>save</v-icon>
            <span>تأكيد</span>
          </v-btn>
          <v-btn
            @click="closeResetPasswordDialog"
            class="mx-2 white--text"
            color="#E91D62"
          >
            <v-icon style="font-size: 19px;" dark>clear</v-icon>
            <span>إغلاق</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { validationInput } from "../../../../models/validationInput.js";

export default {
  props: {
    resetPasswordItemProp: {},
  },
  name: "Reset-Password-Item",
  data: () => ({
    resetPasswordDialog: false,
    valid: false,
    showPassword: false,
    validationInput: validationInput,
    resetPasswordItem: {
      userId: null,
      newPassword: null,
      sendPassword: false,
    },
    defaultItem: {
      userId: null,
      newPassword: null,
      sendPassword: false,
    },
  }),
  watch: {
    resetPasswordItemProp: {
      handler(data) {
        if (data) this.displayResetPasswordDialog(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      ResetPassword: "userStore/ResetPassword",
    }),
    generatePassword() {
      let min = 1000;
      let max = 99999;
      var password = Math.floor(Math.random() * (max - min + 1)) + min;
      this.resetPasswordItem.newPassword = `${password}`;
    },
    resetPassword() {
      this.$store.dispatch("loading", true);
      this.ResetPassword(this.resetPasswordItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$store.dispatch("loading", false);
          this.$emit("refresh-data");
 
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
      this.closeResetPasswordDialog();
    },

    displayResetPasswordDialog(item) {
      this.resetPasswordItem.userId = item.id;
      this.resetPasswordDialog = true;
    },

    closeResetPasswordDialog() {
      this.resetPasswordItem = Object.assign({}, this.defaultItem);
      this.resetPasswordDialog = false;
      this.$emit("close-dialog-ResetPassword");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
