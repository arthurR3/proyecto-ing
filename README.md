# Estética Principal - Aplicación Web

## Descripción del Proyecto
La aplicación web de la **"Estética Principal"** permite a los usuarios comprar productos de belleza y agendar citas para servicios estéticos de manera rápida y eficiente. La plataforma está diseñada para mejorar la experiencia de los clientes mediante una interfaz amigable y un flujo de navegación sencillo. El proyecto incluye funcionalidades como registro de usuario, inicio de sesión, carrito de compras, historial de compras, agendamiento de citas, y perfil de usuario.

## Objetivos
- **Facilitar la compra de productos de belleza:** A través de un catálogo online, los usuarios pueden explorar y comprar productos con facilidad.
- **Agendar citas para servicios estéticos:** Los clientes pueden programar y gestionar sus citas directamente desde la plataforma.
- **Optimizar la gestión de usuarios:** La aplicación incluye funcionalidades de inicio de sesión, registro, recuperación de contraseña y gestión del perfil.
- **Mejorar la eficiencia en la administración de la estética:** La plataforma integra un sistema de administración de citas y compras para los dueños del negocio.

## Metodología de Trabajo
Se utiliza la metodología ágil **Scrum**, que permite realizar entregas incrementales y una retroalimentación constante para garantizar el progreso continuo del proyecto. Cada sprint tiene una duración de dos semanas y está enfocado en entregar funcionalidades clave.

## Control de Versiones
El proyecto utiliza Git como herramienta de control de versiones, alojado en **GitHub**. El flujo de trabajo está basado en la estrategia **Git Flow**, que permite una estructura clara y organizada de las ramas para el desarrollo y la implementación del proyecto.

## Flujo de Trabajo
1.- La rama principal del repositorio es `main`, que contiene el código listo para producción.

2.- La rama `develop` se utiliza para la integración de nuevas funcionalidades.

3.- Cada nueva característica o corrección de error se desarrolla en una rama feature separada. Una vez completada, la rama feature se fusiona en `develop`.

4.- Al finalizar cada sprint, el código de `develop` se fusiona con `main`, y se realiza una nueva versión de la aplicación.

## Estrategia de Versionamiento
El proyecto sigue la estrategia de **Git Flow**, que organiza el ciclo de vida de las ramas de la siguiente manera:

- **Rama** `main`: Contiene el código que está listo para ser desplegado en producción.
- **Rama** `develop`: Es la rama donde se integran todas las nuevas funcionalidades antes de fusionarlas en `main`.
- **Feature** `branches`: Cada nueva funcionalidad se desarrolla en su propia rama a partir de `develop` y se fusiona en `develop` tras la revisión y pruebas.
- **Hotfix** `branches`: En caso de errores críticos en producción, se crean ramas temporales a partir de `main` para realizar correcciones rápidas.
Esta estructura asegura que el desarrollo sea seguro y que el código en `main` siempre esté listo para su despliegue.

## Estrategia de Despliegue
El proyecto utiliza la estrategia de despliegue **Rolling (Progresivo)**, lo que nos permite lanzar la aplicación de forma gradual. Esto nos ayuda a monitorear el comportamiento de la aplicación en un pequeño porcentaje de usuarios antes de liberar la versión final para todos.

## Entornos de Despliegue
- **Desarrollo:** Ambiente local para pruebas y desarrollo continuo.
- **Staging:** Un entorno de pruebas que emula el ambiente de producción. Aquí se realizan pruebas exhaustivas antes del despliegue.
- **Producción:** La versión estable y final de la aplicación que es accesible por los usuarios.

## CI/CD (Integración Continua/Despliegue Continuo)
El proyecto utiliza **GitHub Actions** para automatizar los flujos de trabajo de CI/CD:

1.- Cuando el código se fusiona en `develop`, se ejecutan pruebas automáticas.

2.- Si las pruebas son exitosas, el código se despliega en el entorno de **staging**.

3.- Después de la aprobación en **staging**, el código se despliega en producción.

## Instrucciones para Clonar el Repositorio e Instalar Dependencias
Sigue los siguientes pasos para clonar el proyecto, instalar las dependencias y ejecutar la aplicación en tu entorno local.

## Clonar el Repositorio

```bash
git clone https://github.com/arthurR3/proyecto-ing.git
cd proyecto-ing
```

## Instalar Dependencias
Utiliza **npm** para instalar todas las dependencias necesarias:

`npm install`

## Ejecutar el Proyecto en Desarrollo
Para ejecutar la aplicación en modo desarrollo, utiliza el siguiente comando:

`npm start`

## Compilar el Proyecto para Producción
Para crear una versión optimizada de la aplicación lista para producción, utiliza:

`npm run build`
