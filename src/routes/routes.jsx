import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import TransactionsPage from "../pages/TransactionsPage";
import AccountsPage from "../pages/AccountsPage";
import BudgetsPage from "../pages/BudgetsPage";
import SignoutPage from "../pages/SignoutPage";
import Mainlayout from "../layouts/Mainlayout";
import LoginPage from "../pages/LoginPage";
import AuthLayout from "../layouts/AuthLayout";
import SignupPage from "../pages/SignupPage";


export const router = createBrowserRouter([
    {
        path:'/',
        element:<Mainlayout/>,
        children:[
            {
                path:'',
                element:<DashboardPage/>
            },
            {
                path:'transactions',
                element:<TransactionsPage/>
            },{
                path:'accounts',
                element:<AccountsPage/>
            },{
                path:'budgets',
                element:<BudgetsPage/>
            },{
                path:'signout',
                element:<SignoutPage/>
            },

        ]
    },
    {
        path:'/auth',
        element:<AuthLayout/>,
        children:[
            {
                path:'login',
                element:<LoginPage/>
            },
            {
                path:'signup',
                element:<SignupPage/>
            }
        ]
    }
])