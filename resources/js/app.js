import "../css/app.css";
import "../js/Assets/css/main.css";
import "../js/Assets/css/animate.min.css";
import "./bootstrap";
import "vue3-easy-data-table/dist/style.css";

import Vue3EasyDataTable from "vue3-easy-data-table";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import NProgress from "nprogress";
import { router } from "@inertiajs/vue3";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .component("EasyDataTable", Vue3EasyDataTable)
            .mount(el);
    },
    progress: {
        color: "#4B5563",
    },
});

router.on("start", () => {
    NProgress.start();
});

router.on("finish", () => {
    NProgress.done();
});
