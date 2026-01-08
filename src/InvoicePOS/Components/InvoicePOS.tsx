import React, { useState, useEffect } from "react";
import { Button, Table, Form, Modal, Row, Col, Card } from "react-bootstrap";
import { DeleteIcon, AddIcon, SaveIcon } from "../Icons/Icons";
import { FiUserPlus, FiUser, FiPackage, FiArrowLeft } from "react-icons/fi";
import { Producto, Client, NewClientData } from "../Types/InvoiceType";
import { GetAllPaymentMethodNoPage } from "../../PaymentMethod/API/PaymentMethodAPI";
import { GetAllClientNoPage, CreateClient } from "../../Client/API/ClientAPI";
import { GetAllProductNoPage } from "../../Product/API/ProductAPI";
import IdentificationTypeSelect from "../../Client/Components/IdentificationTypeSelect";
import PersonTypeSelect from "../../Client/Components/TypePersonSelect";
import TaxLiabilitySelect from "../../Client/Components/TaxLiabilitySelect";
import CitySelect from "../../NeighborhoodRate/Components/SelectCity";
import DepartmentSelect from "../../NeighborhoodRate/Components/SelectDepartment";
import RecibirEfectivoModal from "./InvoiceModalEfective";
import { GetCompanyById } from "../../Company/API/CompanyAPI";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { CompanyType } from "../../Company/Types/Company";
import InvoicePDF, { PDFInvoiceConfig } from "../../Hooks/useInvoicePDF";
import { CreateInvoice } from "../API/InvoiceApi";
import { GenerateInvoiceType } from "../Types/GenerateInvoice";
import ClientSelect from "./SelectClient";
import ProductSelect from "../../Inventory/Components/SelectProduct";

const MySwal = withReactContent(Swal);

const FacturaComponent = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Client[]>([]);
  const [mostrarModalEfectivo, setMostrarModalEfectivo] = useState(false);
  const navigate = useNavigate();

  // Nuevos estados para campos adicionales
  const [tipoPago, setTipoPago] = useState<string>("contado");
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
  const [abono, setAbono] = useState<number>(0);
  const [entrega, setEntrega] = useState<string>("recoger");
  const [cotizacion, setCotizacion] = useState<string>();
  const [costoTransporte, setCostoTransporte] = useState<number>(0);
  const [observacion, setObservacion] = useState<string>("");
  const [restante, setRestante] = useState<number>(0);

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [cashRegisterDescription, setCashRegisterDescription] =
    useState<string>("");
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const [customerId, setCustomerId] = useState<number>(0);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
  const [totalFactura, setTotalFactura] = useState<number>(0);
  const [companyData, setCompanyData] = useState<CompanyType | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({
    id: 0,
    productId: 0,
    nombre: "",
    precio: 0,
    cantidad: 0,
    discountPercent: 0,
    discountFixed: 0,
    quantity: 0,
    price: 0,
    discountAmount: 0,
    priceDiscount: 0,
    totalDiscount: 0,
    total: 0,
  });

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
    neighborhoodName: "",
    address: "",
    email: "",
    phone: "",
    status: "",
  });

  const [erroresCliente, setErroresCliente] = useState<
    Partial<Record<keyof NewClientData, string>>
  >({});
  const [guardandoCliente, setGuardandoCliente] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    cliente: null as any,
    celular: "",
    nombre: "",
    identificacion: "",
    direccion: "",
    ciudad: "",
    caja: "",
    factura: "",
    vendedor: "",
    metodoPago: 0,
  });

  const [invoiceConfig, setInvoiceConfig] = useState<PDFInvoiceConfig | null>(
    null
  );

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await GetCompanyById(1);
        if (data) {
          setCompanyData(data);
        }
      } catch (error) {
        console.error("Error al cargar datos de la empresa:", error);
      }
    };
    fetchCompanyData();
  }, []);

  const guardarFactura = async (efectivoRecibido?: number, cambio?: number) => {
    try {
      console.log("Guardando factura:", {
        total: totalFactura,
        metodoPago: formData.metodoPago,
        efectivoRecibido,
        cambio,
        productos,
        tipoPago,
        fechaVencimiento,
        abono,
        entrega,
        cotizacion,
        observacion,
      });

      MySwal.fire("Éxito!", "Factura guardada exitosamente.", "success");

      const config: PDFInvoiceConfig = {
        companyInfo: {
          logo: companyData?.image,
          logoWidth: 40,
          logoHeight: 40,
          title: "DOCUMENTO NO VALIDO COMO FACTURA DE VENTA",
          nit: companyData?.nit,
          direccion: companyData?.address,
          celular: companyData?.phone,
          email: companyData?.email,
        },
        mainInfo: {
          fecha: new Date().toLocaleString("es-CO", {
            timeZone: "America/Bogota",
          }),
          invoiceNumber: invoiceNumber || `N°-${Date.now()}`,
          cashier: cashRegisterDescription || "Administrador",
          clientIdentification: formData.identificacion,
          cliente: formData.nombre,
        },
        products: productos.map((p) => ({
          nombre: p.nombre,
          cantidad: p.quantity,
          precio: p.price,
          total: p.total,
        })),
        summary: {
          valorBruto: valorBruto,
          descuentoTotal: descuentoTotal,
          costoTransporte: entrega === "llevar" ? costoTransporte : 0,
          ibua: 0,
          total: totalFactura,
        },
        payment: {
          metodoPago:
            paymentMethods.find((m) => m.id === formData.metodoPago)
              ?.description || "Desconocido",
          efectivoRecibido,
          cambio,
          tipoPago,
          abono,
          restante: restante,
          fechaVencimiento,
        },
        entrega,
        observacion,
        footer: {
          showGeneratedBy: true,
          generatedByText: `Hecho en Colombia por ${companyData?.companyName}`,
          showPageNumber: false,
        },
        fileName: `Factura_${invoiceNumber || Date.now()}.pdf`,
      };

      setInvoiceConfig(config);
    } catch (error: any) {
      console.error("Error al guardar factura:", error);
      MySwal.fire("Error", "No se pudo guardar la factura.", "error");
    }
  };

  const eliminarProducto = (lineId: number) => {
    setProductos((productos) =>
      productos.filter((producto) => producto.id !== lineId)
    );
  };

  const agregarProducto = () => {
    if (!nuevoProducto.nombre) {
      MySwal.fire("Error", "Selecciona un producto.", "error");
      return;
    }
    if (nuevoProducto.precio <= 0) {
      MySwal.fire("Error", "El precio debe ser mayor a 0.", "error");
      return;
    }
    if (nuevoProducto.cantidad <= 0) {
      MySwal.fire("Error", "La cantidad debe ser mayor a 0.", "error");
      return;
    }
    if (
      nuevoProducto.discountPercent < 0 ||
      nuevoProducto.discountPercent > 100
    ) {
      MySwal.fire("Error", "El descuento % debe estar entre 0 y 100.", "error");
      return;
    }
    if (nuevoProducto.discountFixed < 0) {
      MySwal.fire("Error", "El descuento fijo no puede ser negativo.", "error");
      return;
    }

    const localLineId = Date.now();
    const subtotal = nuevoProducto.precio * nuevoProducto.cantidad;
    if (nuevoProducto.discountFixed > subtotal) {
      MySwal.fire(
        "Error",
        "El descuento fijo no puede exceder el subtotal.",
        "error"
      );
      return;
    }

    const discountPercentAmount =
      subtotal * (nuevoProducto.discountPercent / 100);
    const totalDiscount = discountPercentAmount + nuevoProducto.discountFixed;
    const priceDiscount = subtotal - totalDiscount;
    const totalLine = priceDiscount;

    const nuevoProductoCompleto: Producto = {
      id: localLineId,
      productId: nuevoProducto.productId || localLineId,
      nombre: nuevoProducto.nombre,
      precio: nuevoProducto.precio,
      cantidad: nuevoProducto.cantidad,
      discountPercent: nuevoProducto.discountPercent,
      discountFixed: nuevoProducto.discountFixed,
      quantity: nuevoProducto.cantidad,
      price: nuevoProducto.precio,
      discountAmount: discountPercentAmount,
      priceDiscount: priceDiscount,
      totalDiscount: totalDiscount,
      total: totalLine,
    };

    setProductos((prev) => [...prev, nuevoProductoCompleto]);
    setNuevoProducto({
      id: 0,
      productId: 0,
      nombre: "",
      precio: 0,
      cantidad: 0,
      discountPercent: 0,
      discountFixed: 0,
      quantity: 0,
      price: 0,
      discountAmount: 0,
      priceDiscount: 0,
      totalDiscount: 0,
      total: 0,
    });
    setMostrarFormulario(false);
  };

  const validarCampoCliente = (
    key: keyof NewClientData,
    value: any
  ): string | null => {
    if (key === "name" && (!value || value.trim() === "")) {
      return "El nombre es obligatorio.";
    }
    if (
      key === "typeIdentificationId" &&
      (!value || value === "0" || value === "")
    ) {
      return "El tipo de identificación es obligatorio.";
    }
    if (key === "identification" && (!value || value.trim() === "")) {
      return "La identificación es obligatoria.";
    }
    if (key === "phone" && (!value || value.trim() === "")) {
      return "El teléfono es obligatorio.";
    }
    if (key === "address" && (!value || value.trim() === "")) {
      return "La dirección es obligatoria.";
    }
    if (key === "municipalityId" && (!value || value === 0)) {
      return "El municipio es obligatorio.";
    }

    const esNIT = String(nuevoCliente.typeIdentificationId) === "6";
    if (esNIT) {
      if (
        key === "verificationDigit" &&
        (value === null || value === undefined || value < 0 || value > 9)
      ) {
        return "El dígito de verificación debe ser entre 0 y 9.";
      }
      if (key === "personTypeId" && (!value || value === 0)) {
        return "El tipo de persona es obligatorio para NIT.";
      }
      if (key === "taxLiabilityId" && (!value || value === 0)) {
        return "La responsabilidad tributaria es obligatoria para NIT.";
      }
    }

    return null;
  };

  const validarTodosLosCamposCliente = (): boolean => {
    const nuevosErrores: Partial<Record<keyof NewClientData, string>> = {};
    let valido = true;

    const camposObligatorios: (keyof NewClientData)[] = [
      "name",
      "neighborhoodName",
      "phone",
      "address",
    ];

    const esNIT = String(nuevoCliente.typeIdentificationId) === "6";
    if (esNIT) {
      camposObligatorios.push(
        "verificationDigit",
        "personTypeId",
        "taxLiabilityId"
      );
    }

    for (const campo of camposObligatorios) {
      const error = validarCampoCliente(campo, nuevoCliente[campo]);
      if (error) {
        nuevosErrores[campo] = error;
        valido = false;
      }
    }

    setErroresCliente(nuevosErrores);
    return valido;
  };

  const handleChangeCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof NewClientData;

    setNuevoCliente((prev) => ({ ...prev, [key]: value }));

    const error = validarCampoCliente(key, value);
    setErroresCliente((prev) => ({ ...prev, [key]: error || undefined }));
  };

  // Handler para el botón de guardar factura
  const handleGuardarFactura = async (
    efectivoRecibido?: number,
    cambio?: number
  ) => {
    // Validaciones
    if (productos.length === 0) {
      MySwal.fire("Error", "Debes agregar al menos un producto.", "error");
      return;
    }

    if (!formData.cliente) {
      MySwal.fire("Error", "Por favor selecciona un cliente.", "error");
      return;
    }

    if (!formData.metodoPago) {
      MySwal.fire("Error", "Selecciona un método de pago.", "error");
      return;
    }

    if (formData.metodoPago === 1 && efectivoRecibido === undefined) {
      setMostrarModalEfectivo(true);
      return;
    }

    // CALCULAR AQUÍ (dentro de la función)
    const valorBruto = productos.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const descuentoTotal = productos.reduce(
      (sum, p) => sum + p.totalDiscount,
      0
    );
    const subtotal = valorBruto - descuentoTotal;
    const totalConTransporte =
      entrega === "llevar" ? subtotal + costoTransporte : subtotal;

    try {
      const invoiceData: GenerateInvoiceType = {
        customerId: customerId,
        invoiceDate: new Date().toISOString().slice(0, 19),
        dueDate: tipoPago === "credito" ? `${fechaVencimiento}T00:00:00` : null,
        paymentTypeId:
          tipoPago === "contado" ? 1 : tipoPago === "credito" ? 2 : 3,
        paymentMethodId: formData.metodoPago,
        deliveryType: entrega.toUpperCase() as "LLEVAR" | "RECOGER",
        deliveryCost: entrega === "llevar" ? costoTransporte : 0,
        observations: observacion || "",
        totalDiscount: descuentoTotal,
        total: totalConTransporte,
        subtotal: valorBruto,
        initialPayment:
          tipoPago === "abono"
            ? abono
            : tipoPago === "contado"
            ? totalConTransporte
            : 0,
        remainingBalance:
          tipoPago === "abono"
            ? totalConTransporte - abono
            : tipoPago === "credito"
            ? totalConTransporte
            : 0,
        cashReceived: efectivoRecibido,
        changeGiven: cambio,
        invoiceDetails: productos.map((p) => ({
          productId: p.productId || 0,
          quantity: p.quantity,
          unitPrice: p.price,
          discountPercent: p.discountPercent,
          discountFixed: p.discountFixed,
          totalDiscount: p.totalDiscount,
          subtotal: p.price * p.quantity,
          total: p.total,
        })),
      };

      const response = await CreateInvoice(invoiceData);

      // GENERAR PDF
      setInvoiceConfig({
        companyInfo: {
          logo: "https://res.cloudinary.com/dfotyo6jc/image/upload/v1761872392/Captura_de_pantalla_2025-10-30_195850_kwda8d.png",
          logoWidth: 40,
          logoHeight: 40,
          title: "DOCUMENTO NO VALIDO COMO FACTURA DE VENTA",
          nit: companyData?.nit || "",
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
          clientIdentification: formData.identificacion || "Sin identificación",
          cliente: formData.nombre,
        },
        products: productos.map((p) => ({
          nombre: p.nombre,
          cantidad: p.quantity,
          precio: p.price,
          total: p.total,
        })),
        summary: {
          valorBruto,
          descuentoTotal,
          costoTransporte: entrega === "llevar" ? costoTransporte : 0,
          ibua: 0,
          total: totalConTransporte,
        },
        payment: {
          metodoPago:
            paymentMethods.find((m) => m.id === formData.metodoPago)
              ?.description || "Desconocido",
          efectivoRecibido,
          cambio,
          tipoPago,
          abono,
          restante: restante,
          fechaVencimiento,
        },
        entrega,
        observacion,
        footer: {
          showGeneratedBy: true,
          generatedByText: `Hecho en Colombia por ${companyData?.companyName}`,
          showPageNumber: false,
        },
        fileName: `Factura_${response?.invoiceNumber || Date.now()}.pdf`,
      });

      MySwal.fire({
        icon: "success",
        title: "¡Factura creada!",
        text: "PDF generado y todo limpio",
        timer: 2500,
        showConfirmButton: false,
      });

      // Limpiar todo
      setProductos([]);
      setClienteSeleccionado(null);
      setFormData({
        cliente: null,
        celular: "",
        nombre: "",
        identificacion: "",
        direccion: "",
        ciudad: "",
        caja: "",
        factura: "",
        vendedor: "",
        metodoPago: 0,
      });
      setCustomerId(0);
      setTipoPago("contado");
      setFechaVencimiento("");
      setAbono(0);
      setEntrega("recoger");
      setCostoTransporte(0);
      setObservacion("");
      setTotalFactura(0);
      setMostrarModalEfectivo(false);
    } catch (error: any) {
      MySwal.fire(
        "Error",
        error.message || "No se pudo crear la factura",
        "error"
      );
    }
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
      typeIdentificationId: null,
      identificationType: "",
      identification: null,
      verificationDigit: null,
      personTypeId: null,
      personType: "",
      taxLiabilityId: null,
      taxLiability: "",
      departmentId: null,
      departmentName: "",
      municipalityId: null,
      municipality: "",
      neighborhoodName: "",
      address: "",
      email: "",
      phone: "",
      status: "",
    });
    setErroresCliente({});
    setMostrarModalCliente(true);
  };

  const guardarCliente = async () => {
    if (!validarTodosLosCamposCliente()) {
      MySwal.fire(
        "Error",
        "Por favor completa todos los campos obligatorios.",
        "error"
      );
      return;
    }

    setGuardandoCliente(true);

    try {
      // 1. Crear cliente
      await CreateClient(nuevoCliente);

      // 2. Recargar clientes
      const dataActualizada = await GetAllClientNoPage();
      if (!dataActualizada)
        throw new Error("No se pudieron cargar los clientes");

      const clientesActualizados: Client[] = dataActualizada.map((cliente) => ({
        ...cliente,
        cityName: cliente.municipality || "Sin ciudad",
      }));

      setClientes(clientesActualizados);
      setFilteredClientes(clientesActualizados);

      // 3. ENCONTRAR AL CLIENTE NUEVO (por nombre + teléfono o cédula)
      const clienteCreado = clientesActualizados.find((c) => {
        if (nuevoCliente.identification) {
          return (
            c.identification?.toString() ===
            nuevoCliente.identification?.toString()
          );
        }
        return c.name === nuevoCliente.name && c.phone === nuevoCliente.phone;
      });

      if (!clienteCreado) {
        MySwal.fire(
          "Advertencia",
          "Cliente creado pero no se encontró.",
          "warning"
        );
        setMostrarModalCliente(false);
        return;
      }

      // 4. FORZAR SELECCIÓN Y DATOS MANUALMENTE (sin depender de handleClienteChange)
      const opcionSeleccionada = {
        value: clienteCreado.id,
        label: clienteCreado.identification
          ? `${clienteCreado.identification} - ${clienteCreado.name}`
          : `Sin identificación - ${clienteCreado.name}`,
      };

      // ESTO ES LO QUE FUNCIONA SÍ O SÍ
      setFormData({
        cliente: opcionSeleccionada,
        nombre: clienteCreado.name || "",
        celular: clienteCreado.phone || "",
        identificacion: clienteCreado.identification
          ? clienteCreado.identification.toString()
          : "",
        direccion: clienteCreado.address || "",
        ciudad: clienteCreado.cityName || "",
        caja: "",
        factura: "",
        vendedor: "",
        metodoPago: formData.metodoPago,
      });

      setCustomerId(clienteCreado.id);

      MySwal.fire({
        icon: "success",
        title: "¡Perfecto!",
        text: `${clienteCreado.name} creado y seleccionado`,
        timer: 2000,
        showConfirmButton: false,
      });

      setMostrarModalCliente(false);
    } catch (error: any) {
      console.error("Error al crear cliente:", error);
      MySwal.fire(
        "Error",
        error?.message || "No se pudo crear el cliente.",
        "error"
      );
    } finally {
      setGuardandoCliente(false);
    }
  };
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await GetAllProductNoPage();
        if (data) setProductosDisponibles(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        MySwal.fire("Error", "No se pudieron cargar los productos.", "error");
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const valorBruto = productos.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const descuentoTotal = productos.reduce(
      (sum, p) => sum + p.totalDiscount,
      0
    );
    const subtotal = valorBruto - descuentoTotal;

    const totalConTransporte =
      entrega === "llevar" ? subtotal + costoTransporte : subtotal;

    setTotalFactura(totalConTransporte);
  }, [productos, costoTransporte, entrega]);

  useEffect(() => {
    if (tipoPago === "abono") {
      setRestante(totalFactura - abono);
    } else {
      setRestante(0);
    }
  }, [totalFactura, abono, tipoPago]);

  const fetchClientes = async () => {
    try {
      const data = await GetAllClientNoPage();

      if (!data) {
        setClientes([]);
        setFilteredClientes([]);
        return;
      }

      const clientesConvertidos: Client[] = data.map((cliente) => ({
        ...cliente,
        cityName: cliente.municipality || "Sin ciudad",
      }));

      setClientes(clientesConvertidos);
      setFilteredClientes(clientesConvertidos);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      setClientes([]);
      setFilteredClientes([]);
    }
  };

  // Función para enviar PDF por WhatsApp
  const enviarPorWhatsApp = () => {
    if (!formData.celular) {
      MySwal.fire(
        "Error",
        "No hay un número de teléfono registrado para este cliente.",
        "error"
      );
      return;
    }

    // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
    const numeroLimpio = formData.celular.replace(/\D/g, "");

    // Construir el mensaje
    const mensaje = `Hola ${formData.nombre}, te enviamos la factura N° ${
      invoiceNumber || "Pendiente"
    }
  
📋 *Detalles de la compra:*
Total: $${totalFactura.toLocaleString("es-CO")}
Método de pago: ${tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1)}
${observacion ? `\nObservación: ${observacion}` : ""}

Gracias por tu compra. 
${companyData?.companyName || ""}`;

    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/57${numeroLimpio}?text=${encodeURIComponent(
      mensaje
    )}`;

    // Abrir WhatsApp en nueva ventana
    window.open(urlWhatsApp, "_blank");
  };

  // Ahora el useEffect queda limpio
  useEffect(() => {
    fetchClientes(); // ahora sí existe
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await GetAllPaymentMethodNoPage();
        if (data) {
          const metodosActivos = data
            .filter((method: any) => method.status === "ACTIVE")
            .map((method: any) => ({
              id: method.id,
              description: method.description,
            }));
          setPaymentMethods(metodosActivos);
        }
      } catch (error) {
        console.error("Error al obtener los métodos de pago:", error);
        MySwal.fire(
          "Error",
          "No se pudieron cargar los métodos de pago.",
          "error"
        );
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "metodoPago" ? Number(value) : value,
    }));
  };
  const handleClienteChange = (selectedOption: any) => {
    const clienteId = selectedOption?.value;

    if (!clienteId) {
      setFormData({
        cliente: null,
        nombre: "",
        celular: "",
        identificacion: "",
        direccion: "",
        ciudad: "",
        caja: "",
        factura: "",
        vendedor: "",
        metodoPago: formData.metodoPago,
      });
      return;
    }

    // Buscamos el cliente en la lista actualizada
    const selectedClient = filteredClientes.find(
      (client) => client.id === clienteId
    );

    if (selectedClient) {
      setCustomerId(clienteId);

      setFormData({
        cliente: selectedOption,
        nombre: selectedClient.name || "",
        celular: selectedClient.phone || "",
        // Aquí está la clave: usamos el dato real del cliente
        identificacion: selectedClient.identification
          ? selectedClient.identification.toString()
          : "",
        direccion: selectedClient.address || "",
        ciudad: selectedClient.cityName || "",
        caja: "",
        factura: "",
        vendedor: "",
        metodoPago: formData.metodoPago,
      });
    }
  };
  const valorBruto = productos.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const descuentoTotal = productos.reduce((sum, p) => sum + p.totalDiscount, 0);

  const esNIT = String(nuevoCliente.typeIdentificationId) === "6";

  // Agrega esta función para cerrar el modal y limpiar
  const cerrarModalProducto = () => {
    setNuevoProducto({
      id: 0,
      productId: 0,
      nombre: "",
      precio: 0,
      cantidad: 0,
      discountPercent: 0,
      discountFixed: 0,
      quantity: 0,
      price: 0,
      discountAmount: 0,
      priceDiscount: 0,
      totalDiscount: 0,
      total: 0,
    });
    setMostrarFormulario(false);
  };

  return (
    <div className="app-content content">
      <div className="content-wrapper container-fluid p-0">
        <div className="content-body">
          <div className="d-flex align-items-center mb-2">
            <button
              onClick={() => navigate("/invoice")}
              className="btn btn-link text-decoration-none d-flex align-items-center p-0 me-3"
              style={{ color: "#cc322d", fontSize: "1.8rem" }}
              title="Volver al listado"
            >
              <FiArrowLeft />
            </button>
            <h3 className="mb-0">Crear factura</h3>
          </div>
          {/* Información del Cliente */}
          <Card
            className="mb-3"
            style={{
              borderRadius: "0.375rem",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
              maxWidth: "100%",
              width: "100%",
              overflow: "visible",
            }}
          >
            <Card.Header
              style={{
                borderBottom: "2px solid #cc322d",
                padding: "12px 20px",
              }}
            >
              <h6 className="mb-0" style={{ fontWeight: "600" }}>
                <FiUser style={{ marginRight: "8px" }} /> Información del
                Cliente
              </h6>
            </Card.Header>
            <Card.Body style={{ padding: "20px" }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Nombre
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nombre}
                      readOnly
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          NIT/Cédula
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.identificacion}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Teléfono / Celular
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.celular || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              celular: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Cliente
                    </Form.Label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <ClientSelect
                          selectedValue={clienteSeleccionado?.value || null}
                          onChange={(newValue) => {
                            const selectedClient = filteredClientes.find(
                              (client) => client.id === newValue
                            );
                            if (selectedClient) {
                              setClienteSeleccionado({
                                value: newValue,
                                label: `${
                                  selectedClient.identification ||
                                  "Sin identificación"
                                } - ${selectedClient.name}`,
                              });
                              handleClienteChange({
                                value: newValue,
                                label: `${
                                  selectedClient.identification ||
                                  "Sin identificación"
                                } - ${selectedClient.name}`,
                              });
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={abrirModalCliente}
                        style={{
                          backgroundColor: "#27ae60",
                          border: "none",
                          padding: "8px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiUserPlus size={18} />
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontSize: "13px", fontWeight: "600" }}>
                      Dirección
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.direccion || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, direccion: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Información del Producto */}
          <Card
            style={{
              borderRadius: "0.375rem",
              boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
              maxWidth: "100%",
              width: "100%",
              overflow: "visible",
            }}
          >
            <Card.Header
              className="d-flex justify-content-between align-items-center flex-wrap"
              style={{
                borderBottom: "2px solid #cc322d",
                padding: "12px 20px",
                gap: "12px",
              }}
            >
              <h6 className="mb-0">
                <FiPackage style={{ marginRight: "8px" }} /> Productos de la
                Factura
              </h6>
              <Button
                onClick={() => setMostrarFormulario(true)}
                style={{
                  backgroundColor: "#3498db",
                  border: "none",
                  fontSize: "14px",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AddIcon /> Agregar Producto
              </Button>
            </Card.Header>
            <Card.Body style={{ padding: "0" }}>
              <div style={{ overflowX: "auto" }}>
                <Table hover style={{ marginBottom: "0", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", fontWeight: "600" }}>#</th>
                      <th style={{ padding: "12px" }}>Producto</th>
                      <th
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "center",
                          borderBottom: "2px solid #dee2e6",
                        }}
                      >
                        Cantidad
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "right",
                          borderBottom: "2px solid #dee2e6",
                        }}
                      >
                        V. Unidad
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "right",
                          borderBottom: "2px solid #dee2e6",
                        }}
                      >
                        Desc.
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "right",
                          borderBottom: "2px solid #dee2e6",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "center",
                          borderBottom: "2px solid #dee2e6",
                          width: "80px",
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#999",
                          }}
                        >
                          No hay productos agregados
                        </td>
                      </tr>
                    ) : (
                      productos.map((producto, index) => (
                        <tr
                          key={producto.id}
                          style={{ borderBottom: "1px solid #f0f0f0" }}
                        >
                          <td style={{ padding: "12px" }}>{index + 1}</td>
                          <td style={{ padding: "12px" }}>{producto.nombre}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            {producto.quantity}
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            ${producto.price.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              color: "#e74c3c",
                            }}
                          >
                            ${producto.totalDiscount.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#27ae60",
                            }}
                          >
                            ${producto.total.toLocaleString()}
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => eliminarProducto(producto.id)}
                              style={{ padding: "4px 8px" }}
                            >
                              <DeleteIcon />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              <div style={{ padding: "20px", borderTop: "1px solid #dee2e6" }}>
                <Row className="gx-3">
                  <Col md={2} style={{ marginLeft: "20px" }}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Domicilio
                      </Form.Label>

                      <Form.Check
                        type="checkbox"
                        id="domicilio-recoger"
                        label={
                          <span className="fw-medium">Recoger en depósito</span>
                        }
                        checked={entrega === "recoger"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEntrega("recoger");
                            setCostoTransporte(0);
                          }
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        id="domicilio-llevar"
                        label={
                          <span className="fw-medium">Llevar a domicilio</span>
                        }
                        checked={entrega === "llevar"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEntrega("llevar");
                          }
                        }}
                        className="py-1"
                      />
                    </Form.Group>
                  </Col>

                  {entrega === "llevar" && (
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Costo Transporte ($)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="0"
                          value={
                            costoTransporte === 0
                              ? ""
                              : costoTransporte.toLocaleString("es-CO")
                          }
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\./g, "");
                            setCostoTransporte(
                              valor === "" ? 0 : Number(valor)
                            );
                          }}
                          style={{
                            fontSize: "14px",
                            textAlign: "right",
                            borderRadius: "0.375rem",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={entrega === "llevar" ? 3 : 3}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Medio de pago
                      </Form.Label>
                      <Form.Select
                        value={formData.metodoPago}
                        onChange={handleChange}
                        name="metodoPago"
                        style={{ fontSize: "14px" }}
                      >
                        <option value="">Selecciona un Medio</option>
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.description}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={entrega === "llevar" ? 2 : 3}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Metodo de Pago
                      </Form.Label>
                      <Form.Select
                        value={tipoPago}
                        onChange={(e) => setTipoPago(e.target.value)}
                        style={{ fontSize: "14px" }}
                      >
                        <option value="contado">Contado</option>
                        <option value="credito">Crédito</option>
                        <option value="abono">Abono</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    {tipoPago === "credito" && (
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Fecha de Vencimiento{" "}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={fechaVencimiento}
                          onChange={(e) => setFechaVencimiento(e.target.value)}
                          style={{ fontSize: "14px" }}
                        />
                      </Form.Group>
                    )}
                    {tipoPago === "contado" && (
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            style={{ fontSize: "13px", fontWeight: "600" }}
                          >
                            Cotizacion
                          </Form.Label>
                          <Form.Check
                            type="checkbox"
                            id="cotizacion-si"
                            label={<span className="fw-medium">Cotizar</span>}
                            checked={cotizacion === "cotizacion"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCotizacion("cotizacion");
                              } else {
                                setCotizacion("");
                              }
                            }}
                            className="py-1"
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {tipoPago === "abono" && (
                      <Form.Group>
                        <Form.Label
                          style={{ fontSize: "13px", fontWeight: "600" }}
                        >
                          Abono ($)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="0"
                          value={
                            abono === 0 ? "" : abono.toLocaleString("es-CO")
                          }
                          onChange={(e) => {
                            const valor = e.target.value.replace(/\./g, "");
                            setAbono(valor === "" ? 0 : Number(valor));
                          }}
                          min="0"
                          step="0.01"
                          style={{ fontSize: "14px", textAlign: "right" }}
                        />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "800" }}
                      >
                        Observación
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Notas adicionales..."
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        style={{ fontSize: "14px", resize: "vertical" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div style={{ padding: "20px", borderTop: "1px solid #dee2e6" }}>
                <Row className="justify-content-end">
                  <Col md={4}>
                    <div style={{ fontSize: "14px" }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          Valor Bruto:
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>
                          ${valorBruto.toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ fontSize: "16px", fontWeight: "700" }}>
                          Descuento:
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#e74c3c",
                          }}
                        >
                          -${descuentoTotal.toLocaleString()}
                        </span>
                      </div>
                      {entrega === "llevar" && (
                        <div className="d-flex justify-content-between mb-2">
                          <span style={{ fontSize: "16px", fontWeight: "700" }}>
                            Transporte:
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#27ae60",
                            }}
                          >
                            +${costoTransporte.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {tipoPago === "abono" && (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span
                              style={{ fontSize: "16px", fontWeight: "700" }}
                            >
                              Abono:
                            </span>
                            <span
                              style={{ fontSize: "16px", fontWeight: "600" }}
                            >
                              ${abono.toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span
                              style={{ fontSize: "16px", fontWeight: "700" }}
                            >
                              Resta:
                            </span>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#e74c3c",
                              }}
                            >
                              ${restante.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                      <div
                        className="d-flex justify-content-between pt-2"
                        style={{ borderTop: "2px solid #cc322d" }}
                      >
                        <span style={{ fontSize: "20px", fontWeight: "700" }}>
                          TOTAL:
                        </span>
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#27ae60",
                          }}
                        >
                          ${totalFactura.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-100 mt-3"
                      onClick={() => handleGuardarFactura()}
                      style={{
                        backgroundColor: "#27ae60",
                        border: "none",
                        padding: "12px",
                        fontSize: "15px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <SaveIcon /> Guardar Factura
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>

          {/* Modal Agregar Producto */}
          <Modal
            show={mostrarFormulario}
            onHide={cerrarModalProducto}
            centered
            size="lg"
          >
            <Modal.Header closeButton style={{ borderBottom: "2px" }}>
              <Modal.Title style={{ fontSize: "18px", fontWeight: "600" }}>
                Agregar Producto
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "24px", minHeight: "400px" }}>
              <Form.Group className="mb-3">
                <Form.Label
                  style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}
                >
                  Producto
                </Form.Label>
                <ProductSelect
                  selectedValue={nuevoProducto.id || 0}
                  onChange={(newValue) => {
                    const selectedProduct = productosDisponibles.find(
                      (producto) => producto.id === newValue
                    );
                    setNuevoProducto({
                      ...nuevoProducto,
                      id: newValue,
                      productId: newValue,
                      nombre: selectedProduct?.productName || "",
                      precio: selectedProduct?.price || 0,
                      discountPercent: 0,
                      discountFixed: 0,
                      cantidad: 1,
                    });
                  }}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#555",
                      }}
                    >
                      Precio
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={nuevoProducto.precio || ""}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          precio: Number(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      style={{ fontSize: "14px" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#555",
                      }}
                    >
                      Cantidad
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={nuevoProducto.cantidad || ""}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          cantidad: Number(e.target.value) || 0,
                        })
                      }
                      min="1"
                      step="1"
                      style={{ fontSize: "14px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#555",
                      }}
                    >
                      Descuento (%)
                    </Form.Label>
                    <Form.Select
                      value={nuevoProducto.discountPercent}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          discountPercent: Number(e.target.value) || 0,
                        })
                      }
                      style={{ fontSize: "14px" }}
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                      <option value={20}>20%</option>
                      <option value={25}>25%</option>
                      <option value={30}>30%</option>
                      <option value={35}>35%</option>
                      <option value={40}>40%</option>
                      <option value={45}>45%</option>
                      <option value={50}>50%</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#555",
                      }}
                    >
                      Descuento ($)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={nuevoProducto.discountFixed || ""}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          discountFixed: Number(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      style={{ fontSize: "14px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: "1px solid #7c7c7cff" }}>
              <Button onClick={agregarProducto} variant="success">
                <i className="fa-solid fa-floppy-disk me-1"></i> Guardar
              </Button>
              <Button
                variant="primary"
                onClick={cerrarModalProducto}
                style={{ padding: "12px 20px" }}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Crear Cliente */}
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
                        Tipo de Identificación{" "}
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
                      {erroresCliente.typeIdentificationId && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.typeIdentificationId}
                        </div>
                      )}
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
                        isInvalid={!!erroresCliente.identification}
                        disabled={guardandoCliente}
                      />
                      {erroresCliente.identification && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.identification}
                        </div>
                      )}
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
                        onChange={(newDepartmentId: number) => {
                          handleClienteFieldUpdate({
                            departmentId: newDepartmentId,
                          });
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {esNIT && (
                  <>
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
                              handleClienteFieldUpdate({
                                personTypeId: newValue,
                              })
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
                  </>
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
                        onChange={(newMunicipalityId: number) => {
                          handleClienteFieldUpdate({
                            municipalityId: newMunicipalityId,
                          });
                        }}
                      />
                      {erroresCliente.municipalityId && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {erroresCliente.municipalityId}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        Barrio
                        <span style={{ color: "red" }}> *</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="neighborhoodName"
                        placeholder="Nombre del barrio"
                        value={nuevoCliente.neighborhoodName}
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
            <Modal.Footer style={{ borderTop: "1px solid #7c7c7cff" }}>
              <Button
                onClick={guardarCliente}
                variant="success"
                disabled={guardandoCliente}
                style={{ padding: "10px 20px" }}
              >
                {guardandoCliente ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk me-1"></i> Guardar
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

          <RecibirEfectivoModal
            show={mostrarModalEfectivo}
            onHide={() => setMostrarModalEfectivo(false)}
            totalFactura={totalFactura}
            onRegistrar={async (efectivoRecibido, cambio) => {
              setMostrarModalEfectivo(false);
              await handleGuardarFactura(efectivoRecibido, cambio); // Aquí le pasamos los valores
            }}
          />
          {invoiceConfig && <InvoicePDF config={invoiceConfig} />}
        </div>
      </div>
    </div>
  );
};

export default FacturaComponent;
