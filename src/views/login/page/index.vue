<template>
  <v-container fill-height fluid style="background-color: #e4e8ed;">
    <resetPasswordComponent :resetPasswordDialogProp="dialogResetPassword">
    </resetPasswordComponent>

    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-card class="elevation-6" min-height="500">
          <v-row>
            <v-col
              cols="12"
              sm="6"
              style="background-color: #081D38;height: 500px; "
              class="rounded-bl-xl elevation-10 hidden-sm-and-down"
            >
              <div style="text-align: center; padding: 180px 0">
                <v-card-text class="white--text">
                  <!-- <h4 class="mt-3">نــظــام طـلـب دفــاتـر الــصـكـوك</h4> -->
                </v-card-text>
              </div>
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-column-reverse">
              <v-card-text class=" ">
                <h3 class="text-center">
                  تسجيل الدخول
                </h3>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="10">
                      <v-text-field
                        prepend-inner-icon="person"
                        dense
                        name="Email"
                        persistent-placeholder
                        label="رقم الوطيفي أو بريد الإلكتروني"
                        type="text"
                        color="accent-3"
                        v-model="userName"
                        persistent-hint
                        :rules="[validationInput.isEmpty, validationCheck]"
                        :aria-autocomplete="false"
                        style="color: blue !important"
                        class="mt-12"
                      />

                      <v-text-field
                        :type="hidePassword ? 'password' : 'text'"
                        :append-icon="
                          hidePassword ? 'visibility_off' : 'visibility'
                        "
                        prepend-inner-icon="lock"
                        persistent-hint
                        persistent-placeholder
                        label="كلمة المرور"
                        name="Password"
                        dense
                        :aria-autocomplete="false"
                        id="password"
                        :rules="passwordRules"
                        v-model="password"
                        class="mt-6"
                        style="color: blue !important"
                        @click:append="hidePassword = !hidePassword"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn
                        block
                        dark
                        rounded
                        class="mb-10 mt-3"
                        elevation="10"
                        color="#081D38"
                        @click="signin"
                        :loading="loading"
                        >تسجيل الدخول</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-avatar size="150" color="#081D38">
                    <v-icon size="100" color="white">
                      lock
                    </v-icon>
                  </v-avatar>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import { EventBus } from "../../../eventBus";
import resetPasswordComponent from "../components/resetPasswordComponents.vue";
import { validationInput } from "../../../models/validationInput";
export default {
  components: {
    resetPasswordComponent: resetPasswordComponent,
  },
  created() {
    EventBus.$on("closeResetPasswordDialog", () => {
      this.dialogResetPassword = false;
    });
    // this.GetXAntiForgery();
  },
  data() {
    return {
      hidePassword: true,
      valid: false,
      validationInput: validationInput,
      loading: false,
      badPassUser: false,
      dialogResetPassword: false,
      nameRules: [
        (v) => !!v || "الرجاء إدخال بريد الإلكتروني أو رقم الوظيفي",
        (v) => (v && v.length >= 3) || "يجب إدخال بطريقة الصحيحة",
      ],
      passwordRules: [
        (v) => !!v || "الرجاء إدخال كلمة المرور",
        (v) => (v && v.length >= 4) || "يجب إدخال كلمة المرور بطريقة الصحيحة",
      ],
      userName: "",
      password: "",
    };
  },
  props: {
    srcse: String,
  },
  methods: {
    ...mapActions({
      loginUser: "auth/login",
      setTokenLoginUser: "auth/SetTokenLoginUser",
      getXAntiForgery: "auth/GetXAntiForgery",
    }),

    validationCheck(val) {
      let message = "يجب إدخال بطريقة صجيجة";
      var numberOnly = /^[0-9]*$/.test(val);
      var english = /^[A-Za-z0-9]*$/.test(val);
      var emile =
        //eslint-disable-next-line
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          //eslint-disable-next-line
          val
        );
      if (numberOnly) {
        message = "";
      }
      if (emile) {
        message = "";
      }
      if (english) {
        message = "";
      }

      return !message ? true : message;
    },
    GetXAntiForgery() {
      this.getXAntiForgery()
        .then(() => {
          
        })
        .catch((error) => {
          this.$store.dispatch("loading", false);
          this.notify(error, "#1d262d");
        });
    },

    signin() {
      this.loading = true;
      this.$store.dispatch("loading", true);
      if (this.$refs.form.validate()) {
        this.loginUser({
          nameOrNumber: this.userName,
          password: this.password,
        })
          .then(() => {
            this.nextPage();
          })
          .catch((error) => {
            this.$store.dispatch("loading", false);
            this.notify(error, "#1d262d");
            this.badPassUser = true;
            this.loading = false;
          });
      } else {
        this.$store.dispatch("loading", false);
        this.loading = false;
      }
    },

    nextPage() {
      var currentUser = this.$store.getters["auth/getInfo"];
      if (currentUser?.isFirstLogin == null) {
        this.setTokenLoginUser(currentUser);
        this.$router.push("/").catch(() => {});
        this.$store.dispatch("loading", false);
        this.loading = false;
        return;
      }
      if (currentUser?.isFirstLogin == false) {
        this.dialogResetPassword = true;
        this.$store.dispatch("loading", false);
        this.loading = false;
        return;
      }

      if (currentUser?.isFirstLogin == true) {
        this.setTokenLoginUser(currentUser);
        this.$router.push("/").catch(() => {});
        this.$store.dispatch("loading", false);
        this.loading = false;
        return;
      }
    },
    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>
<style scoped>
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
.rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
</style>
