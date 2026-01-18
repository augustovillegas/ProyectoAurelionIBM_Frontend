#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                   🏪  PROYECTO AURELION - VISOR INTERACTIVO  🏪              ║
║                                                                               ║
║                         Sistema de Navegación Multinivel                      ║
║                              Documentación Técnica                            ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Características principales:
• Navegación multinivel con menús y submenús
• Breadcrumbs (migas de pan) para orientación
• Sistema intuitivo de navegación: [0] Volver, [R] Recargar, [Q] Salir
• Visualización profesional y clara de la información
• Lectura dinámica de DOCUMENTACION.md
• Secciones organizadas jerárquicamente

Autor: Augusto Villegas
Proyecto: IBM & Guayerd - Análisis de Datos Retail
"""

import os
import re
import sys
import unicodedata
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

# Configurar codificación UTF-8 para Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RUTA_DOC = os.path.join(BASE_DIR, "DOCUMENTACION.md")
DEMO_MODE = False
ASCII_MODE = True 
ANCHO_MARCO = 78


class TipoOpcion(Enum):
    """Tipos de opciones en el menú."""
    CONTENIDO = "contenido"
    SUBMENU = "submenu"
    ACCION = "accion"


@dataclass
class OpcionMenu:
    """Representa una opción del menú con metadatos completos."""
    clave: str
    etiqueta: str
    icono: str
    tipo: TipoOpcion
    descripcion: Optional[str] = None
    hijos: List['OpcionMenu'] = field(default_factory=list)


# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIONES DE UTILIDAD Y CARGA DE DATOS
# ═══════════════════════════════════════════════════════════════════════════════

def pausar():
    if DEMO_MODE:
        return
    try:
        input("\n💡 Presioná [ENTER] para continuar...")
    except EOFError:
        return

def cargar_documentacion(ruta: str) -> str:
    if not os.path.exists(ruta):
        print("\n" + "╔" + "═" * ANCHO_MARCO + "╗")
        print(linea_marco(" ERROR - ARCHIVO NO ENCONTRADO ", ANCHO_MARCO, "║", "║"))
        print("╚" + "═" * ANCHO_MARCO + "╝")
        print(f"\n📁 Ruta esperada: {os.path.abspath(ruta)}")
        print("⚠️  Asegurate de que DOCUMENTACION.md esté en la misma carpeta que programa.py\n")
        return ""
    try:
        with open(ruta, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"\n❌ Error al leer el archivo: {e}\n")
        return ""

def limpiar_pantalla():
    os.system('cls' if os.name == 'nt' else 'clear')


def ancho_visual(texto: str) -> int:
    ancho = 0
    for char in texto:
        code_point = ord(char)
        if (0x1F300 <= code_point <= 0x1F9FF or
            0x2600 <= code_point <= 0x27BF or
            0x2B50 <= code_point <= 0x2B55):
            ancho += 2
        else:
            ancho += 1
    return ancho


def linea_marco(texto: str, ancho: int, borde_izq: str = "║", borde_der: str = "║") -> str:
    ancho_texto = ancho_visual(texto)
    espacios_totales = ancho - ancho_texto
    espacios_izq = espacios_totales // 2
    espacios_der = espacios_totales - espacios_izq
    return f"{borde_izq}{' ' * espacios_izq}{texto}{' ' * espacios_der}{borde_der}"


def parsear_secciones(md: str) -> Dict[str, str]:
    secciones: Dict[str, str] = {}
    md = md.strip()

    if not md:
        return secciones

    secciones["DOC_COMPLETA"] = md

    patron_h2 = re.compile(r"^##\s+(.+?)$", re.MULTILINE)
    patron_h3 = re.compile(r"^###\s+(.+?)$", re.MULTILINE)
    patron_h4 = re.compile(r"^####\s+(.+?)$", re.MULTILINE)
    
    matches_h2 = list(patron_h2.finditer(md))

    if matches_h2:
        intro = md[:matches_h2[0].start()].strip()
        if intro:
            secciones["INTRO"] = intro

    for i, match in enumerate(matches_h2):
        titulo = match.group(1).strip()
        inicio = match.start()
        fin = matches_h2[i + 1].start() if i + 1 < len(matches_h2) else len(md)
        contenido_completo = md[inicio:fin].strip()
        
        clave = normalizar_clave(titulo)
        secciones[clave] = contenido_completo
        
        subseccion_matches = list(patron_h3.finditer(contenido_completo))
        for j, sub_match in enumerate(subseccion_matches):
            sub_titulo = sub_match.group(1).strip()
            sub_inicio = sub_match.start()
            sub_fin = subseccion_matches[j + 1].start() if j + 1 < len(subseccion_matches) else len(contenido_completo)
            sub_contenido = contenido_completo[sub_inicio:sub_fin].strip()
            
            sub_clave = f"{clave}_{normalizar_clave(sub_titulo)}"
            secciones[sub_clave] = sub_contenido
            
            h4_matches = list(patron_h4.finditer(sub_contenido))
            for k, h4_match in enumerate(h4_matches):
                h4_titulo = h4_match.group(1).strip()
                h4_inicio = h4_match.start()
                h4_fin = h4_matches[k + 1].start() if k + 1 < len(h4_matches) else len(sub_contenido)
                h4_contenido = sub_contenido[h4_inicio:h4_fin].strip()
                
                h4_clave = f"{sub_clave}_{normalizar_clave(h4_titulo)}"
                secciones[h4_clave] = h4_contenido

    return secciones


def normalizar_clave(titulo: str) -> str:
    titulo = re.sub(r'[^\w\s\-]', '', titulo)
    titulo = re.sub(r'\s+', '_', titulo.strip())
    return titulo.upper()


def _es_emoji(ch: str) -> bool:
    cp = ord(ch)
    return 0x1F300 <= cp <= 0x1FAFF or 0x1F600 <= cp <= 0x1F64F


def ancho_visual(texto: str) -> int:
    """Calcula el ancho en consola considerando caracteres de doble ancho."""
    ancho = 0
    for ch in texto:
        if unicodedata.combining(ch):
            continue
        if unicodedata.east_asian_width(ch) in ("F", "W") or _es_emoji(ch):
            ancho += 2
        else:
            ancho += 1
    return ancho


def recortar_visual(texto: str, ancho: int) -> str:
    """Recorta texto para que no exceda el ancho visual especificado."""
    resultado = []
    acumulado = 0
    for ch in texto:
        w = ancho_visual(ch)
        if acumulado + w > ancho:
            break
        resultado.append(ch)
        acumulado += w
    return "".join(resultado)


def rellenar_visual(texto: str, ancho: int, alineacion: str = "left") -> str:
    """Rellena con espacios respetando ancho visual y truncando con elipsis."""
    if ancho <= 0:
        return ""
    if ancho_visual(texto) > ancho:
        texto = recortar_visual(texto, max(ancho - 1, 0)) + ("…" if ancho > 1 else "")
    faltante = max(ancho - ancho_visual(texto), 0)
    if alineacion == "right":
        return " " * faltante + texto
    if alineacion == "center":
        izq = faltante // 2
        der = faltante - izq
        return " " * izq + texto + " " * der
    return texto + " " * faltante


def centrar_visual(texto: str, ancho: int) -> str:
    """Centra texto según su ancho visual."""
    return rellenar_visual(texto, ancho, alineacion="center")


def envolver_texto_display(texto: str, ancho: int) -> List[str]:
    """Envuelve texto respetando el ancho visual."""
    lineas: List[str] = []
    actual = ""
    ancho_actual = 0
    for palabra in texto.split():
        palabra_ancho = ancho_visual(palabra)
        sep = 1 if actual else 0
        if ancho_actual + sep + palabra_ancho > ancho:
            if actual:
                lineas.append(actual)
            actual = palabra
            ancho_actual = palabra_ancho
        else:
            if actual:
                actual += " "
                ancho_actual += 1
            actual += palabra
            ancho_actual += palabra_ancho
    if actual:
        lineas.append(actual)
    if not lineas:
        lineas.append("")
    return lineas


def dividir_por_ancho(texto: str, ancho: int) -> List[str]:
    """Divide texto en segmentos consecutivos respetando el ancho visual."""
    if ancho <= 0:
        return [""]
    lineas: List[str] = []
    actual = ""
    ancho_actual = 0
    for ch in texto:
        w = ancho_visual(ch)
        if ancho_actual + w > ancho:
            lineas.append(actual)
            actual = ch
            ancho_actual = w
        else:
            actual += ch
            ancho_actual += w
    if actual or not lineas:
        lineas.append(actual)
    return lineas


def linea_marco(contenido: str, ancho: int = ANCHO_MARCO, borde_izq: str = "│", borde_der: str = "│") -> str:
    """Retorna una línea enmarcada con los bordes indicados."""
    return f"{borde_izq}{rellenar_visual(contenido, ancho)}{borde_der}"


# ═══════════════════════════════════════════════════════════════════════════════
# CONSTRUCCIÓN DE ESTRUCTURA DE MENÚS
# ═══════════════════════════════════════════════════════════════════════════════

def _strip_accents(text: str) -> str:
    """Elimina acentos para comparaciones robustas en claves/títulos."""
    text_nfd = unicodedata.normalize('NFD', text)
    return ''.join(ch for ch in text_nfd if unicodedata.category(ch) != 'Mn')


def _normalize_for_match(text: str) -> str:
    """Normaliza texto para comparación: minúsculas, sin acentos, guiones bajos."""
    t = _strip_accents(text).lower()
    t = re.sub(r"[^a-z0-9]+", "_", t)
    return t.strip('_')


def _get_title_from_content(content: str) -> Optional[str]:
    """Extrae el título de la primera línea de encabezado del bloque (##, ###, o ####)."""
    for line in content.splitlines():
        m = re.match(r"^\s*#{2,4}\s+(.*)$", line)
        if m:
            return m.group(1).strip()
    return None


def _find_first_key_by_tokens(secciones: Dict[str, str], tokens: List[str]) -> Optional[str]:
    """Busca la primera clave cuyo nombre normalizado contenga todos los tokens."""
    toks = [_normalize_for_match(tok) for tok in tokens]
    for k in secciones.keys():
        kn = _normalize_for_match(k)
        if all(tok in kn for tok in toks):
            return k
    return None


def construir_estructura_menus(secciones: Dict[str, str]) -> OpcionMenu:
    """Construye dinámicamente el árbol de menús según las secciones detectadas."""
    menu_raiz = OpcionMenu(
        clave="RAIZ", etiqueta="Proyecto Aurelion - Documentación Técnica", icono="🏪", tipo=TipoOpcion.SUBMENU
    )

    # Opción: Ver documentación completa
    if "DOC_COMPLETA" in secciones:
        menu_raiz.hijos.append(OpcionMenu(
            clave="DOC_COMPLETA", etiqueta="Ver Documentación Completa", icono="📄", tipo=TipoOpcion.CONTENIDO,
            descripcion="Visualiza todo el documento en una sola vista"
        ))

    # Introducción / portada e índice
    if "INTRO" in secciones:
        menu_raiz.hijos.append(OpcionMenu(
            clave="INTRO", etiqueta="Introducción y Tabla de Contenidos", icono="🏠", tipo=TipoOpcion.CONTENIDO,
            descripcion="Portada, índice y organización del proyecto"
        ))

    # TL;DR (buscar clave que contenga TLDR)
    k_tldr = _find_first_key_by_tokens(secciones, ["TLDR"]) 
    if k_tldr:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_tldr, etiqueta="Resumen Ejecutivo (TL;DR)", icono="📋", tipo=TipoOpcion.CONTENIDO,
            descripcion="Cambios clave y resultados principales en formato resumido"
        ))

    # Cómo ejecutar el visor
    k_ejecutar = _find_first_key_by_tokens(secciones, ["como", "ejecutar"])
    if k_ejecutar:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_ejecutar, etiqueta="Cómo Ejecutar el Visor", icono="🚀", tipo=TipoOpcion.CONTENIDO,
            descripcion="Instrucciones de instalación y ejecución del programa"
        ))

    # Visión general (buscar por tokens)
    k_vision = _find_first_key_by_tokens(secciones, ["vision", "general"])
    if k_vision:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_vision, etiqueta="Visión General del Proyecto", icono="🎯", tipo=TipoOpcion.CONTENIDO,
            descripcion="Objetivos estratégicos y estructura del proyecto"
        ))

    # Construir Sprint 1 usando función especializada
    sprint1 = construir_submenu_sprint1(secciones)
    if sprint1:
        menu_raiz.hijos.append(sprint1)
    
    # Construir Sprint 2 usando función especializada con etapas
    sprint2 = construir_submenu_sprint2(secciones)
    if sprint2:
        menu_raiz.hijos.append(sprint2)

    # Construir Sprint 3 (Machine Learning y Modelado Predictivo)
    sprint3 = construir_submenu_sprint3(secciones)
    if sprint3:
        menu_raiz.hijos.append(sprint3)

    # Referencias y Glosario
    k_refs = _find_first_key_by_tokens(secciones, ["referencia", "bibliografia"])
    if k_refs:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_refs, etiqueta="Referencias y Bibliografía", icono="📚", tipo=TipoOpcion.CONTENIDO,
            descripcion="Fuentes, bibliografía y recursos utilizados"
        ))
    
    k_glos = _find_first_key_by_tokens(secciones, ["glosario"])
    if k_glos:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_glos, etiqueta="Glosario de Términos", icono="📖", tipo=TipoOpcion.CONTENIDO,
            descripcion="Definiciones de términos técnicos y de negocio"
        ))
    
    # Mapa de artefactos
    k_mapa = _find_first_key_by_tokens(secciones, ["mapa", "artefactos"])
    if k_mapa:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_mapa, etiqueta="Mapa de Artefactos", icono="🗂️", tipo=TipoOpcion.CONTENIDO,
            descripcion="Inventario completo de archivos y modelos generados"
        ))
    
    # Outputs de artefactos
    k_outputs = _find_first_key_by_tokens(secciones, ["outputs", "artefactos"])
    if k_outputs:
        menu_raiz.hijos.append(OpcionMenu(
            clave=k_outputs, etiqueta="Outputs de Artefactos (Muestras)", icono="📊", tipo=TipoOpcion.CONTENIDO,
            descripcion="Ejemplos de salidas y resultados de los modelos"
        ))

    # Opción 13: Diagrama de flujo del menú
    menu_raiz.hijos.append(OpcionMenu(
        clave="DIAGRAMA_FLUJO_MENU", etiqueta="Diagrama de Flujo del Menú", icono="🔀", tipo=TipoOpcion.CONTENIDO,
        descripcion="Visualiza el diagrama de flujo de navegación del menú"
    ))

    if ASCII_MODE:
        aplicar_ascii_iconos(menu_raiz)
    return menu_raiz

def aplicar_ascii_iconos(menu: OpcionMenu):
    """Reemplaza iconos por ASCII simple si la consola no soporta Unicode."""
    stack = [menu]
    while stack:
        nodo = stack.pop()
        nodo.icono = "*"
        stack.extend(nodo.hijos)


def construir_submenu_sprint3(secciones: Dict[str, str]) -> Optional[OpcionMenu]:
    """Construye el submenú completo del Sprint 3 con todas las nuevas secciones y subapartados."""
    # Buscar clave base de Sprint 3
    clave_base = None
    for k in secciones:
        kn = _normalize_for_match(k)
        partes = k.split('_')
        if re.match(r"^4_.*sprint.*3", kn):
            clave_base = k
            break
    if not clave_base:
        return None

    sprint3 = OpcionMenu(
        clave=clave_base,
        etiqueta="Sprint 3 (Demo 3 – Machine Learning y Modelado Predictivo)",
        icono="3️⃣",
        tipo=TipoOpcion.SUBMENU,
        descripcion="Modelado predictivo, métricas, artefactos y mejores prácticas"
    )

    # Ver Sprint 3 completo
    sprint3.hijos.append(OpcionMenu(
        clave=clave_base,
        etiqueta="Ver Sprint 3 Completo",
        icono="📖",
        tipo=TipoOpcion.CONTENIDO,
        descripcion="Todo el contenido del Sprint 3 en una sola vista"
    ))

    # Buscar todas las subsecciones H3 de Sprint 3
    subsecciones = []
    for k in secciones:
        if k.startswith(clave_base + "_"):  # H3 subsections
            titulo = _get_title_from_content(secciones[k])
            if titulo:
                # Determinar icono
                icono = "📄"
                t = titulo.lower()
                if "objetivo" in t:
                    icono = "🎯"
                elif "parámetro" in t or "artefacto" in t:
                    icono = "🗃️"
                elif "indicador" in t or "métrica" in t:
                    icono = "📊"
                elif "recomendación" in t or "consideración" in t:
                    icono = "💡"
                elif "próximo" in t:
                    icono = "⏭️"
                elif "trazabilidad" in t or "calidad" in t:
                    icono = "🔎"
                elif "hiperparámetro" in t or "validación" in t:
                    icono = "⚙️"
                elif "limitación" in t or "advertencia" in t:
                    icono = "⚠️"
                elif "ética" in t or "privacidad" in t:
                    icono = "🔐"
                elif "mantenimiento" in t or "actualización" in t:
                    icono = "🔄"
                elif "reproducibilidad" in t or "entorno" in t:
                    icono = "🖥️"
                elif "esquema" in t:
                    icono = "🗺️"
                elif "feature" in t:
                    icono = "🧩"
                elif "explicación" in t or "métrica" in t:
                    icono = "📏"
                elif "benchmark" in t or "alternativo" in t:
                    icono = "🏁"
                elif "impacto" in t or "caso de uso" in t:
                    icono = "🚀"
                elif "checklist" in t or "práctica" in t:
                    icono = "✅"
                subsecciones.append((k, titulo, icono))

    # Ordenar por código numérico
    def _num_key(label: str) -> Tuple:
        m = re.match(r"^\s*(\d+(?:\.\d+)+)", label)
        if not m:
            return (999,)
        return tuple(int(x) for x in m.group(1).split('.'))

    subsecciones.sort(key=lambda x: _num_key(x[1]))

    # Agregar subsecciones
    for clave, etiqueta, icono in subsecciones:
        sprint3.hijos.append(OpcionMenu(
            clave=clave,
            etiqueta=etiqueta,
            icono=icono,
            tipo=TipoOpcion.CONTENIDO,
            descripcion=""
        ))

    return sprint3


def construir_submenu_sprint1(secciones: Dict[str, str]) -> Optional[OpcionMenu]:
    """Construye el submenú completo del Sprint 1 dinámicamente."""
    # Buscar clave base de Sprint 1
    clave_base = None
    for k in secciones:
        kn = _normalize_for_match(k)
        partes = k.split('_')
        if re.match(r"^2_.*sprint.*1", kn):
            clave_base = k
            break
    
    if not clave_base:
        return None
    
    sprint1 = OpcionMenu(
        clave=clave_base,
        etiqueta="Sprint 1 (Demo 1 – asincrónica)",
        icono="1️⃣",
        tipo=TipoOpcion.SUBMENU,
        descripcion="Definición del problema, datasets y estructura de tablas"
    )
    
    # Ver Sprint 1 completo
    sprint1.hijos.append(OpcionMenu(
        clave=clave_base,
        etiqueta="Ver Sprint 1 Completo",
        icono="📖",
        tipo=TipoOpcion.CONTENIDO,
        descripcion="Todo el contenido del Sprint 1 en una sola vista"
    ))
    
    # Buscar todas las subsecciones H3 de Sprint 1
    subsecciones = []
    for k in secciones:
        if k.startswith(clave_base + "_"):  # H3 subsections
            titulo = _get_title_from_content(secciones[k])
            if titulo:
                # Determinar icono
                icono = "📄"
                if "problema" in titulo.lower() or "solución" in titulo.lower():
                    icono = "🎯"
                elif "dataset" in titulo.lower():
                    icono = "📊"
                elif "estructura" in titulo.lower() or "tabla" in titulo.lower():
                    icono = "🗂️"
                elif "escala" in titulo.lower() or "medición" in titulo.lower():
                    icono = "📏"
                elif "ia" in titulo.lower() or "sugerencia" in titulo.lower():
                    icono = "🤖"
                
                subsecciones.append((k, titulo, icono))
    
    # Ordenar por código numérico
    def _num_key(label: str) -> Tuple:
        m = re.match(r"^\s*(\d+(?:\.\d+)+)", label)
        if not m:
            return (999,)
        return tuple(int(x) for x in m.group(1).split('.'))
    
    subsecciones.sort(key=lambda x: _num_key(x[1]))
    
    # Agregar subsecciones
    for clave, etiqueta, icono in subsecciones:
        sprint1.hijos.append(OpcionMenu(
            clave=clave,
            etiqueta=etiqueta,
            icono=icono,
            tipo=TipoOpcion.CONTENIDO,
            descripcion=""
        ))
    
    return sprint1


def construir_submenu_sprint2(secciones: Dict[str, str]) -> Optional[OpcionMenu]:
    """Construye el submenú completo del Sprint 2 con subsecciones agrupadas."""
    # Buscar clave base de Sprint 2 (debe tener exactamente 6 partes)
    clave_base = None
    for k in secciones:
        kn = _normalize_for_match(k)
        partes = k.split('_')
        if re.match(r"^3_.*sprint.*2", kn) and len(partes) == 6:
            clave_base = k
            break
    
    if not clave_base:
        return None
    
    sprint2 = OpcionMenu(
        clave=clave_base,
        etiqueta="Sprint 2 (Demo 2 – sincrónica)",
        icono="2️⃣",
        tipo=TipoOpcion.SUBMENU,
        descripcion="ETL, análisis descriptivo y consolidación de datos"
    )
    
    # Ver Sprint 2 completo
    sprint2.hijos.append(OpcionMenu(
        clave=clave_base,
        etiqueta="Ver Sprint 2 Completo",
        icono="📖",
        tipo=TipoOpcion.CONTENIDO,
        descripcion="Todo el contenido del Sprint 2 en una sola vista"
    ))
    
    # Submenú: Etapa 1 - Limpieza
    etapa1 = construir_submenu_etapa(secciones, clave_base, "1", "Limpieza y Normalización", "🧹",
                                      "Estandarización de datos, eliminación de duplicados e integridad referencial")
    if etapa1:
        sprint2.hijos.append(etapa1)
    
    # Submenú: Etapa 2 - Análisis Descriptivo
    etapa2 = construir_submenu_etapa(secciones, clave_base, "2", "Análisis Descriptivo", "📊",
                                      "Estadísticas, distribuciones, correlaciones y visualizaciones")
    if etapa2:
        sprint2.hijos.append(etapa2)
    
    # Submenú: Etapa 3 - Procesamiento
    etapa3 = construir_submenu_etapa(secciones, clave_base, "3", "Procesamiento de Productos y Ventas", "🛒",
                                      "Análisis detallado de productos y patrones de ventas")
    if etapa3:
        sprint2.hijos.append(etapa3)
    
    # Submenú: Etapa 4 - Consolidación
    etapa4 = construir_submenu_etapa(secciones, clave_base, "4", "Consolidación e Integración", "🔗",
                                      "Integración de tablas y generación de bases finales")
    if etapa4:
        sprint2.hijos.append(etapa4)
    
    # Agregar secciones H3 que NO son etapas (3.1, 3.2, 3.3)
    otras_secciones = []
    for k in secciones:
        if k.startswith(clave_base + "_") and k.count("_") == 9:  # H3 subsections
            titulo = _get_title_from_content(secciones[k])
            if titulo:
                # Verificar si es 3.1, 3.2 o 3.3 (no etapas)
                m = re.match(r"^\s*3\.([1-3])\s", titulo)
                if m:
                    icono = "📄"
                    if "contexto" in titulo.lower():
                        icono = "🎯"
                    elif "problema" in titulo.lower():
                        icono = "🔍"
                    elif "dataset" in titulo.lower():
                        icono = "📊"
                    otras_secciones.append((k, titulo, icono))
    
    # Ordenar por código numérico
    def _num_key(label: str) -> Tuple:
        m = re.match(r"^\s*(\d+(?:\.\d+)+)", label)
        if not m:
            return (999,)
        return tuple(int(x) for x in m.group(1).split('.'))
    
    otras_secciones.sort(key=lambda x: _num_key(x[1]))
    
    # Agregar al final del menú
    for clave, etiqueta, icono in otras_secciones:
        sprint2.hijos.append(OpcionMenu(
            clave=clave,
            etiqueta=etiqueta,
            icono=icono,
            tipo=TipoOpcion.CONTENIDO,
            descripcion=""
        ))
    
    return sprint2


def construir_submenu_etapa(secciones: Dict[str, str], clave_sprint: str, 
                            num_etapa: str, nombre_etapa: str, icono: str, 
                            descripcion: str) -> Optional[OpcionMenu]:
    
    etapa_seccion_map = {
        "1": "34",
        "2": "35",
        "3": "36",
        "4": "37"
    }
    
    if num_etapa not in etapa_seccion_map:
        return None
    
    num_seccion = etapa_seccion_map[num_etapa]
    
    clave_etapa = None
    for k in secciones:
        if (f"_{num_seccion}_ETAPA_{num_etapa}_" in k and 
            k.count("_") == 13):
            clave_etapa = k
            break
    
    if not clave_etapa:
        return None
    
    etapa = OpcionMenu(
        clave=clave_etapa,
        etiqueta=f"Etapa {num_etapa}: {nombre_etapa}",
        icono=icono,
        tipo=TipoOpcion.SUBMENU,
        descripcion=descripcion
    )
    
    # Ver etapa completa
    etapa.hijos.append(OpcionMenu(
        clave=clave_etapa,
        etiqueta=f"Ver Etapa {num_etapa} Completa",
        icono="📖",
        tipo=TipoOpcion.CONTENIDO,
        descripcion=f"Todo el contenido de la Etapa {num_etapa}"
    ))
    
    # Buscar dinámicamente todas las subsecciones H4 de esta etapa
    # Las H4 empiezan con la clave de etapa + "_" y tienen 15+ guiones bajos
    subsecciones_h4 = []
    for k in secciones:
        if (k.startswith(clave_etapa + "_") and 
            k.count("_") >= 15):  # H4 tiene al menos 15 guiones bajos
            # Extraer el título desde el contenido
            titulo = _get_title_from_content(secciones[k])
            if titulo:
                # Determinar icono según el contenido del título
                icono_h4 = "📄"
                titulo_lower = titulo.lower()
                
                if "objetivo" in titulo_lower:
                    icono_h4 = "🎯"
                elif "estadística" in titulo_lower or "estadístic" in titulo_lower:
                    icono_h4 = "📊"
                elif "correlac" in titulo_lower:
                    icono_h4 = "🔗"
                elif "outlier" in titulo_lower:
                    icono_h4 = "🔍"
                elif "visual" in titulo_lower:
                    icono_h4 = "📈"
                elif "dataset" in titulo_lower or "trabajado" in titulo_lower:
                    icono_h4 = "🗄️"
                elif "distribuc" in titulo_lower or "transformac" in titulo_lower:
                    icono_h4 = "📉"
                elif "acciones" in titulo_lower or "principales" in titulo_lower:
                    icono_h4 = "⚙️"
                elif "calidad" in titulo_lower or "resultado" in titulo_lower:
                    icono_h4 = "✅"
                elif "producto" in titulo_lower:
                    icono_h4 = "📦"
                elif "venta" in titulo_lower:
                    icono_h4 = "💰"
                elif "modelo" in titulo_lower or "relacion" in titulo_lower:
                    icono_h4 = "🔗"
                elif "clave" in titulo_lower and "definida" in titulo_lower:
                    icono_h4 = "🔑"
                elif "merge" in titulo_lower or "secuencial" in titulo_lower:
                    icono_h4 = "🔄"
                elif "análisis" in titulo_lower or "analisis" in titulo_lower or "estratég" in titulo_lower:
                    icono_h4 = "💡"
                
                subsecciones_h4.append((k, titulo, icono_h4))
    
    # Ordenar por clave numérica para mantener orden lógico (3.4.1, 3.4.2, etc.)
    def _num_key(item):
        k, titulo, _ = item
        m = re.search(r'_(\d+)_', k.replace(clave_etapa + "_", ""))
        return int(m.group(1)) if m else 999
    
    subsecciones_h4.sort(key=_num_key)
    
    # Agregar subsecciones al menú
    for clave, titulo, icono_sub in subsecciones_h4:
        etapa.hijos.append(OpcionMenu(
            clave=clave,
            etiqueta=titulo,
            icono=icono_sub,
            tipo=TipoOpcion.CONTENIDO,
            descripcion=""
        ))
    
    return etapa


# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIONES DE VISUALIZACIÓN
# ═══════════════════════════════════════════════════════════════════════════════

def mostrar_header():
    """Muestra el encabezado principal del programa."""
    if ASCII_MODE:
        print("\n" + "=" * ANCHO_MARCO)
        print(" PROYECTO AURELION - VISOR DE DOCUMENTACION TECNICA ".center(ANCHO_MARCO, "="))
        print(" IBM & Guayerd · Analisis de Datos Retail · 2025 ".center(ANCHO_MARCO))
        print("=" * ANCHO_MARCO)
        return
    print("\n" + "╔" + "═" * ANCHO_MARCO + "╗")
    print(linea_marco(centrar_visual(" 🏪  PROYECTO AURELION - VISOR DE DOCUMENTACIÓN TÉCNICA  🏪 ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
    print("╠" + "═" * ANCHO_MARCO + "╣")
    print(linea_marco(centrar_visual(" IBM & Guayerd · Análisis de Datos Retail · 2025 ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
    print("╚" + "═" * ANCHO_MARCO + "╝")


def mostrar_breadcrumbs(ruta: List[str]):
    """Muestra las migas de pan (breadcrumbs) de navegación."""
    if len(ruta) <= 1:
        return
    
    print("\n" + "┌" + "─" * ANCHO_MARCO + "┐")
    print(linea_marco("📍 Ubicación: " + " → ".join(ruta), ANCHO_MARCO, "│", "│"))
    print("└" + "─" * ANCHO_MARCO + "┘")


def mostrar_menu(opciones: List[OpcionMenu], ruta: List[str]):
    """
    Muestra el menú actual con las opciones disponibles.
    
    Args:
        opciones: Lista de opciones del menú actual
        ruta: Ruta de navegación (breadcrumbs)
    """
    limpiar_pantalla()
    mostrar_header()
    mostrar_breadcrumbs(ruta)
    
    print("\n" + "┌" + "─" * ANCHO_MARCO + "┐")
    print(linea_marco(centrar_visual(" MENÚ DE OPCIONES ", ANCHO_MARCO), ANCHO_MARCO, "│", "│"))
    print("├" + "─" * ANCHO_MARCO + "┤")
    
    for i, opcion in enumerate(opciones, 1):
        # Indicador de tipo
        tipo_indicador = "📂" if opcion.tipo == TipoOpcion.SUBMENU else "📄"

        # Línea principal con número alineado y nombre
        num_opcion = f"[{i:>2}]"
        contenido_linea = rellenar_visual(f"{num_opcion} {opcion.icono}  {opcion.etiqueta} {tipo_indicador}", ANCHO_MARCO - 2)
        print(linea_marco(contenido_linea, ANCHO_MARCO, "│", "│"))
        
        # Descripción (si existe)
        if opcion.descripcion:
            for desc_line in envolver_texto_display(opcion.descripcion, ANCHO_MARCO - 6):
                desc_fmt = rellenar_visual(f"     💬 {desc_line}", ANCHO_MARCO - 2)
                print(linea_marco(desc_fmt, ANCHO_MARCO, "│", "│"))
        
        # Separador entre opciones
        if i < len(opciones):
            print("├" + "┄" * ANCHO_MARCO + "┤")

    print("└" + "─" * ANCHO_MARCO + "┘")
    
    # Opciones de navegación
    print("\n" + "╔" + "═" * ANCHO_MARCO + "╗")
    print(linea_marco(" NAVEGACIÓN ", ANCHO_MARCO, "║", "║"))
    print("╠" + "═" * ANCHO_MARCO + "╣")
    if len(ruta) > 1:
        print(linea_marco(" [0] ⬅️   Volver al menú anterior", ANCHO_MARCO, "║", "║"))
    else:
        print(linea_marco(" [Q] 🚪  Salir del programa", ANCHO_MARCO, "║", "║"))

    print(linea_marco(" [R] 🔄  Recargar documentación", ANCHO_MARCO, "║", "║"))
    print("╚" + "═" * ANCHO_MARCO + "╝")


def mostrar_contenido(titulo: str, contenido: str, ruta: List[str]):
    """
    Muestra el contenido de una sección.
    
    Args:
        titulo: Título de la sección
        contenido: Contenido a mostrar
        ruta: Ruta de navegación (breadcrumbs)
    """
    limpiar_pantalla()
    mostrar_header()
    mostrar_breadcrumbs(ruta)

    # Mostrar diagrama de flujo profesional, alineado y detallado
    if titulo and ("DIAGRAMA_FLUJO_MENU" in titulo.upper() or "DIAGRAMA DE FLUJO DEL MENÚ" in titulo.upper()):
        print("\n" + ("═" * ANCHO_MARCO))
        print(linea_marco(" DIAGRAMA DE FLUJO DEL MENÚ PRINCIPAL ", ANCHO_MARCO, "║", "║"))
        print("╠" + "═" * ANCHO_MARCO + "╣")
        # Diagrama alineado y distribuido
        diagrama = [
            "              ┌───────────────┐",
            "              │   INICIO     │",
            "              └─────┬───────┘",
            "                    │",
            "                    ▼",
            "        ┌───────────────────────────────┐",
            "        │ Encabezado / Portada          │",
            "        └─────────────┬───────────────┘",
            "                    │",
            "                    ▼",
            "        ┌───────────────────────────────┐",
            "        │      MENÚ PRINCIPAL           │",
            "        │     (Opciones 1 a 13)         │",
            "        └─────────────┬───────────────┘",
            "                    │",
            "                    ▼",
            "              ◇ Decisión: Selección de opción ◇",
            "                    │",
            "        ┌─────────────┬─────────────┬─────────────┐",
            "        │             │             │             │",
            "        ▼             ▼             ▼             ▼",
            "   [Opción 1]   ...   [Opción 13]   [Diagrama]   [Otra]",
            "        │             │             │             │",
            "        └─────────────┴─────────────┴─────────────┘",
            "                    │",
            "                    ▼",
            "        ┌───────────────────────────────┐",
            "        │     SECCIÓN DE CONTENIDO      │",
            "        │ (Documentación, artefactos,   │",
            "        │  outputs, diagrama, etc.)     │",
            "        └─────────────┬───────────────┘",
            "                    │",
            "                    ▼",
            "              ◇ Decisión: Acción de navegación ◇",
            "                    │",
            "        ┌─────────────┬─────────────┬─────────────┐",
            "        │             │             │             │",
            "        ▼             ▼             ▼             ▼",
            "   [0] Volver   [R] Recargar   [Q] Salir   [Salto]",
            "        │             │             │             │",
            "        └─────────────┴─────────────┴─────────────┘",
            "                    │",
            "                    ▼",
            "              ┌───────────────┐",
            "              │     FIN       │",
            "              └───────────────┘",
            "",
            "  Leyenda:",
            "    ┌───────────────┐  Proceso/Paso (rectángulo)",
            "    ◇             ◇  Decisión (rombo)",
            "    [ ]               Opción/Acción",
            "    ▼                 Flecha/flujo",
            "    │                 Conexión",
            "    INICIO/FIN        Óvalo",
        ]
        for l in diagrama:
            print(linea_marco(l, ANCHO_MARCO, "║", "║"))
        print("╚" + "═" * ANCHO_MARCO + "╝")
        pausar()
        return

    # ...existing code...
    lineas = contenido.split('\n')
    in_output_block = False
    output_buffer = []
    last_section_header = None
    max_lines = 80
    defer_counter = 0
    shown = 0
    for linea in lineas:
        stripped = linea.strip()
        if re.match(r'^#{2,4}\s+.+', stripped):
            last_section_header = re.sub(r'^#{2,4}\s+', '', stripped)

        if stripped.startswith('```output'):
            in_output_block = True
            output_buffer = []
            continue
        if in_output_block and stripped == '```':
            titulo_bloque = 'Resultado'
            if last_section_header:
                titulo_bloque = f"Resultado · {last_section_header}"

            if ASCII_MODE:
                print('\n' + '-' * 80)
                print(f" {titulo_bloque} ".center(80, '-'))
            else:
                print('\n' + '╔' + '═' * 78 + '╗')
                print(linea_marco(centrar_visual(f" {titulo_bloque} ", 78), 78, "║", "║"))
                print('╠' + '═' * 78 + '╣')
            
            for out_line in output_buffer:
                print(out_line)
            
            if not ASCII_MODE:
                print('╚' + '═' * 78 + '╝\n')
            in_output_block = False
            output_buffer = []
            continue
        if in_output_block:
            output_buffer.append(linea)
        else:
            print(linea)
            shown += 1
            if shown >= max_lines and not DEMO_MODE:
                if stripped:
                    defer_counter += 1
                    if defer_counter < 30:
                        continue
                try:
                    input("\n--- Continuar (ENTER) ---")
                except EOFError:
                    return
                shown = 0
                defer_counter = 0

    print("\n" + ("=" * ANCHO_MARCO if ASCII_MODE else "═" * ANCHO_MARCO))
    pausar()


def mostrar_mensaje(mensaje: str, tipo: str = "info"):
    """
    Muestra un mensaje formateado.
    
    Args:
        mensaje: Texto del mensaje
        tipo: 'info', 'success', 'warning', 'error'
    """
    iconos = {
        "info": "ℹ️",
        "success": "✅",
        "warning": "⚠️",
        "error": "❌"
    }
    
    bordes = {
        "info": "─",
        "success": "═",
        "warning": "━",
        "error": "═"
    }
    
    icono = iconos.get(tipo, "ℹ️")
    borde = bordes.get(tipo, "─")
    
    print("\n" + borde * ANCHO_MARCO)
    print(f"{icono}  {mensaje}")
    print(borde * ANCHO_MARCO)


# ═══════════════════════════════════════════════════════════════════════════════
# LÓGICA DE NAVEGACIÓN
# ═══════════════════════════════════════════════════════════════════════════════

class NavegadorMenus:
    """Gestiona la navegación entre menús y secciones."""
    
    def __init__(self, menu_raiz: OpcionMenu, secciones: Dict[str, str]):
        self.menu_raiz = menu_raiz
        self.secciones = secciones
        self.ruta: List[Tuple[OpcionMenu, str]] = [(menu_raiz, "Inicio")]
    
    def obtener_menu_actual(self) -> OpcionMenu:
        """Retorna el menú actual en la pila de navegación."""
        return self.ruta[-1][0]
    
    def obtener_ruta_nombres(self) -> List[str]:
        """Retorna la ruta de navegación como lista de nombres."""
        return [nombre for _, nombre in self.ruta]
    
    def navegar_a_hijo(self, indice: int):
        """Navega a una opción hija del menú actual."""
        menu_actual = self.obtener_menu_actual()
        
        if 0 <= indice < len(menu_actual.hijos):
            opcion = menu_actual.hijos[indice]
            
            if opcion.tipo == TipoOpcion.SUBMENU:
                # Navegar a submenú
                self.ruta.append((opcion, opcion.etiqueta))
            elif opcion.tipo == TipoOpcion.CONTENIDO:
                # Mostrar contenido
                contenido = self.secciones.get(opcion.clave, "⚠️ Contenido no disponible")
                ruta_nombres = self.obtener_ruta_nombres() + [opcion.etiqueta]
                mostrar_contenido(opcion.etiqueta, contenido, ruta_nombres)
        else:
            mostrar_mensaje("Opción inválida. Intenta de nuevo.", "warning")
            pausar()
    
    def volver_atras(self):
        """Vuelve al menú anterior."""
        if len(self.ruta) > 1:
            self.ruta.pop()
    
    def recargar(self) -> bool:
        """Recarga la documentación. Retorna True si fue exitoso."""
        mostrar_mensaje("Recargando DOCUMENTACION.md...", "info")
        md = cargar_documentacion(RUTA_DOC)
        
        if not md:
            mostrar_mensaje("Error al recargar la documentación.", "error")
            pausar()
            return False
        
        nuevas_secciones = parsear_secciones(md)
        print(f"ℹ️ Secciones detectadas: {len(nuevas_secciones)}")
        if not nuevas_secciones:
            mostrar_mensaje("No se pudieron detectar secciones.", "error")
            pausar()
            return False
        
        self.secciones = nuevas_secciones
        mostrar_mensaje("Documentación recargada exitosamente.", "success")
        pausar()
        return True
    
    def ejecutar(self):
        """Loop principal de navegación."""
        while True:
            menu_actual = self.obtener_menu_actual()
            ruta_nombres = self.obtener_ruta_nombres()
            
            mostrar_menu(menu_actual.hijos, ruta_nombres)
            
            try:
                opcion = input("\n👉 Seleccioná una opción: ").strip().upper()
            except EOFError:
                mostrar_mensaje("Entrada no disponible. Saliendo del visor.", "warning")
                break
            
            # Opción: Salir
            if opcion == 'Q' and len(self.ruta) == 1:
                limpiar_pantalla()
                print("\n" + "╔" + "═" * ANCHO_MARCO + "╗")
                print(linea_marco(centrar_visual(" ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print(linea_marco(centrar_visual(" 🏪  PROYECTO AURELION  🏪 ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print(linea_marco(centrar_visual(" ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print(linea_marco(centrar_visual(" Gracias por usar el Visor de Documentación ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print(linea_marco(centrar_visual(" ¡Hasta pronto! 👋 ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print(linea_marco(centrar_visual(" ", ANCHO_MARCO), ANCHO_MARCO, "║", "║"))
                print("╚" + "═" * ANCHO_MARCO + "╝\n")
                break
            
            # Opción: Volver
            elif opcion == '0' and len(self.ruta) > 1:
                self.volver_atras()
            
            # Opción: Recargar
            elif opcion == 'R':
                if self.recargar():
                    # Reconstruir estructura de menús
                    nuevo_menu = construir_estructura_menus(self.secciones)
                    self.menu_raiz = nuevo_menu
                    self.ruta = [(nuevo_menu, "Inicio")]
            
            # Opción numérica
            elif opcion.isdigit():
                indice = int(opcion) - 1
                self.navegar_a_hijo(indice)
            
            else:
                mostrar_mensaje("Opción no reconocida. Intentá de nuevo.", "warning")
                pausar()


# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIÓN PRINCIPAL

def main():
    mostrar_mensaje("Cargando documentación...", "info")
    md = cargar_documentacion(RUTA_DOC)
    if not md:
        mostrar_mensaje("No se pudo cargar DOCUMENTACION.md", "error")
        return

    secciones = parsear_secciones(md)
    print(f"ℹ️ Secciones detectadas: {len(secciones)}")

    # Validar presencia de secciones clave
    requeridas = {
        "DOC_COMPLETA": secciones.get("DOC_COMPLETA"),
        "INTRO": secciones.get("INTRO"),
        "SPRINT1": _find_first_key_by_tokens(secciones, ["sprint", "1"]),
        "SPRINT2": _find_first_key_by_tokens(secciones, ["sprint", "2"]),
        "SPRINT3": _find_first_key_by_tokens(secciones, ["sprint", "3"]),
    }
    faltantes = [k for k, v in requeridas.items() if not v]
    if faltantes:
        print(f"⚠️ Secciones faltantes: {', '.join(faltantes)}")
    
    # Construir estructura de menús
    print("🏗️  Construyendo estructura de menús...")
    menu_raiz = construir_estructura_menus(secciones)
    
    # Iniciar navegador o demo
    if DEMO_MODE:
        print("✅ Sistema listo. Modo demo activado.\n")
        pausar()
        clave_tldr = _find_first_key_by_tokens(secciones, ["TLDR"]) or "DOC_COMPLETA"
        contenido_demo = secciones.get(clave_tldr, "Contenido no disponible")
        mostrar_contenido("DEMO - Resumen Ejecutivo (TL;DR)", contenido_demo, ["Inicio", "Demo"])
        print("\n" + "═" * ANCHO_MARCO)
        print("  ✅ Modo demo completado. El visor está funcionando correctamente.")
        print("  💡 Ejecutá 'python programa.py' sin --demo para usar el modo interactivo.")
        print("═" * ANCHO_MARCO + "\n")
        return

    print("✅ Sistema listo. Iniciando navegador...\n")
    pausar()
    
    navegador = NavegadorMenus(menu_raiz, secciones)
    navegador.ejecutar()


if __name__ == "__main__":
    main()
