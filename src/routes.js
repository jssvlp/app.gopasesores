/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.jsx";
import Login from "views/Login/login";
import Client from "views/Clients/clients";
import Employees from "views/Employees/employees";
import Security from "views/security/security";
import InsurancesTab from "views/insurencesTab/insurencesTab";
import Polices from "views/polices/polices";
import Sinisters from 'views/Sinisters/sinisters'
import Payments from 'views/Payments/payment';

var routes = [
  {
    path: "/dashboard",
    layout: "/admin",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    show:true
  },
  {
    path: "/clients",
    layout: "/admin",
    name: "Clientes",
    icon: "pe-7s-user",
    component: Client,
    show:true
  },
  {
    path: "/employees",
    layout: "/admin",
    name: "empleados/comisionistas ",
    icon: "pe-7s-users",
    component: Employees,
    show:true
  },
  {
    path: "/insurances",
    layout: "/admin",
    name: "Aseguradoras",
    icon: "pe-7s-portfolio",
    component: InsurancesTab,
    show:true
  },

  {
    path: "/polices",
    layout: "/admin",
    name: "Polizas",
    icon: "pe-7s-shield",
    component: Polices,
    show:true
  },
  {
    path: "/sinisters",
    layout: "/admin",
    name: "Siniestros",
    icon: "pe-7s-car",
    component: Sinisters,
    show:true
  },
  {
    path: "/security",
    layout: "/admin",
    name: "Seguridad",
    icon: "pe-7s-unlock",
    component: Security,
    show:true
  },
  {
    path: "/payments",
    layout: "/admin",
    component: Payments,
    name: "pagos",
    show:false
  },

  {
    path: "/login-page",
    layout: "/auth",
    component: Login,
    show:false
  },
];
export default routes;
