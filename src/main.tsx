import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "../app-assets/css/bootstrap.min.css";
import "../app-assets/css/colors.min.css";
import "../app-assets/css/components.min.css";
import "../app-assets/css/plugins/extensions/ext-component-context-menu.min.css";

import Layout from "./Layout.tsx";
import DepartmentCRUD from "./Department/Components/Department.tsx";
import CompanyPresentation from "./Company/Components/InfoCompany.tsx";
import BranchCRUD from "./Branch/Components/BranchComponents.tsx";
import EconomicActivityCRUD from "./EconomicActivity/Components/EconomicActivityComponents.tsx";
import CategoryCRUD from "./Category/Components/CategoryComponents.tsx";
import CityCRUD from "./City/Components/City.tsx";
import CurrencyTipeCRUD from "./CurrencyType/Components/CurrencyType.tsx";
import ForgotPassword from "./Login/ForgotPassword.tsx";
import AuthCRUD from "./Auth/Components/Auth.tsx";
import LoginPage from "./Login/login.tsx";
import Home from "./Home/Home.tsx";
import SolicitudForm from "./RadicarSolicitud/Components/SolicitudForm.tsx";
import WarehouseForm from "./Warehouse/Components/WarehouseForm.tsx";
import RegistroProductoWizard from "./RegistrarProducto/Components/RegistrarProducto.tsx";
import CalendarComponent from "./Calendar/CalendarComponent.tsx";
import UserCRUD from "./User/Components/UserComponents.tsx";
import ParameterTypeCRUD from "./ParameterType/Components/ParameterType.tsx";
import ParameterCRUD from "./Parameter/Components/Parameter.tsx";
import CompanyCRUD from "./Company/Components/CompanyCRUD.tsx";
import MenuCRUD from "./Menu/Components/Menu.tsx";
import MenuTypeCRUD from "./Menu/Components/MenuType.tsx";
import AreaCRUD from "./Area/Components/Area.tsx";
import RolCRUD from "./Rol/Components/Rol.tsx";
import PositionCRUD from "./Position/Components/Position.tsx";
import InvoicePOS from "./InvoicePOS/Components/InvoicePOS.tsx";
import FacturacionPOSModal from "./InvoicePOS/Components/generate-invoice.tsx";
import FormularioInventoryAdjustmentCRUD from "./InventoryAdjustmentTypes/Components/InventoryAdjustmentCRUD.tsx";
import FileManagerApp from "./FileManager/Components/FileManagerApp.tsx";
import FormularioWarehouseCRUD from "./WarehouseType/Components/FormWarehouseTypesCRUD.tsx";
import NumerationCRUD from "./Numeration/Components/NumerationCRUD.tsx";
import TaxConfigurationCRUD from "./TaxConfiguration/Components/TaxConfigurationCRUD.tsx";
import CashRegisterCRUD from "./CashRegister/Components/CashRegisterCRUD.tsx";
import ClientCRUD from "./Client/Components/ClientCRUD.tsx";
import PaymentMethodCRUD from "./PaymentMethod/Components/PaymentMethodCRUD.tsx";
import SellerCRUD from "./Seller/Components/SellerCRUD.tsx";
import ProductCRUD from "./Product/Components/ProductCRUD.tsx";
import DiscountTypeCRUD from "./DiscountType/Components/DiscountTypeCRUD.tsx";
import DiscountCRUD from "./Discount/Components/DiscountCRUD.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/paymentMethod",
        element: <PaymentMethodCRUD />,
      },
      {
        path: "/seller",
        element: <SellerCRUD />,
      },
      {
        path: "/client",
        element: <ClientCRUD />,
      },
      {
        path: "/cashRegister",
        element: <CashRegisterCRUD />,
      },  
      {
        path: "/inventory",
        element: <ProductCRUD />,
      },
      {
        path: "/department",
        element: <DepartmentCRUD />,
      },
      {
        path: "/discount",
        element: <DiscountCRUD />,
      },
      {
        path: "/discountType",
        element: <DiscountTypeCRUD />,
      },
      {
        path: "/company",
        element: <CompanyPresentation />,
      },
      {
        path: "/configCompany",
        element: <CompanyCRUD />,
      },
      {
        path: "/economicActivity",
        element: <EconomicActivityCRUD />,
      },
      {
        path: "branch",
        element: <BranchCRUD />,
      },
      {
        path: "/category",
        element: <CategoryCRUD />,
      },
      {
        path: "/city",
        element: <CityCRUD />,
      },
      {
        path: "currencyType",
        element: <CurrencyTipeCRUD />,
      },
   
      
      {
        path: "/auth",
        element: <AuthCRUD />,
      },

      {
        path: "/Solicitud",
        element: <SolicitudForm />,
      },
      {
        path: "/tipos-bodega",
        element: <FormularioWarehouseCRUD />,
      },
      {
        path: "/ajustes-inventario",
        element: <FormularioInventoryAdjustmentCRUD />,
      },
      {
        path: "/file-manager",
        element: <FileManagerApp />,
      },

      {
        path: "/Solicitud",
        element: <SolicitudForm />,
      },
      {
        path: "/Registrarproducto",
        element: <RegistroProductoWizard />,
      },
      {
        path: "/CalendarComponent",
        element: <CalendarComponent />,
      },
      {
        path: "/FacturaComponent",
        element: <InvoicePOS />,
      },
      {
        path: "/FacturaPoputComponent",
        element: <FacturacionPOSModal />,
      },
      {
        path: "/numeration",
        element: <NumerationCRUD />,
      },
      {
        path: "/taxConfiguration",
        element: <TaxConfigurationCRUD />,
      },

      {
        path: "/user",
        element: <UserCRUD />,
      },
      {
        path: "/ParameterType",
        element: <ParameterTypeCRUD />,
      },
      {
        path: "/Parameter",
        element: <ParameterCRUD />,
      },
      {
        path: "/bodega",
        element: <WarehouseForm />,
      },

      {
        path: "/menu",
        element: <MenuCRUD />,
      },
      {
        path: "/menuType",
        element: <MenuTypeCRUD />,
      },
      {
        path: "/area",
        element: <AreaCRUD />,
      },
      {
        path: "/rol",
        element: <RolCRUD />,
      },
      {
        path: "/position",
        element: <PositionCRUD />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
