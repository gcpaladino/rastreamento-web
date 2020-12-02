import AdminLayout from "@/pages/Layout/AdminLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Devices from "@/pages/Devices.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import AuthSignin from "@/pages/AuthSignIn.vue";

const routes = [
  {
    path: "/",
    component: AuthSignin,
    name: 'Auth Signin',
  },
  {
    path: "/admin",
    component: AdminLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "/devices",
        name: "Aparelhos",
        component: Devices
      },
      {
        path: "/report",
        name: "Relatórios",
        component: TableList
      },
      {
        path: "/typography",
        name: "Typography",
        component: Typography
      },
      {
        path: "/icons",
        name: "Icons",
        component: Icons
      },
      {
        path: "/location",
        name: "Localização",
        meta: {
          hideFooter: true
        },
        component: Maps
      },
      {
        path: "/notifications",
        name: "Notifications",
        component: Notifications
      }
    ]
  }
];

export default routes;
