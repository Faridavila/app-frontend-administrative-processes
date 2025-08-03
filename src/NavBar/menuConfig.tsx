import {
  FiSettings,
  FiBriefcase,
  FiHome,
  FiLayers,
  FiUsers,
  FiFileText,
  FiStar,
  FiMail,

} from "react-icons/fi";
import { SiAuthentik } from "react-icons/si";


interface Favorito {
  path: string;
  label: string; 
}


let favoritos: Favorito[] = JSON.parse(
  localStorage.getItem("favoritos") || "[]"
);

export const agregarFavorito = (nuevoFavorito: Favorito) => {
  const existe = favoritos.some((fav) => fav.path === nuevoFavorito.path);
  if (!existe) {
    favoritos.push(nuevoFavorito);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
};

export const eliminarFavorito = (path: string) => {
  favoritos = favoritos.filter((fav) => fav.path !== path);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
};


export const menuConfig = () => [
  {
    sectionTitle: "Mis Favoritos", 
    title: "Favoritos", 
    icon: <FiStar fontSize="inherit" style={{ fontSize: "20px" }} />,
    subMenus: favoritos,
  },
  {
    sectionTitle: "Configuraciones del Sistema", 
    title: "Configuraciónfff",
    icon: <FiSettings fontSize="inherit" style={{ fontSize: "20px" }} />,
    subMenus: [
      { path: "/company", label: "Presentación", icon: <FiHome /> },
      { path: "/user", label: "Usuarios", icon: <FiHome /> },
      { path: "/configCompany", label: "Empresa", icon: <FiHome /> },
      {
        path: "/department",
        label: "Departamentos (DEPS)",
        icon: <FiLayers />,
      },
      { path: "/city", label: "Localidad (LCD)", icon: <FiHome /> },
      { path: "/comprobante", label: "Comprobante (FC)", icon: <FiFileText /> },
    ],
  },
  {
    sectionTitle: "Gestión de Terceros", 
    title: "Terceros",
    icon: <FiUsers fontSize="inherit" style={{ fontSize: "20px" }} />,
    subMenus: [
      {
        path: "/currencyType",
        label: "Tipo de moneda (TDM)",
        icon: <FiFileText />,
      },
      {
        path: "/economicActivity",
        label: "Actividad Económica",
        icon: <FiBriefcase />,
      },
    ],
  },
  {
    sectionTitle: "Procesos Automáticos", 
    title: "Creación de procesos", 
    icon: <FiMail fontSize="inherit" style={{ fontSize: "20px" }} />,
    subMenus: [
      { path: "/action", label: "Acciones (ACT)", icon: <SiAuthentik /> },
      { path: "/process", label: "Process (PRS)", icon: <FiLayers /> },
      { path: "/processCompany", label: "ProcessCompany", icon: <SiAuthentik /> },
      { path: "/Parameter", label: "Parametro", icon: <SiAuthentik /> },
      { path: "/actionParameter", label: "action parametere", icon: <SiAuthentik /> },
      { path: "/ParameterType", label: "Tipo de parametro", icon: <SiAuthentik /> },
    ],
  },
];
