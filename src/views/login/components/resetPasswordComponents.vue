<template>
  <v-dialog
    class="rounded-bl-xl"
    overlay-opacity="0.8"
    v-model="resetPasswordDialog"
    overlay-color="#261f46"
    max-width="600"
    persistent
    transition="fab-transition"
  >
    <v-card
      max-width="600"
      class="rounded-bl-xl"
      style="background: rgba(255, 255, 255, 0.8)"
    >
      <v-card-title class="text-center" style="text-align: center">
        <v-avatar color="#261f46" class="justify-end">
          <v-icon color="#FFF" dark> mdi-shield-lock </v-icon>
        </v-avatar>
        <span
          class="headline mr-3 justify-center"
          style="text-align: center; color: #261f46"
          >إعادة ضبط كلمة المرور</span
        >
        <v-spacer />
        <v-btn
          class="mr-2"
          @click="closeResetPasswordDialog"
          outlined
          color="error"
        >
          <v-icon style="font-size: 19px" dark>clear</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="mt-5" justify="center">
          <v-col cols="12" sm="10">
            <v-form ref="fromResetPassword" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    prepend-inner-icon="person"
                    dense
                    name="Account"
                    color="accent-3"
                    :rules="[validationInput.numberAndEng]"
                    v-model="resetPasswordItem.employeeNumber"
                    persistent-hint
                    placeholder="رقم الوظيفي"
                    :maxlength="8"
                    background-color="#E2EFFD"
                    outlined
                    counter="8"
                    rounded
                    :aria-autocomplete="false"
                    style="color: blue !important"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    prepend-inner-icon="lock"
                    :type="hidePassword ? 'password' : 'text'"
                    :append-icon="
                      hidePassword ? 'visibility_off' : 'visibility'
                    "
                    dense
                    name="password"
                    color="accent-3"
                    v-model="resetPasswordItem.passwordNew"
                    persistent-hint
                    placeholder="ادخل كلمة مرور الجديدة"
                    :maxlength="30"
                    background-color="#E2EFFD"
                    outlined
                    counter="30"
                    rounded
                    :rules="passwordRules"
                    :aria-autocomplete="false"
                    style="color: blue !important"
                    class="mt-5"
                    @click:append="hidePassword = !hidePassword"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :type="hidePassword ? 'password' : 'text'"
                    :append-icon="
                      hidePassword ? 'visibility_off' : 'visibility'
                    "
                    @click:append="hidePassword = !hidePassword"
                    prepend-inner-icon="lock"
                    dense
                    name="password"
                    color="accent-3"
                    v-model="resetPasswordItem.confirmPasswordNew"
                    persistent-hint
                    :rules="passwordRules"
                    placeholder="تأكيد كلمة مرور الجديدة"
                    :maxlength="30"
                    background-color="#E2EFFD"
                    outlined
                    counter="30"
                    rounded
                    :aria-autocomplete="false"
                    style="color: blue !important"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-col>

          <v-col class="text-center">
            <v-btn
              :disabled="!valid"
              :loading="loading"
              color="#261f46"
              outlined
              @click="ChengePassword"
            >
              <v-icon tyle="font-size: 19px; color:#fff">mdi-email-fast</v-icon>
              <span>تغيير كلمة المرور</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../../../eventBus.js";
import { validationInput } from "../../../models/validationInput";
import { mapActions } from "vuex";
export default {
  props: {
    resetPasswordDialogProp: {},
  },
  components: {},
  name: "resetPassword-Component",
  data: () => ({
    validationInput: validationInput,
    resetPasswordDialog: false,
    hidePassword: true,
    resetPasswordItem: {
      employeeNumber: "",
      passwordNew: null,
      confirmPasswordNew: null,
      userId: null,
    },

    clearResetPasswordItem: {
      employeeNumber: "",
      passwordNew: null,
      confirmPasswordNew: null,
      userId: null,
    },
    
     
    passwordRules: [
      (v) => !!v || "الرجاء إدخال كلمة المرور",
      (v) =>
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          v
        ) || "يجب ان يتكون كلمة المرور من حروف وارقام",
    ],

    loading: false,
    valid: false,
  }),

  created() {},
  watch: {
    resetPasswordDialogProp: {
      handler(data) {
        this.resetPasswordDialog = data;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      resetPassword: "auth/ResetPassword",
      setTokenLoginUser: "auth/SetTokenLoginUser",
    }),
    ChengePassword() {
      if (
        this.resetPasswordItem.passwordNew !=
        this.resetPasswordItem.confirmPasswordNew
      ) {
        let message = "كلمة المرور غير متطابقة";
        this.notify(message, "error");
        return;
      }
      var currentUser = this.$store.getters["auth/getInfo"];
      this.$store.dispatch("loading", true);
      this.resetPasswordItem.userId = currentUser?.id;

      if (this.$refs.fromResetPassword.validate()) {
        this.resetPassword(this.resetPasswordItem)
          .then(() => {
            this.closeResetPasswordDialog();
            this.notify(
              "تم تغيير كلمة المرور يجب إعادة تسجيل الدخول",
              "#1d262d"
            );
            this.$store.dispatch("loading", false);
          })
          .catch((error) => {
            this.$store.dispatch("loading", false);
            this.notify(error, "error");
          });
      } else {
        this.$store.dispatch("loading", false);
      }
    },

    closeResetPasswordDialog() {
      this.resetPasswordItem = Object.assign({}, this.clearResetPasswordItem);
      this.resetPasswordDialog = false;
      EventBus.$emit("closeResetPasswordDialog");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style>
.rounded-bl-xl {
  border-radius: 30px !important;
}

.otp-input {
  width: 50px;
  height: 50px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  text-align: left;
  direction: rtl;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* .v-otp-input .v-input input[type=number] {
    -moz-appearance: textfield;
    background-color: #DBDAE1;
    color: #261f46;
    border-bottom: 1px solid #261f46;
  
  } */
</style>
