import React, { useState, useEffect } from "react";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { DeleteIcon, AddIcon,SaveIcon } from "../Icons/Icons";
import { useLocation } from 'react-router-dom';
import { GetAllSellerNoPage } from "../../Seller/API/SellerAPI";
import { GetAllPaymentMethodNoPage } from "../../PaymentMethod/API/PaymentMethodAPI";
import { GetAllClientNoPage } from "../../Client/API/ClientAPI";  
import { GetAllProductNoPage } from "../../Product/API/ProductAPI";
import ReactSelect from 'react-select';
import { saveProduct,deleteProductFromInvoice,saveInvoice   } from "../API/GenerateInvoiceAPI";

interface Producto {
  productId: number;
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  descuento: number;
  quantity: number;
  price:number;
  discountAmount: number;
  iva: number;         
  priceDiscount: number;
  priceTax: number;
  total: number;
  tax: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  identification: string;
  address: string;
  cityName: string;
}

const FacturaComponent = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]); 
  const [filteredClientes, setFilteredClientes] = useState<Client[]>([]);
  const [identificacionBusqueda, setIdentificacionBusqueda] = useState<string>("");

  const location = useLocation();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [cashRegisterDescription, setCashRegisterDescription] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<number>(0);  
  const [customerId, setCustomerId] = useState<number>(0); 
  const [sellerId, setSellerId] = useState<number>(0); 

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [totalFactura, setTotalFactura] = useState<number>(0);
  const [nuevoProducto, setNuevoProducto] = useState<Producto>({
    id: 0,
    productId: 0,
    nombre: "",
    precio: 0,
    cantidad: 0,
    descuento: 0,
    quantity: 0,
    price:0,
    discountAmount: 0,
    iva: 0.19,
    priceDiscount: 0,
    priceTax: 0,
    total: 0,
    tax: 0
  });

  const [vendedores, setVendedores] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    cliente: null, 
    celular: "",
    nombre: "", 
    identificacion: "",
    direccion: "",
    ciudad: "",
    caja: "",
    factura: "",
    vendedor: "",
  });

  const eliminarProducto = async (productId: number) => {
    console.log("Intentando eliminar producto con:", { invoiceId, productId });
  
    if (!invoiceId) {
      console.error("❌ No se puede eliminar el producto porque falta el invoiceId.");
      return;
    }
  
    const resultado = await deleteProductFromInvoice(invoiceId, productId);
  
    if (resultado) {
      setProductos((productos) => productos.filter((producto) => producto.id !== productId));
    }
  };

  const handleSaveInvoice = async () => {
    if (!invoiceId || !customerId || !sellerId) {
      console.error("Faltan datos: invoiceId, customerId o sellerId.");
      return;
    }

    const result = await saveInvoice(invoiceId, customerId, sellerId);
    if (result) {
      console.log("Factura guardada correctamente:", result);
    } else {
      console.error("Error al guardar la factura");
    }
  }
  
  const agregarProducto = async () => {
    if (nuevoProducto.nombre && nuevoProducto.precio > 0 && nuevoProducto.cantidad > 0) {
  
      const productData = {
        invoiceId: invoiceId,
        productId: nuevoProducto.id,
        quantity: nuevoProducto.cantidad,
      };
  
      try {
        const response = await saveProduct(productData.invoiceId, productData.productId, productData.quantity);
        console.log("📢 Respuesta de la API al agregar producto:", response);

        if (response && response.products) {
          const productosConDatosActualizados = response.products.map((producto: any) => ({
            productId: producto.productId,
            nombre: producto.product,
            precio: producto.price,
            cantidad: producto.quantity,
            descuento: producto.discountAmount,
            priceDiscount: producto.priceDiscount,
            price:producto.price,
            priceTax: producto.priceTax,
            discountAmount: producto.discountAmount,
            quantity: producto.quantity,
            total: producto.total,
            iva: producto.tax / 100,  
            tax: producto.tax,
          }));
  
          setProductos(productosConDatosActualizados);
          console.log("ID:", response.id);
          setTotalFactura(response.total);
  
          setNuevoProducto({
            id: 0,
            productId:0,
            nombre: "",
            precio: 0,
            cantidad: 0,
            descuento: 0,
            quantity: 0,
            price:0,
            discountAmount: 0,
            iva: 0, 
            priceDiscount: 0,
            priceTax: 0,
            total: 0,
            tax: 0,
          });
  
          setMostrarFormulario(false);
  
          console.log("Producto guardado correctamente:", response.products);
          
        } else {
          console.error("Error al guardar el producto o no se encontraron productos");
        }
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    } else {
      alert("Por favor, ingresa valores válidos."); 
    }
  };
  

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await GetAllProductNoPage();
        if (data) {
          setProductosDisponibles(data);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (location.state) {
      setInvoiceNumber(location.state.invoiceNumber);
      setCashRegisterDescription(location.state.cashRegisterDescription || "");
      setInvoiceId(location.state.invoiceId);
    }
  }, [location]);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const data = await GetAllSellerNoPage();
        if (data) {
          setVendedores(data.map((vendedor) => ({
            id: vendedor.id,
            name: `${vendedor.name} ${vendedor.lastName}`,
          })));
        }
      } catch (error) {
        console.error("Error al obtener los vendedores:", error);
      }
    };
    fetchVendedores();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await GetAllClientNoPage(identificacionBusqueda); 
      console.log("Datos recibidos de la API:", data);  
      if (data) {
        setClientes(data);
        setFilteredClientes(data);
      }
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes(); 
  }, [identificacionBusqueda]);

  useEffect(() => {
    if (identificacionBusqueda) {
      setFilteredClientes(
        clientes.filter(cliente =>
          cliente.identification.includes(identificacionBusqueda)
        )
      );
    } else {
      setFilteredClientes(clientes);
    }
  }, [identificacionBusqueda, clientes]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await GetAllPaymentMethodNoPage();
        if (data) {
          setPaymentMethods(data.map((method) => ({
            id: method.id,
            description: method.description,
          })));
        }
      } catch (error) {
        console.error("Error al obtener los métodos de pago:", error);
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVendedorChange = (selectedOption: any) => {
    const vendedorId = selectedOption.value;
    setSellerId(vendedorId);
    setFormData((prevData) => ({
      ...prevData,
      vendedor: selectedOption,
    }));
  };
  
  
  const handleClienteChange = (selectedOption: any) => {
    const clienteId = selectedOption.value;
    const selectedClient = clientes.find((client) => client.id === clienteId);
    if (selectedClient) {
      setCustomerId(clienteId);  
      setFormData((prevData) => ({
        ...prevData,
        cliente: selectedOption, 
        nombre: selectedClient.name || "",
        celular: selectedClient.phone || "",
        identificacion: selectedClient.identification || "",
        direccion: selectedClient.address || "",
        ciudad: selectedClient.cityName || "",
      }));
    }
  };
  

  return (
    <div className="app-content content">
      <div className="content-wrapper container-xxl p-0">
        <div className="content-body">
          {/* Concepto de Compra */}
          <div className="card mt-2">
            <div className="card-header bg-primary text-white">📄 Concepto de Compra</div>
            <div className="d-flex justify-content-between align-items-center">
              <h3>
                Factura No: <span style={{ fontWeight: "bold" }}>{invoiceNumber || "Cargando..."}</span>
              </h3>
              <div>
                <h4>
                  Empresa: SWIFTECH | NIT: 123456789
                </h4>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="caja" className="mb-2">
                    <Form.Label>Caja No.</Form.Label>
                    <Form.Control type="text" name="caja" value={cashRegisterDescription} readOnly />
                  </Form.Group>

                  <Form.Group controlId="vendedor" className="mb-2">
                    <Form.Label>Vendedor</Form.Label>
                    <Form.Select
                    name="vendedor"
                    value={formData.vendedor ? formData.vendedor.value : ""} 
                    onChange={handleVendedorChange}
                    >
                    <option value="">Selecciona un Vendedor</option>
                    {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.name}
                    </option>
                    ))}
                  </Form.Select>

                  </Form.Group>

                  <Form.Group controlId="metodoPago" className="mb-2">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select name="metodoPago" value={formData.metodoPago} onChange={handleChange}>
                      <option value="">Selecciona un Método de Pago</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlId="cliente" className="mb-2">
                    <Form.Label>Clientes</Form.Label>
                    <ReactSelect
                      name="cliente"
                      value={formData.cliente} 
                      onChange={handleClienteChange}
                      options={filteredClientes.map((cliente) => ({
                        value: cliente.id, 
                        label: cliente.identification, 
                      }))}
                      placeholder="Escribe para buscar un cliente"
                    />
                  </Form.Group>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group controlId="nombre" className="mb-3">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control type="text" name="nombre" value={formData.nombre} readOnly />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group controlId="celular" className="mb-3">
                        <Form.Label>Celular:</Form.Label>
                        <Form.Control type="text" name="celular" value={formData.celular} readOnly />
                      </Form.Group>
                    </div>
                    
                    <div className="d-flex justify-content-end align-items-center">
                  
                       <Button 
                           className="btn btn-success btn-sm d-flex align-items-center me-2"    
                          style={{ width: "auto" }}  
                          onClick={handleSaveInvoice} 
                        >
                        <span className="me-1"> 
                          <SaveIcon />
                        </span>
                        Guardar Factura
                      </Button>
                      

                        <h4 className="bg-primary text-white p-2 rounded">
                            Total Pagado: ${totalFactura.toLocaleString()}
                         </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 text-white">📝 Detalles de Factura</h6>
              <Button
                className="mt-1 d-flex align-items-center"
                style={{ backgroundColor: "#ff0000", border: "none", padding: "10px 10px" }}
                onClick={() => setMostrarFormulario(true)}
              >
                <span className="me-1">
                  <AddIcon />
                </span>
                Agregar un nuevo producto
              </Button>
            </div>

            <div className="card-body">
              <Table striped bordered hover className="text-center">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Descuento</th>
                    <th>IVA</th>
                    <th>Valor</th>
                    <th>Valor + IVA</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
    {productos.map((producto) => (
    <tr key={producto.productId}>
      <td>{producto.nombre}</td>
      <td>${producto.price}</td> 
      <td>{producto.quantity}</td>
      <td>{producto.discountAmount}%</td>
      <td>{producto.tax}%</td> {/* IVA en porcentaje */}
      <td>${producto.priceDiscount.toLocaleString()}</td> {/* Precio sin IVA */}
      <td>${producto.priceTax.toLocaleString()}</td> {/* Precio con IVA */}
      <td>
        <Button
          className="btn btn-danger btn-sm"
          onClick={() => eliminarProducto(producto.productId)}
          aria-label="Eliminar Elemento Seleccionado"
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

              </Table>
            </div>
          </div>

          {mostrarFormulario && (
            <Modal show={mostrarFormulario} onHide={() => setMostrarFormulario(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Registrar Nuevos Productos</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nombre del Producto:</Form.Label>
                  <Form.Select
                    value={nuevoProducto.id}
                    onChange={(e) => {
                      const selectedProduct = productosDisponibles.find(
                        (producto) => producto.id.toString() === e.target.value
                      );
                      setNuevoProducto({
                        ...nuevoProducto,
                        id: selectedProduct?.id || 0,
                        nombre: selectedProduct?.productName || "",
                        precio: selectedProduct?.price || 0,
                        iva: selectedProduct?.taxValue || 0,
                      });
                    }}
                  >
                    <option value="">Selecciona un producto</option>
                    {productosDisponibles.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.productName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Precio:</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    value={nuevoProducto.precio}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Cantidad:</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control"
                    placeholder="Cantidad"
                    value={nuevoProducto.cantidad}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, cantidad: Number(e.target.value) })
                    }
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button className="btn btn-success" onClick={agregarProducto}>
                    ✅ Registrar Nuevos Productos
                  </Button>
                  <Button className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>
                    ❌ Cancelar
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}

        </div>
      </div>
    </div>
  );
};

export default FacturaComponent;
