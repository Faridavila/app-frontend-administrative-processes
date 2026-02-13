import React from "react";
import ReactDOM from "react-dom/client";
import { LoadingProvider } from "./GeneralComponents/GeneralCrud/LoadingContext.tsx";
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
import ForgotPassword from "./Login/Components/ForgotPassword.tsx";
import LoginPage from "./Login/Components/login.tsx";
import Dashboard from "./Dashboard/Components/Dashboard.tsx";
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
import SuppliersCRUD from "./Suppliers/Components/Suppliers.tsx";
import InventoryCRUD from "./Inventory/Components/InventoryCRUD.tsx";
import InventoryHistory from "./InventoryHistory/Components/InventoryHistory.tsx";
import ShoppingSuppliers from "./ShoppingSuppliers/Components/ShoppingSuppliers.tsx";
import SupplierPendingProduct from "./SupplierPendingProducts/Components/SupplierPendingProduct.tsx";
import EmployeeCRUD from "./Employee/Components/Employee.tsx";
import EmployeePayment from "./EmployeePayments/Components/EmployeePayment.tsx";
import EmployeeHistoryCRUD from "./EmployeeHistory/Components/EmployeeHistory.tsx";
import SupplierRateCRUD from "./SupplierRate/Components/SupplierRate.tsx";
import NeighborhoodRateCRUD from "./NeighborhoodRate/Components/NeighborhoodRate.tsx";
import PendingOrder from "./PendingOrder/Components/PendingOrder.tsx";
import CompleteOrderHistory from "./CompleteOrderHistory/Components/CompleteOrderHistory.tsx";
import AssignOrder from "./AssignOrder/Components/AssignOrder.tsx";
import InvoiceCrud from "./InvoiceCrud/Components/InvoiceCrud.tsx";
import Calculator from "./Calculator/Calculator.tsx";
import InvoiceDetail from "./InvoicePOS/Components/InvoiceDetail.tsx";
import TerminalCRUD from "./Terminal/Components/Terminal.tsx";
import WarehouseRelocation from "./WarehouseRelocation/Components/WarehouseRelocation.tsx";

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
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/config",
        element: <CompanyPresentation />,
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

      {
        path: "/user",
        element: <UserCRUD />,
      },
      {
        path: "/client",
        element: <ClientCRUD />,
      },
      {
        path: "/category",
        element: <CategoryCRUD />,
      },

      {
        path: "/product",
        element: <ProductCRUD />,
      },
      {
        path: "/inventory",
        element: <InventoryCRUD />,
      },

      {
        path: "/inventory-history",
        element: <InventoryHistory />,
      },
      {
        path: "/warehouse",
        element: <WarehouseForm />,
      },

      {
        path: "/supplier",
        element: <SuppliersCRUD />,
      },
      {
        path: "/purchase-supplier",
        element: <ShoppingSuppliers />,
      },
      {
        path: "/pending-product",
        element: <SupplierPendingProduct />,
      },
      {
        path: "/employee",
        element: <EmployeeCRUD />,
      },
      {
        path: "/employee-payment",
        element: <EmployeePayment />,
      },
      {
        path: "/employee-history",
        element: <EmployeeHistoryCRUD />,
      },
      {
        path: "/supplier-rate",
        element: <SupplierRateCRUD />,
      },
      {
        path: "/neighborhood-rate",
        element: <NeighborhoodRateCRUD />,
      },
      {
        path: "/warehouse-relocation",
        element: <WarehouseRelocation />,
      },
      {
        path: "/assign-order",
        element: <AssignOrder />,
      },
      {
        path: "/pending-order",
        element: <PendingOrder />,
      },
      {
        path: "/complete-order",
        element: <CompleteOrderHistory />,
      },
      {
        path: "/invoice",
        element: <InvoiceCrud />,
      },
      {
        path: "/new-invoice",
        element: <InvoicePOS />,
      },
      {
        path: "/invoice-detail/:id",
        element: <InvoiceDetail />,
      },
      {
        path: "/payment-method",
        element: <PaymentMethodCRUD />,
      },
      {
        path: "/numeration",
        element: <NumerationCRUD />,
      },

      {
        path: "/terminal",
        element: <TerminalCRUD />,
      },

      {
        path: "/department",
        element: <DepartmentCRUD />,
      },

      {
        path: "/city",
        element: <CityCRUD />,
      },

      {
        path: "/calendar",
        element: <CalendarComponent />,
      },
      {
        path: "/calculator",
        element: <Calculator />,
      },

      ///otros
      {
        path: "/seller",
        element: <SellerCRUD />,
      },
      {
        path: "/cashRegister",
        element: <CashRegisterCRUD />,
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
        path: "currencyType",
        element: <CurrencyTipeCRUD />,
      },

      {
        path: "/Solicitud",
        element: <SolicitudForm />,
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
        path: "/configCompany",
        element: <CompanyCRUD />,
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
        path: "/Registrarproducto",
        element: <RegistroProductoWizard />,
      },

      {
        path: "/taxConfiguration",
        element: <TaxConfigurationCRUD />,
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
        path: "/menu",
        element: <MenuCRUD />,
      },
      {
        path: "/menuType",
        element: <MenuTypeCRUD />,
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
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  </React.StrictMode>
);