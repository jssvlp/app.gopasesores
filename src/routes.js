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

var routes = [
  {
    path: "/dashboard",
    layout: "/admin",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
  },
  {
    path: "/clients",
    layout: "/admin",
    name: "Clientes",
    icon: "pe-7s-user",
    component: Client,
  },
  {
    path: "/employees",
    layout: "/admin",
    name: "empleados/comisionistas ",
    icon: "pe-7s-users",
    component: Employees,
  },
  {
    path: "/insurances",
    layout: "/admin",
    name: "Aseguradoras",
    icon: "pe-7s-portfolio",
    component: InsurancesTab,
  },

  {
    path: "/polices",
    layout: "/admin",
    name: "Polizas",
    icon: "pe-7s-shield",
    component: Polices,
  },
  {
    path: "/sinisters",
    layout: "/admin",
    name: "Siniestros",
    icon: "pe-7s-car",
    component: Sinisters,
  },
  {
    path: "/security",
    layout: "/admin",
    name: "Seguridad",
    icon: "pe-7s-unlock",
    component: Security,
  },

  {
    path: "/login-page",
    layout: "/auth",
    component: Login,
  },
];
export default routes;
