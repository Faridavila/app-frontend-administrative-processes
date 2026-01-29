import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertResult } from "sweetalert2";
import * as XLSX from "xlsx";
import HandLoadingSpinner from "../../Spinner/SpinnerAnimation";
import {
  AddIcon,
  FilterIcon,
  FilterIcon2,
  EditIcon,
  DeleteIcon,
  ExcelIcon,
  Entrada,
  Perdidas,
} from "../Icons/Icons";
import "./CRUDGeneral.css";

const MySwal = withReactContent(Swal);

type Orders = "ASC" | "DESC" ;

interface CRUDIcon {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

export interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  hidden?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  dependentOn?: keyof T;
  validationMessage?: string;
  hiddenInCreate?: boolean;
  hiddenInEdit?: boolean;
  formHidden?: (item: T) => boolean;
  tableHidden?: (item: T) => boolean;
  type?: "text" | "number" | "image" | "password" | "date";
  imageOptions?: {
    maxSize?: number;
    acceptedFormats?: string[];
    width?: number;
    height?: number;
  };
  render?: (item: T) => React.ReactNode;
}

export interface CustomGeneralActionButton {
  key: string;
  label: string;
  color:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "error";
  icon: React.ReactNode;
  order?: number;
  hidden?: boolean;
  ariaLabel?: string;
}

export interface CustomBuiltInActionButton {
  label?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "error";
  icon?: React.ReactNode;
  order?: number;
  ariaLabel?: string;
}

export interface CRUDFormProps<T> {
  fetchItems: (
    page: number,
    size: number,
    filters: Partial<T>,
    sortOrder?: string,
    sortBy?: keyof T,
    extraParams?: Record<string, any>
  ) => Promise<T[]>;
  searchItem?: (
    page: number,
    size: number,
    filters: Partial<T>,
    sortOrder?: string,
    sortBy?: keyof T,
    extraParams?: Record<string, any>
  ) => Promise<T[]>;
  createItem: (
    item: T,
    imageFile: File | null,
    extraParams?: Record<string, any>
  ) => Promise<void>;
  updateItem: (
    id: number,
    item: T,
    imageFile: File | null,
    extraParams?: Record<string, any>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  generalItems?:
    | ((
        item: T,
        imageFile: File | null,
        extraParams?: Record<string, any>
      ) => Promise<void>)
    | Record<
        string,
        (
          item: T,
          imageFile: File | null,
          extraParams?: Record<string, any>
        ) => Promise<void>
      >;
  itemTemplate: () => T;
  columns: ColumnDefinition<T>[];
  sortFieldMap: Record<string, string>;
  extraParams?: Record<string, any>;
  renderCustomFormField?: (
    colKey: keyof T,
    value: any,
    onUpdate: (update: Partial<T>) => void,
    currentItem: T
  ) => React.ReactNode;
  renderCustomAddModal?: (
    onSave: () => Promise<void>,
    onCancel: () => void
  ) => React.ReactNode;
  renderCustomActionModal?: (
    onSave: () => Promise<void>,
    onCancel: () => void,
    generalActionKey: string,
    currentItem: T | null,
    onFieldUpdate: (update: Partial<T>) => void
  ) => React.ReactNode;
  modalSize?: "sm" | "lg" | "xl";
  customModalClass?: string;
  renderCustomValidation?: () => boolean;
  renderCustomActionValidation?: (generalActionKey: string) => boolean;
  customSave?: (
    onSuccess: () => void,
    onError: (error: any) => void
  ) => Promise<void>;
  customIcons?: CRUDIcon[];
  customGeneralActionButtons?: CustomGeneralActionButton[];
  customAddActionButton?: CustomBuiltInActionButton;
  customSubtractActionButton?: CustomBuiltInActionButton;
  pageTitle: string;
  onRowClick?: (item: T) => void;
  rowClassName?: (row: T) => string;
  renderCustomColumn?: (col: ColumnDefinition<T>, item: T) => React.ReactNode;
  generalItemsAddKey?: string;
  generalItemsSubtractKey?: string;
  hiddenAddButton?: boolean;
  hiddenEditButton?: boolean;
  hiddenFilterButton?: boolean;
  hiddenDeleteButton?: boolean;
  hiddenDownloadButton?: boolean;
  hiddenAddPlusButton?: boolean;
  hiddenSubtractButton?: boolean;
  onAddModalOpen?: () => void;
  onAddModalClose?: () => void;
  onEditModalOpen?: (item: T) => void;
  onActionModalOpen?: (key: string) => void;
  onModalClose?: () => void;
  downloadButtonOrder?: number;
  addButtonOrder?: number;
  filterButtonOrder?: number;
  editButtonOrder?: number;
  deleteButtonOrder?: number;
  subtractButtonOrder?: number;
  addPlusButtonOrder?: number;
}

const CRUDForm = <T extends { id: number }>({
  fetchItems,
  searchItem,
  createItem,
  updateItem,
  deleteItem,
  itemTemplate,
  columns,
  sortFieldMap,
  extraParams,
  modalSize,
  renderCustomFormField,
  renderCustomAddModal,
  renderCustomActionModal,
  renderCustomValidation,
  renderCustomActionValidation,
  customIcons,
  customModalClass,
  customSave,
  customGeneralActionButtons,
  customAddActionButton,
  customSubtractActionButton,
  onRowClick,
  rowClassName,
  pageTitle,
  generalItems,
  generalItemsAddKey = "add",
  generalItemsSubtractKey = "subtract",
  hiddenAddButton = true,
  hiddenEditButton = true,
  hiddenFilterButton = true,
  hiddenDeleteButton = true,
  hiddenDownloadButton = true,
  hiddenAddPlusButton = false,
  hiddenSubtractButton = false,
  onAddModalOpen,
  onAddModalClose,
  onEditModalOpen,
  onActionModalOpen,
  onModalClose,
  downloadButtonOrder,
  addButtonOrder,
  filterButtonOrder,
  editButtonOrder,
  deleteButtonOrder,
  subtractButtonOrder,
  addPlusButtonOrder,
}: CRUDFormProps<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [operation, setOperation] = useState<"add" | "edit" | "action">("add");
  const [generalActionKey, setGeneralActionKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [filters, setFilters] = useState<Partial<T>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [allItems, setAllItems] = useState<T[]>([]);
  const [sortOrder, setSortOrder] = useState<Orders>("ASC");
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerTopRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [maxHeaderTop, setMaxHeaderTop] = useState<number>(0);
  const [sortField, setSortField] = useState<keyof T | null>(() => {
  const firstVisibleColumn = columns.find(col => !col.hidden);
  return firstVisibleColumn ? firstVisibleColumn.key : null;
});

  const handleFieldUpdate = useCallback(
    (update: Partial<T>) => {
      if (currentItem) {
        setCurrentItem({ ...currentItem, ...update } as unknown as T);
      }
    },
    [currentItem]
  );

  useEffect(() => {
    fetchAndSetData();
  }, [page, filters, sortField, sortOrder, extraParams]);

  useEffect(() => {
    if (currentItem) {
      validateAllFields();
    }
  }, [currentItem]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedItem(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (
      (operation === "add" || operation === "edit") &&
      renderCustomAddModal &&
      renderCustomValidation
    ) {
      setIsSaveDisabled(!renderCustomValidation());
    }
  }, [operation, renderCustomValidation]);

  useEffect(() => {
    if (
      operation === "action" &&
      generalActionKey &&
      renderCustomActionModal &&
      renderCustomActionValidation
    ) {
      setIsSaveDisabled(!renderCustomActionValidation(generalActionKey));
    }
  }, [operation, generalActionKey, renderCustomActionValidation]);

  useEffect(() => {
    if (!showFilters) {
      setMaxHeaderTop(0);
      return;
    }
    requestAnimationFrame(() => {
      const heights = Object.values(headerTopRefs.current).map((el) =>
        el ? el.offsetHeight : 0
      );
      setMaxHeaderTop(Math.max(0, ...heights));
    });
  }, [showFilters, columns]);
  useEffect(() => {
    const onResize = () => {
      if (!showFilters) return;
      const heights = Object.values(headerTopRefs.current).map((el) =>
        el ? el.offsetHeight : 0
      );
      setMaxHeaderTop(Math.max(0, ...heights));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [showFilters]);

  const fetchAndSetData = async () => {
    try {
      if (extraParams) {
        console.log("Parametros adicionales555:", extraParams);
      }
      const sortFieldParam =
        sortField !== null
          ? sortFieldMap[sortField as string] || String(sortField)
          : undefined;
      const sortOrderParam = sortOrder;
      const activeFilters: Partial<T> = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof T]) {
          activeFilters[key as keyof T] = filters[key as keyof T];
        }
      });
      const hasFilters = Object.keys(activeFilters).length > 0;
      const fetchedItems = hasFilters
        ? await searchItem!(
            page - 1,
            6,
            activeFilters,
            sortOrderParam,
            sortFieldParam as keyof T,
            extraParams
          )
        : await fetchItems(
            page - 1,
            6,
            {},
            sortOrderParam,
            sortFieldParam as keyof T,
            extraParams
          );

      setAllItems(fetchedItems);
      setItems(Array.isArray(fetchedItems) ? fetchedItems : []);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      MySwal.fire("Error", "Error al obtener los datos", "error");
      setItems([]);
    }
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof T
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentItem) return;

    const column = columns.find((col) => col.key === key);
    if (!column?.imageOptions) {
      setErrors((prev) => ({
        ...prev,
        [key]: "No se pudo validar la imagen. Datos incompletos.",
      }));
      return;
    }

    const maxSize = column.imageOptions.maxSize;
    if (maxSize && file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: `El archivo excede el tamaño máximo de ${(
          maxSize /
          1024 /
          1024
        ).toFixed(2)} MB`,
      }));
      return;
    }

    const acceptedFormats = column.imageOptions.acceptedFormats;
    if (acceptedFormats && !acceptedFormats.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: `Formato de imagen no válido. Formatos aceptados: ${acceptedFormats.join(
          ", "
        )}`,
      }));
      return;
    }

    const { width, height } = column.imageOptions;
    if (width || height) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          img.src = result.toString();
          img.onload = () => {
            if (
              (width && img.width !== width) ||
              (height && img.height !== height)
            ) {
              setErrors((prev) => ({
                ...prev,
                [key]: `La imagen debe tener dimensiones exactas de ${
                  width || "libre"
                } x ${height || "libre"} px.`,
              }));
              return;
            }
            handleFieldUpdate({ [key]: file } as any);
            const newErrors = { ...errors };
            delete newErrors[key];
            setErrors(newErrors);
            validateAllFields();
          };
        }
      };
      reader.readAsDataURL(file);
    } else {
      handleFieldUpdate({ [key]: file } as any);
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
      validateAllFields();
    }
  };
  const handleShowModal = (
    operation: "add" | "edit",
    item: T | null = null
  ) => {
    setOperation(operation);
    setCurrentItem(item || itemTemplate());
    setErrors({});
    setIsSaveDisabled(
      operation !== "add" || !renderCustomAddModal ? true : false
    );
    if (operation === "add") {
      onAddModalOpen?.();
    } else if (operation === "edit" && item) {
      onEditModalOpen?.(item);
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    if (operation === "add") {
      onAddModalClose?.();
    }
    onModalClose?.();
    setShowModal(false);
    setCurrentItem(null);
    setGeneralActionKey(null);
    setErrors({});
  };
  const handleRowClick = (item: T) => {
    setSelectedItem(item);
    if (onRowClick) {
      onRowClick(item);
    }
  };
  const handleEditSelectedRow = () => {
    if (selectedItem) {
      handleShowModal("edit", {
        ...selectedItem,
        ...extraParams,
      } as unknown as T);
    }
  };
  const handleDeleteSelectedRow = () => {
    if (selectedItem) {
      handleDelete(selectedItem.id);
    }
  };
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await fetchItems(0, 10000000, filters, sortOrder);
      if (Array.isArray(fetchedData)) {
        return fetchedData;
      } else {
        MySwal.fire("Error", "No se encontraron datos", "error");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      MySwal.fire("Error", "Error al obtener los datos", "error");
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async () => {
    const title = pageTitle || "Datos";
    const allItems = await fetchAllData();
    const visibleColumns = columns.filter(
      (col) => !col.hidden || col.key === "id"
    );
    const filteredItems = allItems.map((item) => {
      const filteredItem: Record<string, any> = {};
      visibleColumns.forEach((col) => {
        if (col.render) {
          filteredItem[col.label] = col.render(item);
        } else {
          filteredItem[col.label] = item[col.key] || "";
        }
      });
      return filteredItem;
    });
    const ws = XLSX.utils.json_to_sheet(filteredItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, `${title}.xlsx`);
  };
  const validateField = (key: keyof T, rawValue: any): string | null => {
    const column = columns.find((col) => col.key === key);
    if (column) {
      if (column.dependentOn && currentItem) {
        const dependentColumn = columns.find(
          (col) => col.key === column.dependentOn
        );
        if (dependentColumn) {
          const dependentRawValue = currentItem[dependentColumn.key];
          const numericValue =
            typeof rawValue === "number"
              ? rawValue
              : parseFloat(String(rawValue));
          const numericDependentValue =
            typeof dependentRawValue === "number"
              ? dependentRawValue
              : parseFloat(String(dependentRawValue));
          if (!isNaN(numericValue) && !isNaN(numericDependentValue)) {
            if (numericValue <= numericDependentValue) {
              return (
                column.validationMessage ||
                `${column.label} debe ser mayor que ${dependentColumn.label}.`
              );
            }
          } else {
            return `${column.label} y ${dependentColumn.label} deben ser números válidos.`;
          }
        }
      }
      if (column.required) {
        if (rawValue == null) {
          return `${column.label} es obligatorio.`;
        }
        if (typeof rawValue === "string" && rawValue.trim() === "") {
          return `${column.label} es obligatorio.`;
        }
        if (
          typeof rawValue === "number" &&
          (isNaN(rawValue) || rawValue <= 0)
        ) {
          return `${column.label} es obligatorio.`;
        }
        if (
          column.type === "image" &&
          rawValue instanceof File === false &&
          (typeof rawValue !== "string" || rawValue === "")
        ) {
          return `${column.label} es obligatorio.`;
        }
      }
      const valueStr = String(rawValue ?? "");
      if (column.minLength && valueStr.length < column.minLength) {
        return `${column.label} debe tener al menos ${column.minLength} caracteres.`;
      }
      if (column.maxLength && valueStr.length > column.maxLength) {
        return `${column.label} no puede exceder los ${column.maxLength} caracteres.`;
      }
      if (column.regex && !column.regex.test(valueStr)) {
        return `${column.label} tiene un formato inválido.`;
      }
    }
    return null;
  };
  const validateAllFields = () => {
    if (!currentItem) return;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let allValid = true;
    let firstErrorShown = false;
    const colsToValidate = editableColumns;
    for (const col of colsToValidate) {
      const rawValue = currentItem[col.key];
      const error = validateField(col.key, rawValue);
      if (error) {
        newErrors[col.key] = error;
        allValid = false;
        if (!firstErrorShown) {
          firstErrorShown = true;
          break;
        }
      }
    }
    setErrors(newErrors);
    setIsSaveDisabled(!allValid);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentItem) {
      const key = name as keyof T;
      const column = columns.find((col) => col.key === key);
      let newValue: any = value;
      if (column?.type === "number") {
        newValue = value === "" ? "" : Number(value);
      }
      handleFieldUpdate({ [key]: newValue } as Partial<T>);
      const error = validateField(key, newValue);
      setErrors((prevErrors) => ({ ...prevErrors, [key]: error || undefined }));
      validateAllFields();
    }
  };
  const handleSave = async () => {
    if (!currentItem || isSaveDisabled) return;
    setIsLoading(true);
    const rawImage = (currentItem as any)?.image;
    const imageFile: File | null = rawImage instanceof File ? rawImage : null;
    try {
      if (customSave) {
        await customSave(
          async () => {
            MySwal.fire("Hecho!", "Elemento añadido con éxito.", "success");
            await fetchAndSetData();
            handleCloseModal();
          },
          async (error: any) => {
            console.error("Error al guardar:", error);
            const message = await getError(error);
            MySwal.fire(
              "Error",
              message || "No se pudo guardar el elemento.",
              "error"
            );
          }
        );
        return;
      }
      if (operation === "action" && generalItems) {
        let fn:
          | ((
              item: T,
              imageFile: File | null,
              extraParams?: Record<string, any>
            ) => Promise<void>)
          | undefined;
        if (typeof generalItems === "function") {
          fn = generalItems;
        } else if (generalActionKey) {
          let actionKey = generalActionKey;
          if (actionKey === "add") {
            actionKey = generalItemsAddKey;
          } else if (actionKey === "subtract") {
            actionKey = generalItemsSubtractKey;
          }
          fn = (generalItems as Record<string, any>)[actionKey];
        }
        if (fn) {
          await fn(currentItem, imageFile, extraParams);
          MySwal.fire("Hecho!", "Acción realizada con éxito.", "success");
          await fetchAndSetData();
          handleCloseModal();
          return;
        }
      }
      if (operation === "add") {
        await createItem(currentItem, imageFile, extraParams);
        MySwal.fire("Hecho!", "Elemento añadido con éxito.", "success");
      } else {
        await updateItem(currentItem.id, currentItem, imageFile, extraParams);
        MySwal.fire(
          "Actualizado!",
          "Elemento actualizado con éxito.",
          "success"
        );
      }
      await fetchAndSetData();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      const message = await getError(error);
      MySwal.fire(
        "Error",
        message || "No se pudo guardar el elemento.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const getError = async (err: any): Promise<string> => {
    if (err instanceof Error) return err.message || "Ocurrió un error.";
    if (typeof err === "string") return err;
    if (
      err &&
      typeof err === "object" &&
      "status" in err &&
      typeof (err as any).text === "function"
    ) {
      try {
        const text = await (err as Response).text();
        try {
          const json = JSON.parse(text);
          return (
            json?.message ||
            json?.error ||
            text ||
            (err as Response).statusText ||
            "Error desconocido"
          );
        } catch {
          return text || (err as Response).statusText || "Error desconocido";
        }
      } catch {
        return (err as any).statusText || "Error desconocido";
      }
    }
    return "No se pudo completar la operación.";
  };

  const openGeneralAction = (key: string) => {
    if (!generalItems) {
      handleShowModal("add");
      return;
    }
    setGeneralActionKey(key);
    setOperation("action");
    const base = selectedItem ? ({ ...selectedItem } as T) : itemTemplate();
    (base as any).quantity = (base as any).quantity ?? 0;
    setCurrentItem(base as unknown as T);
    setErrors({});
    setIsSaveDisabled(true);
    setShowModal(true);
    onActionModalOpen?.(key);
  };
  const handleDelete = (id: number) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡Estas seguro de eliminarlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger",
      },
    }).then((result: SweetAlertResult) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        deleteItem(id)
          .then(() => {
            MySwal.fire(
              "Eliminado!",
              "El elemento ha sido eliminado.",
              "success"
            );
            fetchAndSetData();
          })
          .catch((error) => {
            console.error("Error al eliminar:", error);
            MySwal.fire("Error", "No se pudo eliminar el elemento.", "error");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire("Cancelado", "Elimanacion cancelada", "error");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleCancel = () => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "Tienes cambios sin guardar, ¿quieres cancelar la edición?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar editando",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger",
      },
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        handleCloseModal();
      }
    });
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value || undefined });
    setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
const handleSortChange = (key: keyof T) => {
  if (sortField === key) {
    setSortOrder((prevOrder) => (prevOrder === "ASC" ? "DESC" : "ASC"));
  } else {
    setSortField(key);
    setSortOrder("ASC");
  }
};
  const editableColumns = columns.filter((col) => {
    if (currentItem && col.formHidden && col.formHidden(currentItem))
      return false;
    if (operation === "add" && col.hiddenInCreate) return false;
    if (operation === "edit" && col.hiddenInEdit) return false;
    if (operation === "action" && col.hiddenInCreate) return false;
    return true;
  });
  const getButtonSmallClass = (order?: number, defaultOrder?: number) => {
    if (order !== undefined) {
      return `btn-small${order}`;
    }
    return defaultOrder !== undefined
      ? `btn-small${defaultOrder}`
      : "btn-small";
  };
  const downloadSmallClass = getButtonSmallClass(downloadButtonOrder, 2);
  const addSmallClass = getButtonSmallClass(addButtonOrder, 3);
  const filterSmallClass = getButtonSmallClass(filterButtonOrder);
  const editSmallClass = getButtonSmallClass(editButtonOrder, 4);
  const deleteSmallClass = getButtonSmallClass(deleteButtonOrder, 5);
  const subtractSmallClass = getButtonSmallClass(subtractButtonOrder, 7);
  const addPlusSmallClass = getButtonSmallClass(addPlusButtonOrder, 8);

  const allButtons = [
    ...(hiddenDownloadButton
      ? [
          {
            key: "download",
            className: `btn btn-success ${downloadSmallClass}`,
            onClick: handleDownload,
            icon: <ExcelIcon />,
            order: downloadButtonOrder ?? 1,
            ariaLabel: "Descargar Tabla en Excel",
          },
        ]
      : []),
    ...(hiddenAddButton
      ? [
          {
            key: "add",
            className: `btn btn-error ${addSmallClass}`,
            onClick: () => handleShowModal("add"),
            icon: <AddIcon />,
            order: addButtonOrder ?? 2,
            ariaLabel: "Añadir nuevo elemento",
          },
        ]
      : []),
    ...(hiddenFilterButton
      ? [
          {
            key: "filter",
            className: `btn btn-info ${filterSmallClass}`,
            onClick: () => setShowFilters(!showFilters),
            icon: showFilters ? <FilterIcon /> : <FilterIcon2 />,
            label: showFilters ? "" : "",
            order: filterButtonOrder ?? 3,
            ariaLabel: showFilters ? "" : "",
          },
        ]
      : []),
    ...(hiddenEditButton
      ? [
          {
            key: "edit",
            className: `btn btn-info ${editSmallClass}`,
            onClick: handleEditSelectedRow,
            disabled: !selectedItem,
            icon: <EditIcon />,
            label: "",
            order: editButtonOrder ?? 4,
            ariaLabel: "Editar Elemento Seleccionado",
          },
        ]
      : []),
    ...(hiddenDeleteButton
      ? [
          {
            key: "delete",
            className: `btn btn-danger ${deleteSmallClass}`,
            onClick: handleDeleteSelectedRow,
            disabled: !selectedItem,
            icon: <DeleteIcon />,
            label: "",
            order: deleteButtonOrder ?? 5,
            ariaLabel: "Eliminar Elemento Seleccionado",
          },
        ]
      : []),
    ...(hiddenSubtractButton
      ? [
          {
            key: "subtract",
            className: `btn btn-${
              customSubtractActionButton?.color === "error"
                ? "danger"
                : customSubtractActionButton?.color || "error"
            } ${subtractSmallClass}`,
            onClick: () => openGeneralAction("subtract"),
            icon: customSubtractActionButton?.icon || <Perdidas />,
            label: customSubtractActionButton?.label || "Perdida",
            order:
              customSubtractActionButton?.order ?? subtractButtonOrder ?? 6,
            ariaLabel:
              customSubtractActionButton?.ariaLabel || "Añadir perdida",
          },
        ]
      : []),
    ...(hiddenAddPlusButton
      ? [
          {
            key: "addPlus",
            className: `btn btn-${
              customAddActionButton?.color === "error"
                ? "danger"
                : customAddActionButton?.color || "success"
            } ${addPlusSmallClass}`,
            onClick: () => openGeneralAction("add"),
            icon: customAddActionButton?.icon || <Entrada />,
            label: customAddActionButton?.label || "Entrada",
            order: customAddActionButton?.order ?? addPlusButtonOrder ?? 7,
            ariaLabel: customAddActionButton?.ariaLabel || "Añadir entrada",
          },
        ]
      : []),
    ...(customIcons?.map((iconConfig, index) => ({
      key: `customIcon${index}`,
      className: "btn btn-primary",
      onClick: iconConfig.onClick,
      icon: iconConfig.icon,
      label: iconConfig.label,
      order: undefined,
      ariaLabel: iconConfig.ariaLabel || iconConfig.label,
    })) || []),
    ...(customGeneralActionButtons
      ?.filter((btn) => !btn.hidden)
      .map((btn) => ({
        key: `customGeneral${btn.key}`,
        className: `btn btn-${
          btn.color === "error" ? "danger" : btn.color
        } ${getButtonSmallClass(btn.order)}`,
        onClick: () => openGeneralAction(btn.key),
        icon: btn.icon,
        label: btn.label,
        order: btn.order ?? 999,
        ariaLabel: btn.ariaLabel || btn.label,
      })) || []),
  ];

  const sortedButtons = allButtons.sort((a, b) => {
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;
    return orderA - orderB;
  });

  const getModalTitle = () => {
    if (operation === "add") return "Añadir";
    if (operation === "edit") return "Editar";
    if (operation === "action" && generalActionKey) {
      if (generalActionKey === "add")
        return customAddActionButton?.label || "Entrada";
      if (generalActionKey === "subtract")
        return customSubtractActionButton?.label || "Perdida";
      const customBtn = customGeneralActionButtons?.find(
        (b) => b.key === generalActionKey
      );
      return customBtn?.label || generalActionKey;
    }
    return "";
  };

  return (
    <div className="container-fluid" ref={tableRef}>
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="button-container">
              {sortedButtons.map((btnConfig) => (
                <Button
                  key={btnConfig.key}
                  className={`${btnConfig.className} me-2`}
                  onClick={btnConfig.onClick}
                  disabled={(btnConfig as any).disabled}
                  aria-label={btnConfig.ariaLabel}
                >
                  {btnConfig.icon && (
                    <span className="icon">{btnConfig.icon}</span>
                  )}
                  {btnConfig.label && <span>{btnConfig.label}</span>}
                </Button>
              ))}
            </div>
          </div>
          <div className="table-responsive">
            <Table bordered hover className="table">
              <thead>
                <tr>
                  {columns.map(
                    (col) =>
                      !col.hidden && (
                        <th
                          key={String(col.key)}
                          onClick={() => handleSortChange(col.key)}
                          style={{ cursor: "pointer" }}
                          className="th-flex"
                        >
                          <div className="th-body">
                            <div
                              className="d-flex justify-content-between align-items-center th-top"
                              ref={(el) => {
                                headerTopRefs.current[String(col.key)] = el;
                              }}
                              style={
                                showFilters && maxHeaderTop
                                  ? { minHeight: maxHeaderTop }
                                  : undefined
                              }
                            >
                              <span title={col.label}>{col.label}</span>
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className={`bi bi-arrow-down-up ${
                                    sortField === col.key
                                      ? sortOrder === "ASC"
                                        ? "asc"
                                        : "desc"
                                      : ""
                                  }`}
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5-.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
                                  />
                                </svg>
                              </span>
                            </div>
                            {showFilters && (
                              <div className="th-filter">
                                {/* 🔥 CAMBIO PRINCIPAL: Renderizar input tipo date si col.type === "date" */}
                                {col.type === "date" ? (
                                  <Form.Control
                                    type="date"
                                    name={String(col.key)}
                                    placeholder={`Filtrar por ${col.label}`}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                    disabled={isLoading}
                                  />
                                ) : (
                                  <Form.Control
                                    type="text"
                                    name={String(col.key)}
                                    placeholder={`Filtrar por ${col.label}`}
                                    onChange={handleFilterChange}
                                    className="filter-input"
                                    disabled={isLoading}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id ?? "unknown"}
                    onClick={() => handleRowClick(item)}
                    className={rowClassName ? rowClassName(item) : ""}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedItem && selectedItem.id === item.id
                          ? "#cc322d"
                          : "transparent",
                    }}
                  >
                    {columns.map(
                      (col) =>
                        !col.hidden &&
                        (!col.tableHidden || !col.tableHidden(item)) && (
                          <td
                            key={String(col.key)}
                            data-fulltext={String(item[col.key] || "")}
                            title={String(item[col.key] || "")}
                          >
                            {col.render ? (
                              col.render(item)
                            ) : col.type === "image" && item[col.key] ? (
                              <img
                                src={String(item[col.key])}
                                alt={`${col.label}`}
                                style={{
                                  maxWidth: col.imageOptions?.width || 50,
                                  maxHeight: col.imageOptions?.height || 50,
                                  objectFit: "contain",
                                }}
                              />
                            ) : item[col.key] !== undefined &&
                              item[col.key] !== null ? (
                              String(item[col.key])
                            ) : (
                              "N/A"
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="pagination-container d-flex justify-content-center">
              <Button
                className="btn btn-outline-primary btn-sm me-1"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <i className="fa-solid fa-angle-double-left"></i>
              </Button>
              {page > 1 && (
                <>
                  <Button
                    className={`btn btn-sm ${
                      page === 1 ? "btn-primary" : "btn-outline-primary"
                    } me-1`}
                    onClick={() => handlePageChange(1)}
                    disabled={isLoading}
                  >
                    1
                  </Button>
                  {page > 2 && (
                    <Button
                      className={`btn btn-sm ${
                        page === page - 1
                          ? "btn-primary"
                          : "btn-outline-primary"
                      } me-1`}
                      onClick={() => handlePageChange(page - 1)}
                      disabled={isLoading}
                    >
                      {page - 1}
                    </Button>
                  )}
                </>
              )}
              <Button
                className="btn btn-sm btn-primary me-1"
                disabled={isLoading}
              >
                {page}
              </Button>
              {items.length === pageSize && (
                <Button
                  className={`btn btn-sm ${
                    page === page + 1 ? "btn-primary" : "btn-outline-primary"
                  } me-1`}
                  onClick={() => handlePageChange(page + 1)}
                  disabled={isLoading}
                >
                  {page + 1}
                </Button>
              )}
              <Button
                className="btn btn-outline-primary btn-sm ms-"
                onClick={() => handlePageChange(page + 1)}
                disabled={items.length < pageSize || isLoading}
              >
                <i className="fa-solid fa-angle-double-right"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div
          className="loading-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <HandLoadingSpinner />
        </div>
      )}
      <Modal
        show={showModal}
        onHide={handleCancel}
        size={modalSize || "lg"}
        centered
        className={customModalClass}
        style={{ overflow: "visible" }}
        dialogClassName="modal-overflow-visible"
      >
        <Modal.Header closeButton>
          <Modal.Title>{getModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentItem &&
            (operation === "action" &&
            renderCustomActionModal &&
            generalActionKey ? (
              <div className="custom-modal-content">
                {renderCustomActionModal(
                  handleSave,
                  handleCloseModal,
                  generalActionKey,
                  currentItem,
                  handleFieldUpdate
                )}
              </div>
            ) : (operation === "add" || operation === "edit") &&
              renderCustomAddModal ? (
              <div className="custom-modal-content">
                {renderCustomAddModal(handleSave, handleCloseModal)}
              </div>
            ) : (
              <Form>
                <Row>
                  {editableColumns.length <= 4
                    ? editableColumns.map((col, index) => (
                        <Col md={12} key={index}>
                          <Form.Group className="mb-3">
                            <Form.Label>{col.label}</Form.Label>
                            {renderCustomFormField &&
                              renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              )}
                            {(!renderCustomFormField ||
                              !renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              )) && (
                              <>
                                {col.type === "image" ? (
                                  <div className="mb-2">
                                    {/* ✅ Mostrar imagen actual primero */}
                                    {currentItem[col.key] && (
                                      <div className="mb-2">
                                        <img
                                          src={
                                            currentItem[col.key] instanceof File
                                              ? URL.createObjectURL(
                                                  currentItem[col.key] as File
                                                )
                                              : String(currentItem[col.key])
                                          }
                                          alt="Vista previa"
                                          className="w-20 h-20 object-cover rounded"
                                          style={{
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            objectFit: "contain",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "4px",
                                          }}
                                        />
                                      </div>
                                    )}
                                    {/* Input para cambiar la imagen */}
                                    <input
                                      type="file"
                                      accept={
                                        col.imageOptions?.acceptedFormats?.join(
                                          ","
                                        ) || "image/*"
                                      }
                                      className="form-control"
                                      name={String(col.key)}
                                      onChange={(e) =>
                                        handleFileChange(
                                          e as React.ChangeEvent<HTMLInputElement>,
                                          col.key
                                        )
                                      }
                                      aria-label={col.label}
                                      disabled={isLoading}
                                    />
                                    {errors[col.key] && (
                                      <div className="text-danger mt-1">
                                        {errors[col.key]}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <Form.Control
                                      type={
                                        col.key === "password"
                                          ? "password"
                                          : col.type === "date"
                                          ? "date"
                                          : "text"
                                      }
                                      name={String(col.key)}
                                      placeholder={col.label}
                                      value={String(currentItem[col.key]) || ""}
                                      onChange={handleChange}
                                      aria-label={col.label}
                                      isInvalid={!!errors[col.key]}
                                      disabled={isLoading}
                                    />
                                    {errors[col.key] && (
                                      <div className="text-danger">
                                        {errors[col.key]}
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                            {renderCustomFormField &&
                              renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              ) &&
                              errors[col.key] && (
                                <div className="text-danger mt-1">
                                  {errors[col.key]}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      ))
                    : editableColumns.map((col, index) => (
                        <Col md={6} key={index}>
                          <Form.Group className="mb-3">
                            <Form.Label>{col.label}</Form.Label>
                            {renderCustomFormField &&
                              renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              )}
                            {(!renderCustomFormField ||
                              !renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              )) && (
                              <>
                                {col.type === "image" ? (
                                  <div className="mb-2">
                                    {currentItem[col.key] && (
                                      <div className="mb-2">
                                        <img
                                          src={
                                            currentItem[col.key] instanceof File
                                              ? URL.createObjectURL(
                                                  currentItem[col.key] as File
                                                )
                                              : String(currentItem[col.key])
                                          }
                                          alt="Vista previa"
                                          style={{
                                            maxWidth: "100%",
                                            maxHeight: "200px",
                                            objectFit: "contain",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "4px",
                                          }}
                                        />
                                      </div>
                                    )}
                                    <Form.Control
                                      type="file"
                                      accept={col.imageOptions?.acceptedFormats?.join(
                                        ","
                                      )}
                                      name={String(col.key)}
                                      onChange={(e) =>
                                        handleFileChange(
                                          e as React.ChangeEvent<HTMLInputElement>,
                                          col.key
                                        )
                                      }
                                      aria-label={col.label}
                                      disabled={isLoading}
                                    />
                                    {errors[col.key] && (
                                      <div className="text-danger mt-1">
                                        {errors[col.key]}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    <Form.Control
                                      type={
                                        col.key === "password"
                                          ? "password"
                                          : col.type === "date"
                                          ? "date"
                                          : "text"
                                      }
                                      name={String(col.key)}
                                      placeholder={col.label}
                                      value={String(currentItem[col.key]) || ""}
                                      onChange={handleChange}
                                      aria-label={col.label}
                                      isInvalid={!!errors[col.key]}
                                    />
                                    {errors[col.key] && (
                                      <div className="text-danger mt-1">
                                        {errors[col.key]}
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                            {renderCustomFormField &&
                              renderCustomFormField(
                                col.key,
                                currentItem[col.key],
                                handleFieldUpdate,
                                currentItem
                              ) &&
                              errors[col.key] && (
                                <div className="text-danger mt-1">
                                  {errors[col.key]}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      ))}
                </Row>
              </Form>
            ))}
        </Modal.Body>
        <Modal.Footer className="border-top btn-sm  pt-4">
          <Button
            className="btn btn-success me-1 btn-sm px-6"
            onClick={handleSave}
            disabled={isSaveDisabled || isLoading}
            style={{
              opacity: isSaveDisabled ? 0.5 : 1,
              borderRadius: "0.375rem",
            }}
          >
            <i className="fa-solid fa-floppy-disk me-1"></i> Guardar
          </Button>
          <Button
            className="btn btn-danger btn-sm px-2"
            onClick={handleCancel}
            style={{ borderRadius: "0.375rem" }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUDForm;
