import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiUser,
  FiMessageSquare,
  FiShoppingCart,
  FiChevronLeft,
  FiUserPlus,
} from "react-icons/fi";
import { Button, Modal, Form, Row, Col, Spinner } from "react-bootstrap";
import { GetAllProductNoPage } from "../Product/API/ProductAPI";
import { GetAllClientNoPage, CreateClient } from "../Client/API/ClientAPI";
import { GetAllPaymentMethodNoPage } from "../PaymentMethod/API/PaymentMethodAPI";
import { GetAllCategoryNoPage } from "../Category/API/Category";
import { CreateInvoice } from "../InvoicePOS/API/InvoiceApi";
import { Client, NewClientData } from "../InvoicePOS/Types/InvoiceType";
import InvoicePDF, { PDFInvoiceConfig } from "../Hooks/useInvoicePDF";
import { GetCompanyById } from "../Company/API/CompanyAPI";
import { CompanyType } from "../Company/Types/Company";
import { GenerateInvoiceType } from "../InvoicePOS/Types/GenerateInvoice";
import IdentificationTypeSelect from "../Client/Components/IdentificationTypeSelect";
import PersonTypeSelect from "../Client/Components/TypePersonSelect";
import TaxLiabilitySelect from "../Client/Components/TaxLiabilitySelect";
import CitySelect from "../NeighborhoodRate/Components/SelectCity";
import DepartmentSelect from "../NeighborhoodRate/Components/SelectDepartment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./QuickSale.css";

const MySwal = withReactContent(Swal);

interface POSProducto {
  id: number;
  productId: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoriaId?: number;
  codigo: string;
}

interface LineaCarrito {
  producto: POSProducto;
  cantidad: number;
  comentario: string;
  mostrarComentario: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

const getDateTime = (): string => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
  );
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

const VentaEnCaja: React.FC = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<POSProducto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [carrito, setCarrito] = useState<LineaCarrito[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Client | null>(
    null,
  );
  const [metodoPago, setMetodoPago] = useState<number>(0);
  const [generando, setGenerando] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [mostrarSelectorCliente, setMostrarSelectorCliente] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  const [invoiceConfig, setInvoiceConfig] = useState<PDFInvoiceConfig | null>(
    null,
  );
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);

  // ── Modal crear cliente ──────────────────────────────────────────
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [guardandoCliente, setGuardandoCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<NewClientData>({
    id: 0,
    name: "",
    typeIdentificationId: 0,
    identificationType: "",
    identification: 0,
    verificationDigit: 0,
    personTypeId: 0,
    personType: "",
    taxLiabilityId: 0,
    taxLiability: "",
    departmentId: 0,
    departmentName: "",
    municipalityId: 0,
    municipality: "",
    neighborhood: "",
    address: "",
    email: "",
    phone: "",
    status: "",
  });
  const [erroresCliente, setErroresCliente] = useState<
    Partial<Record<keyof NewClientData, string>>
  >({});

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (uid) setCurrentUserId(parseInt(uid, 10));
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prods, cats, clts, pms, company] = await Promise.all([
        GetAllProductNoPage(),
        GetAllCategoryNoPage(),
        GetAllClientNoPage(),
        GetAllPaymentMethodNoPage(),
        GetCompanyById(1),
      ]);
      if (company) setCompanyData(company);
      if (prods)
        setProductos(
          prods.map((p: any) => ({
            id: p.id,
            productId: p.id,
            nombre: p.productName || p.name || "Producto",
            precio: p.price || p.salePrice || 0,
            imagen: p.image || p.imageUrl || null,
            categoriaId: p.categoryId ?? p.category?.id ?? null,
            codigo: p.code || p.barCode || String(p.id),
          })),
        );
      if (cats)
        setCategorias(
          cats
            .filter((c: any) => c.status === "ACTIVE")
            .map((c: any) => ({ id: c.id, nombre: c.nameCategory })),
        );
      if (clts) {
        const clientesMapeados = clts.map((c: any) => ({
          ...c,
          cityName: c.neighborhood || "",
        }));
        setClientes(clientesMapeados);
        const consumidorFinal = clientesMapeados.find((c: any) =>
          c.name?.toLowerCase().includes("consumidor final"),
        );
        if (consumidorFinal) setClienteSeleccionado(consumidorFinal);
      }
      if (pms)
        setPaymentMethods(
          pms
            .filter((m: any) => m.status === "ACTIVE")
            .map((m: any) => ({ id: m.id, description: m.description })),
        );
    } catch {
      MySwal.fire("Error", "No se pudieron cargar los datos", "error");
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = useMemo(
    () =>
      productos.filter((p) => {
        const mb =
          !busqueda ||
          p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.codigo.toLowerCase().includes(busqueda.toLowerCase());
        const mc =
          categoriaActiva === null || p.categoriaId === categoriaActiva;
        return mb && mc;
      }),
    [productos, busqueda, categoriaActiva],
  );

  const clientesFiltrados = useMemo(() => {
    if (!busquedaCliente) return clientes.slice(0, 8);
    return clientes
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
          String(c.identification || "").includes(busquedaCliente),
      )
      .slice(0, 8);
  }, [clientes, busquedaCliente]);

  const agregarAlCarrito = useCallback((producto: POSProducto) => {
    setCarrito((prev) => {
      const idx = prev.findIndex((l) => l.producto.id === producto.id);
      if (idx >= 0) {
        const c = [...prev];
        c[idx] = { ...c[idx], cantidad: c[idx].cantidad + 1 };
        return c;
      }
      return [
        ...prev,
        { producto, cantidad: 1, comentario: "", mostrarComentario: false },
      ];
    });
  }, []);

  const cambiarCantidad = (id: number, delta: number) =>
    setCarrito((prev) =>
      prev
        .map((l) =>
          l.producto.id === id ? { ...l, cantidad: l.cantidad + delta } : l,
        )
        .filter((l) => l.cantidad > 0),
    );

  const eliminarLinea = (id: number) =>
    setCarrito((prev) => prev.filter((l) => l.producto.id !== id));

  const toggleComentario = (id: number) =>
    setCarrito((prev) =>
      prev.map((l) =>
        l.producto.id === id
          ? { ...l, mostrarComentario: !l.mostrarComentario }
          : l,
      ),
    );

  const setComentario = (id: number, texto: string) =>
    setCarrito((prev) =>
      prev.map((l) => (l.producto.id === id ? { ...l, comentario: texto } : l)),
    );

  const limpiarCarrito = () =>
    MySwal.fire({
      title: "¿Limpiar carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#cc322d",
    }).then((r) => {
      if (r.isConfirmed) setCarrito([]);
    });

  const total = useMemo(
    () => carrito.reduce((s, l) => s + l.producto.precio * l.cantidad, 0),
    [carrito],
  );

  const facturar = async () => {
    if (!carrito.length)
      return MySwal.fire("Error", "Agrega al menos un producto.", "error");
    if (!metodoPago)
      return MySwal.fire("Error", "Selecciona un método de pago.", "error");
    setGenerando(true);
    try {
      const observations = carrito
        .filter((l) => l.comentario)
        .map((l) => `${l.producto.nombre}: ${l.comentario}`)
        .join(" | ");

      const invoiceData: GenerateInvoiceType = {
        customerId: clienteSeleccionado?.id || 0,
        phone: clienteSeleccionado?.phone || "",
        address: clienteSeleccionado?.address || "",
        invoiceDate: getDateTime(),
        dueDate: null,
        paymentTypeId: 1,
        paymentMethodId: metodoPago,
        deliveryType: "RECOGER",
        deliveryCost: 0,
        observations,
        totalDiscount: 0,
        total,
        userId: currentUserId,
        statusBill: "",
        subtotal: total,
        initialPayment: total,
        remainingBalance: 0,
        cashReceived: undefined,
        changeGiven: undefined,
        invoiceDetails: carrito.map((l) => ({
          productId: l.producto.productId,
          quantity: l.cantidad,
          unitPrice: l.producto.precio,
          discountPercent: 0,
          discountFixed: 0,
          totalDiscount: 0,
          subtotal: l.producto.precio * l.cantidad,
          total: l.producto.precio * l.cantidad,
        })),
      };

      const [response] = await Promise.all([
        CreateInvoice(invoiceData),
        companyData?.image
          ? new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
              img.src = companyData.image;
            })
          : Promise.resolve(),
      ]);

      setInvoiceConfig({
        companyInfo: {
          logo: companyData?.image || "",
          logoWidth: 40,
          logoHeight: 40,
          title: "DOCUMENTO NO VALIDO COMO FACTURA DE VENTA",
          direccion: companyData?.address || "",
          celular: companyData?.phone || "",
          email: companyData?.email || "",
        },
        mainInfo: {
          fecha: new Date().toLocaleString("es-CO", {
            timeZone: "America/Bogota",
          }),
          invoiceNumber: response?.invoiceNumber || `N°-${Date.now()}`,
          cashier: "Administrador",
          clientIdentification:
            clienteSeleccionado?.identification?.toString() ||
            "Sin identificación",
          cliente: clienteSeleccionado?.name || "Sin cliente",
        },
        products: carrito.map((l) => ({
          nombre: l.producto.nombre,
          cantidad: l.cantidad,
          precio: l.producto.precio,
          total: l.producto.precio * l.cantidad,
        })),
        summary: {
          valorBruto: total,
          descuentoTotal: 0,
          costoTransporte: 0,
          ibua: 0,
          total,
        },
        payment: {
          metodoPago:
            paymentMethods.find((m) => m.id === metodoPago)?.description ||
            "Desconocido",
          tipoPago: "contado",
          abono: 0,
          restante: 0,
          fechaVencimiento: "",
        },
        entrega: "RECOGER",
        observacion: observations,
        footer: {
          showGeneratedBy: true,
          generatedByText: "Hecho en Colombia por Dalyx Solutions - Cel:3172116796",
          showPageNumber: false,
        },
        fileName: `Factura_${response?.invoiceNumber || Date.now()}.pdf`,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      MySwal.fire({
        icon: "success",
        title: "¡Factura creada!",
        text: `Total: ${fmt(total)}`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Restaurar consumidor final por defecto
      const consumidorFinal = clientes.find((c) =>
        c.name?.toLowerCase().includes("consumidor final"),
      );
      setCarrito([]);
      setClienteSeleccionado(consumidorFinal || null);
      setMetodoPago(0);
    } catch (error: any) {
      MySwal.fire(
        "Error",
        error?.message || "No se pudo crear la factura",
        "error",
      );
    } finally {
      setGenerando(false);
    }
  };

  // ── Validación / guardar cliente ─────────────────────────────────
  const validarCampoCliente = (
    key: keyof NewClientData,
    value: any,
  ): string | null => {
    if (key === "name" && (!value || String(value).trim() === ""))
      return "El nombre es obligatorio.";
    if (key === "phone" && (!value || String(value).trim() === ""))
      return "El teléfono es obligatorio.";
    const esNIT = String(nuevoCliente.typeIdentificationId) === "6";
    if (esNIT) {
      if (
        key === "verificationDigit" &&
        (value === null || value === undefined || value < 0 || value > 9)
      )
        return "El dígito de verificación debe ser entre 0 y 9.";
      if (key === "personTypeId" && (!value || value === 0))
        return "El tipo de persona es obligatorio para NIT.";
      if (key === "taxLiabilityId" && (!value || value === 0))
        return "La responsabilidad tributaria es obligatoria para NIT.";
    }
    return null;
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof NewClientData;
    setNuevoCliente((prev) => ({ ...prev, [key]: value }));
    const error = validarCampoCliente(key, value);
    setErroresCliente((prev) => ({ ...prev, [key]: error || undefined }));
  };

  const handleClienteFieldUpdate = (update: Partial<NewClientData>) => {
    setNuevoCliente((prev) => ({ ...prev, ...update }));
    Object.keys(update).forEach((key) => {
      const campo = key as keyof NewClientData;
      const error = validarCampoCliente(campo, update[campo]);
      setErroresCliente((prev) => ({ ...prev, [campo]: error || undefined }));
    });
  };

  const abrirModalCliente = () => {
    setNuevoCliente({
      id: 0,
      name: "",
      typeIdentificationId: null as any,
      identificationType: "",
      identification: null as any,
      verificationDigit: null as any,
      personTypeId: null as any,
      personType: "",
      taxLiabilityId: null as any,
      taxLiability: "",
      departmentId: null as any,
      departmentName: "",
      municipalityId: null as any,
      municipality: "",
      neighborhood: "",
      address: "",
      email: "",
      phone: "",
      status: "",
    });
    setErroresCliente({});
    setMostrarModalCliente(true);
  };

  const guardarCliente = async () => {
    const nuevosErrores: Partial<Record<keyof NewClientData, string>> = {};
    let valido = true;
    for (const campo of ["name", "phone"] as (keyof NewClientData)[]) {
      const error = validarCampoCliente(campo, nuevoCliente[campo]);
      if (error) {
        nuevosErrores[campo] = error;
        valido = false;
      }
    }
    if (!valido) {
      setErroresCliente(nuevosErrores);
      MySwal.fire(
        "Error",
        "Por favor completa todos los campos obligatorios.",
        "error",
      );
      return;
    }
    setGuardandoCliente(true);
    try {
      const clienteCreado = await CreateClient(nuevoCliente);
      const clienteFormateado: Client = {
        ...clienteCreado,
        cityName: clienteCreado.neighborhood || "",
      };
      const clientesActualizados = [clienteFormateado, ...clientes];
      setClientes(clientesActualizados);
      // Seleccionarlo automáticamente
      setClienteSeleccionado(clienteFormateado);
      MySwal.fire({
        icon: "success",
        title: "¡Cliente creado!",
        text: `${clienteCreado.name} creado y seleccionado`,
        timer: 2000,
        showConfirmButton: false,
      });
      setMostrarModalCliente(false);
    } catch (error: any) {
      MySwal.fire(
        "Error",
        error?.message || "No se pudo crear el cliente.",
        "error",
      );
    } finally {
      setGuardandoCliente(false);
    }
  };

  const esNIT = String(nuevoCliente.typeIdentificationId) === "6";

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid p-0">
        <div className="content-body">
          <div className="qs-root">
            <div className="qs-header">
              <div className="qs-header__title">
                <FiShoppingCart size={14} /> Venta en caja
              </div>
              <div
                className="qs-header__cliente"
                onClick={() => setMostrarSelectorCliente(true)}
              >
                <FiUser size={14} />
                Cliente:{" "}
                <strong>{clienteSeleccionado?.name || "Sin cliente"}</strong>
                <FiChevronLeft
                  size={12}
                  style={{ transform: "rotate(180deg)" }}
                />
              </div>
              <button
                className="qs-modal__add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMostrarSelectorCliente(false);
                  abrirModalCliente();
                }}
                title="Crear nuevo cliente"
              >
                <FiUserPlus size={18} />
              </button>
            </div>

            {/* BODY: catálogo izq + carrito der */}
            <div className="qs-body">
              {/* ── CATÁLOGO ── */}
              <div className="qs-catalog">
                <div className="qs-search">
                  <FiSearch size={14} className="qs-search__icon" />
                  <input
                    className="qs-search__input"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <button
                      className="qs-search__clear"
                      onClick={() => setBusqueda("")}
                    >
                      <FiX size={13} />
                    </button>
                  )}
                  {categoriaActiva !== null && (
                    <button
                      className="qs-filter-clear"
                      onClick={() => {
                        setCategoriaActiva(null);
                        setBusqueda("");
                      }}
                    >
                      Eliminar filtros
                    </button>
                  )}
                </div>

                {/* Chips categoría */}
                <div className="qs-cats">
                  <button
                    className={`qs-chip ${categoriaActiva === null ? "qs-chip--active" : ""}`}
                    onClick={() => setCategoriaActiva(null)}
                  >
                    Todos
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      className={`qs-chip ${categoriaActiva === cat.id ? "qs-chip--active" : ""}`}
                      onClick={() =>
                        setCategoriaActiva(
                          categoriaActiva === cat.id ? null : cat.id,
                        )
                      }
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>

                <div className="qs-divider" />

                {/* Grid */}
                {cargando ? (
                  <div className="qs-loading">
                    <div className="qs-spinner" /> Cargando...
                  </div>
                ) : (
                  <div className="qs-grid">
                    {productosFiltrados.length === 0 ? (
                      <div className="qs-grid__empty">
                        <FiSearch size={28} />
                        <p>Sin resultados</p>
                      </div>
                    ) : (
                      productosFiltrados.map((prod) => (
                        <button
                          key={prod.id}
                          className="qs-card"
                          onClick={() => agregarAlCarrito(prod)}
                        >
                          <div className="qs-card__img">
                            {prod.imagen ? (
                              <img src={prod.imagen} alt={prod.nombre} />
                            ) : (
                              <span>🖼</span>
                            )}
                          </div>
                          <div className="qs-card__info">
                            <span className="qs-card__name">{prod.nombre}</span>
                            <span className="qs-card__price">
                              {fmt(prod.precio)}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* ── CARRITO ── */}
              <div className="qs-cart">
                <div className="qs-cart__header">
                  <span className="qs-cart__title">Productos agregados</span>
                  <span className="qs-cart__badge">{fmt(total)}</span>
                </div>

                <div className="qs-cart__cols">
                  <span>Nombre</span>
                  <span>Cantidad</span>
                  <span>Precio</span>
                </div>

                <div className="qs-cart__lines">
                  {carrito.length === 0 ? (
                    <div className="qs-cart__empty">
                      <FiShoppingCart size={26} />
                      <p>No se encontraron productos agregados</p>
                    </div>
                  ) : (
                    carrito.map((linea) => (
                      <div key={linea.producto.id} className="qs-line">
                        <div className="qs-line__top">
                          <div className="qs-line__info">
                            <span className="qs-line__name">
                              {linea.producto.nombre}
                            </span>
                          </div>
                          <div className="qs-qty">
                            <button
                              className="qs-qty__btn"
                              onClick={() =>
                                cambiarCantidad(linea.producto.id, -1)
                              }
                            >
                              <FiMinus size={11} />
                            </button>
                            <input
                              className="qs-qty__val"
                              type="number"
                              min="1"
                              value={linea.cantidad}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                  setCarrito((prev) =>
                                    prev.map((l) =>
                                      l.producto.id === linea.producto.id
                                        ? { ...l, cantidad: val }
                                        : l,
                                    ),
                                  );
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                            />
                            <button
                              className="qs-qty__btn"
                              onClick={() =>
                                cambiarCantidad(linea.producto.id, 1)
                              }
                            >
                              <FiPlus size={11} />
                            </button>
                          </div>
                          <span className="qs-line__price">
                            {fmt(linea.producto.precio * linea.cantidad)}
                          </span>
                          <div className="qs-line__acts">
                            <button
                              className={`qs-act qs-act--msg ${linea.mostrarComentario ? "on" : ""}`}
                              onClick={() =>
                                toggleComentario(linea.producto.id)
                              }
                              title="Comentario"
                            >
                              <FiMessageSquare size={12} />
                            </button>
                            <button
                              className="qs-act qs-act--del"
                              onClick={() => eliminarLinea(linea.producto.id)}
                              title="Eliminar"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </div>
                        {linea.mostrarComentario && (
                          <input
                            className="qs-comment"
                            placeholder="Comentario..."
                            value={linea.comentario}
                            onChange={(e) =>
                              setComentario(linea.producto.id, e.target.value)
                            }
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="qs-cart__footer">
                  <select
                    className="qs-select"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(Number(e.target.value))}
                  >
                    <option value={0}>Seleccionar método de pago</option>
                    {paymentMethods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.description}
                      </option>
                    ))}
                  </select>
                  <div className="qs-cart__btns">
                    {carrito.length > 0 && (
                      <button
                        className="qs-btn qs-btn--clear"
                        onClick={limpiarCarrito}
                      >
                        Limpiar
                      </button>
                    )}
                    <button
                      className="qs-btn qs-btn--invoice"
                      onClick={facturar}
                      disabled={generando || !carrito.length}
                    >
                      {generando ? (
                        <span className="qs-spinner qs-spinner--sm" />
                      ) : (
                        "Facturar"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ MODAL SELECTOR DE CLIENTE ══════════════════════════════ */}
          {mostrarSelectorCliente && (
            <div
              className="qs-overlay"
              onClick={() => setMostrarSelectorCliente(false)}
            >
              <div className="qs-modal" onClick={(e) => e.stopPropagation()}>
                <div className="qs-modal__header">
                  <h4>Seleccionar Cliente</h4>
                </div>
                <div className="qs-modal__search">
                  <FiSearch size={14} />
                  <input
                    placeholder="Buscar por nombre o identificación..."
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="qs-modal__list">
                  {/* Sin cliente (quitar selección) */}
                  {clienteSeleccionado && (
                    <button
                      className="qs-client-item"
                      onClick={() => {
                        setClienteSeleccionado(null);
                        setMostrarSelectorCliente(false);
                      }}
                    >
                      <FiX size={15} style={{ color: "var(--qs-red)" }} />
                      <span style={{ color: "var(--qs-red)", fontWeight: 600 }}>
                        Quitar cliente
                      </span>
                    </button>
                  )}
                  {clientesFiltrados.map((c) => (
                    <button
                      key={c.id}
                      className={`qs-client-item ${clienteSeleccionado?.id === c.id ? "qs-client-item--active" : ""}`}
                      onClick={() => {
                        setClienteSeleccionado(c);
                        setMostrarSelectorCliente(false);
                        setBusquedaCliente("");
                      }}
                    >
                      <FiUser size={15} />
                      <div>
                        <span className="qs-client-item__name">{c.name}</span>
                        {c.identification && (
                          <span className="qs-client-item__id">
                            {c.identification}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "var(--qs-ph)",
                        fontSize: "13px",
                      }}
                    >
                      No se encontraron clientes
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ MODAL CREAR CLIENTE (igual al de FacturaComponent) ═════ */}
          <Modal
            show={mostrarModalCliente}
            onHide={() => setMostrarModalCliente(false)}
            centered
            size="lg"
          >
            <Modal.Header
              closeButton
              style={{ borderBottom: "2px solid #cc322d" }}
            >
              <Modal.Title style={{ fontSize: "18px", fontWeight: "600" }}>
                Crear Nuevo Cliente
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "24px" }}>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Nombre y Apellidos{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={nuevoCliente.name}
                        onChange={handleChangeCliente}
                        isInvalid={!!erroresCliente.name}
                        disabled={guardandoCliente}
                      />
                      {erroresCliente.name && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.name}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Tipo de Identificación
                      </Form.Label>
                      <IdentificationTypeSelect
                        selectedValue={nuevoCliente.typeIdentificationId || 0}
                        onChange={(newTypeId: number) => {
                          const update: Partial<NewClientData> = {
                            typeIdentificationId: newTypeId,
                          };
                          if (newTypeId !== 5) {
                            update.verificationDigit = 0;
                            update.personTypeId = 0;
                            update.taxLiabilityId = 0;
                          }
                          handleClienteFieldUpdate(update);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Identificación
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="identification"
                        placeholder="Número de identificación"
                        value={nuevoCliente.identification || ""}
                        onChange={handleChangeCliente}
                        disabled={guardandoCliente}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Departamento
                      </Form.Label>
                      <DepartmentSelect
                        selectedValue={nuevoCliente.departmentId || 0}
                        onChange={(newDepartmentId: number) =>
                          handleClienteFieldUpdate({
                            departmentId: newDepartmentId,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {esNIT && (
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Dígito de Verificación{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="verificationDigit"
                          placeholder="0-9"
                          value={nuevoCliente.verificationDigit || ""}
                          onChange={handleChangeCliente}
                          isInvalid={!!erroresCliente.verificationDigit}
                          disabled={guardandoCliente}
                          min="0"
                          max="9"
                        />
                        {erroresCliente.verificationDigit && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            {erroresCliente.verificationDigit}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Tipo de Persona{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <PersonTypeSelect
                          selectedValue={nuevoCliente.personTypeId || 0}
                          onChange={(newValue: number) =>
                            handleClienteFieldUpdate({ personTypeId: newValue })
                          }
                        />
                        {erroresCliente.personTypeId && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            {erroresCliente.personTypeId}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Responsabilidad Tributaria{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <TaxLiabilitySelect
                          selectedValue={nuevoCliente.taxLiabilityId || 0}
                          onChange={(newValue: number) =>
                            handleClienteFieldUpdate({
                              taxLiabilityId: newValue,
                            })
                          }
                        />
                        {erroresCliente.taxLiabilityId && (
                          <div
                            className="text-danger mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            {erroresCliente.taxLiabilityId}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Municipio
                      </Form.Label>
                      <CitySelect
                        selectedValue={nuevoCliente.municipalityId || 0}
                        onChange={(newMunicipalityId: number) =>
                          handleClienteFieldUpdate({
                            municipalityId: newMunicipalityId,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Barrio <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="neighborhood"
                        placeholder="Nombre del barrio"
                        value={nuevoCliente.neighborhood}
                        onChange={handleChangeCliente}
                        disabled={guardandoCliente}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Dirección <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Dirección completa"
                        value={nuevoCliente.address}
                        onChange={handleChangeCliente}
                        isInvalid={!!erroresCliente.address}
                        disabled={guardandoCliente}
                      />
                      {erroresCliente.address && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.address}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Teléfono <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Número de teléfono"
                        value={nuevoCliente.phone}
                        onChange={handleChangeCliente}
                        isInvalid={!!erroresCliente.phone}
                        disabled={guardandoCliente}
                      />
                      {erroresCliente.phone && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.phone}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Correo Electrónico
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="ejemplo@correo.com"
                        value={nuevoCliente.email}
                        onChange={handleChangeCliente}
                        disabled={guardandoCliente}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: "1px solid #7c7c7c" }}>
              <Button
                onClick={guardarCliente}
                variant="success"
                disabled={guardandoCliente}
                style={{ padding: "10px 20px" }}
              >
                {guardandoCliente ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk me-1"></i>Guardar
                    Cliente
                  </>
                )}
              </Button>
              <Button
                variant="danger"
                onClick={() => setMostrarModalCliente(false)}
                disabled={guardandoCliente}
                style={{ padding: "10px 20px" }}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
           {invoiceConfig && <InvoicePDF config={invoiceConfig} />}
        </div>
      </div>
    </div>
  );
};

export default VentaEnCaja;
