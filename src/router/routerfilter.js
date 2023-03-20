import router from "./index";
import store from "../store";

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  await store.dispatch("loading", true);

  let hasToken = await store.dispatch("auth/tryAutoLogin").catch(() => {
    return false;
  });

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
      await store.dispatch("loading", false);
    } else {
      try {
        next();
      } catch (error) {
        console.log(error);
        store.dispatch("auth/logout");
        next(`/login?redirect=${to.path}`);
        await store.dispatch("loading", false);
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      await store.dispatch("loading", false);
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      await store.dispatch("loading", false);
    }
  }
});

router.afterEach(async () => {
  await store.dispatch("loading", false);
});
