# Zenatta Knowledge Hub - Frontend Prompt

Quiero que construyas el frontend de un widget para **Zoho Creator** llamado **Zenatta Knowledge Hub**.

El widget funcionará como una base de conocimiento interna para Zenatta. Permitirá consultar y administrar documentación técnica relacionada con clientes, proyectos, procesos internos, integraciones, APIs, ejemplos de código, Loom videos, guías de despliegue y buenas prácticas.

La aplicación de Zoho Creator ya existe y se llama:

```text
Knowledge Hub
```

El formulario principal ya existe y se llama:

```text
Knowledge Articles
```

Sus campos actuales son:

```text
Title
Project
Tags
Loom_URL
GitHub_URL
Related_URL
Summary
Content
Status
Category
Knowledge_Type
```

Los valores principales son:

```text
Knowledge_Type
- Customer
- Internal

Status
- Draft
- Published
- Archived
```

---

# Objetivo técnico

Construye el frontend como un widget moderno, limpio y profesional utilizando **Vue** y aprovechando al máximo el **SDK oficial de Zoho Creator**.

No quiero usar datos mock como implementación final. Puedes utilizarlos únicamente para construir la interfaz inicialmente, pero toda la lógica debe quedar preparada para reemplazarlos fácilmente por llamadas reales al SDK.

El proyecto debe estar preparado para ejecutarse tanto:

- Localmente durante el desarrollo.
- Dentro del Widget de Zoho Creator.

Cuando el SDK no esté disponible deberá utilizar automáticamente datos mock.

---

# Uso del SDK de Zoho Creator

Utiliza el SDK para:

- Inicializar el widget.
- Obtener registros del formulario Knowledge Articles.
- Obtener un artículo individual.
- Crear artículos.
- Actualizar artículos.
- Aplicar filtros.
- Leer el usuario actual cuando sea posible.
- Abrir formularios o reportes nativos de Creator cuando sea conveniente.
- Manejar correctamente respuestas, errores y paginación.

No inventes métodos del SDK.

Antes de implementar una llamada verifica la estructura correcta del SDK disponible.

Toda la comunicación con Creator debe vivir en un único servicio.

---

# Diseño General

Quiero una interfaz moderna tipo SaaS inspirada en herramientas como:

- Notion
- Linear
- GitBook
- Confluence
- Atlassian Knowledge Base

Debe sentirse como una aplicación profesional y no como un formulario de Creator.

---

# Navegación

El menú lateral debe contener únicamente:

```text
Home
Customers
Internal
Recently Updated
My Articles
```

No agregar todavía:

- Favorites
- Administration
- Settings

---

# Home

Debe mostrar:

- Logo y nombre:
  Zenatta Knowledge Hub

- Barra de búsqueda global

- Accesos rápidos:

  Customers

  Internal

- Recently Updated

- Recent Articles

- Botón:

  New Article

---

# Customers

Debe mostrar únicamente:

```text
Knowledge_Type = Customer
```

La vista permitirá:

- Buscar artículos
- Filtrar por Project
- Filtrar por Category
- Filtrar por Status
- Filtrar por Tags
- Ordenar por fecha

Cada artículo mostrará:

- Title
- Summary
- Project
- Category
- Tags
- Author
- Modified Time

Al hacer clic se abrirá el detalle.

---

# Internal

Debe mostrar únicamente:

```text
Knowledge_Type = Internal
```

Utilizar exactamente la misma estructura que Customers.

Ejemplos:

- RingCentral CRM Integration
- CRM + Absorb Integration
- Zoho Writer Advanced Merge
- Deluge Best Practices
- Creator Deployment Guide
- Catalyst Jobs
- OAuth Guide

---

# Vista de Artículo

Debe mostrar:

- Title
- Summary
- Project
- Knowledge Type
- Category
- Tags
- Status
- Author
- Created Time
- Modified Time

Contenido completo.

Si existen:

- Loom URL
- GitHub URL
- Related URL

mostrar botones elegantes.

El campo Content puede contener HTML generado por Rich Text.

Renderizar correctamente.

Si existen bloques de código utilizar:

- Prism.js

o

- Highlight.js

para syntax highlighting.

---

# Crear / Editar Artículo

Crear una vista o modal.

Campos:

```text
Title
Project
Tags
Loom URL
GitHub URL
Related URL
Summary
Content
Status
Category
Knowledge Type
```

Debe incluir:

- Validaciones
- Loading
- Mensajes de éxito
- Mensajes de error

La creación y actualización debe vivir en un servicio separado.

Después de guardar:

- refrescar la lista
- abrir el artículo actualizado

Para Content utilizar un Rich Text Editor compatible con Vue.

Debe soportar:

- H1
- H2
- H3
- Bold
- Italic
- Underline
- Lists
- Links
- Blockquote
- Code Block

No construir un clon completo de Notion.

---

# Diseño Visual

Quiero una interfaz:

- Moderna
- Minimalista
- Profesional
- Responsive
- Muy limpia
- Excelente UX

Inspirada en:

- Notion
- Linear
- GitBook

Utilizar colores tipo Zenatta.

Customers puede utilizar un azul oscuro.

Internal puede utilizar un morado elegante.

Agregar:

- Loading States
- Empty States
- Error States

---

# Arquitectura

Organizar el proyecto así:

```text
src/

components/
views/
services/
creatorSdkService.js

composables/

router/

utils/

config/

assets/
```

Crear componentes reutilizables:

```text
Sidebar

TopBar

SearchBar

FilterBar

ArticleList

ArticleCard

ArticleDetail

ArticleEditor

LoadingState

EmptyState

ErrorState
```

---

# Configuración

Centralizar todos los API Names de Creator.

Ejemplo:

```javascript
export const CREATOR_CONFIG = {
    appLinkName: "",
    reportLinkName: "",
    formLinkName: "",

    fields: {
        title: "Title",
        project: "Project",
        tags: "Tags",
        loomUrl: "Loom_URL",
        githubUrl: "GitHub_URL",
        relatedUrl: "Related_URL",
        summary: "Summary",
        content: "Content",
        status: "Status",
        category: "Category",
        knowledgeType: "Knowledge_Type"
    }
};
```

Nunca utilizar API Names directamente dentro de los componentes.

---

# Buenas prácticas

- async / await
- try / catch
- Servicios separados
- Componentes pequeños
- Código reutilizable
- No mezclar lógica del SDK con Vue
- Preparado para mantenimiento
- Detectar automáticamente si está ejecutándose dentro de Creator o localmente
- Utilizar Mock Data únicamente cuando el SDK no exista

---

# Entregables

Necesito que generes:

1. Arquitectura completa del proyecto.
2. Componentes Vue.
3. Servicio para Zoho Creator SDK.
4. Navegación completa.
5. Pantallas.
6. Datos Mock temporales.
7. Instalación de dependencias.
8. Instrucciones para desarrollo local.
9. Instrucciones para desplegar en Zoho Creator.
10. Lista de configuraciones que debo completar manualmente.

---

# Antes de escribir código

Primero quiero que me presentes:

- La arquitectura propuesta.
- Las dependencias que utilizarás.
- Los métodos del SDK de Zoho Creator que piensas consumir.
- Las dudas técnicas que tengas.

No comiences a escribir código hasta que apruebe esa arquitectura.