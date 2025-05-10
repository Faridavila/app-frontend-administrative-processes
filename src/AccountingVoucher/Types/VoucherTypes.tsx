export interface ComprobanteTypes {
  id: number; // ID numérico
  cuentaContable: string; // Cuenta contable (Alfanumérico)
  tercero: string; // Tercero (Alfanumérico)
  detalleContable: string; // Detalle contable (Alfanumérico)
  consecutivo: string; // Consecutivo (Alfanumérico)
  descripcion: string; // Descripción (Alfanumérico)
  centroCosto: string; // Centro de costo (Alfanumérico)
  debito: number; // Débito (Numérico)
  credito: number; // Crédito (Numérico)
  fechaElaboracion: Date; // Fecha de elaboración (Fecha)
  moneda: string; // Moneda (Alfanumérico)
}
