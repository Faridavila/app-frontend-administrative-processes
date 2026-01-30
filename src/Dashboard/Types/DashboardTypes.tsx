export interface SalesTodayDTO {
  value: number;
}

export interface PendingDeliveriesDTO {
  total: number;
  urgent: number;
}

export interface PendingInvoicesDTO {
  total: number;
  urgent: number;
}

export interface DashboardMetricsDTO {
  salesToday: SalesTodayDTO;
  pendingDeliveries: PendingDeliveriesDTO;
  pendingInvoices: PendingInvoicesDTO;
}

export interface ClientStatsDTO {
  total: number;
  pendingInvoices: number;
}

export interface InventoryStatsDTO {
  total: number;
  lowStock: number;
}

export interface PayrollStatsDTO {
  employees: number;
  pendingPayroll: boolean;
}

export interface DeliveryStatsDTO {
  total: number;
  pendingToday: number;
}

export interface SupplierStatsDTO {
  total: number;
  overdueOrders: number;
}

export interface DashboardModulesDTO {
  inventory: InventoryStatsDTO;
  payroll: PayrollStatsDTO;
  deliveries: DeliveryStatsDTO;
  suppliers: SupplierStatsDTO;
  clients: ClientStatsDTO;
}

export interface DashboardResponseDTO {
  metrics: DashboardMetricsDTO;
  modules: DashboardModulesDTO;
}