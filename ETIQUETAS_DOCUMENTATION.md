# Etiquetas de Cliente - Documentación

Este documento describe todas las etiquetas que el sistema puede manejar, categorizadas por tipo de asignación (automática, manual, o futura).

## 📋 Índice

1. [Etiquetas Automáticas (Sistema)](#etiquetas-automáticas-sistema)
2. [Etiquetas Manuales (Staff)](#etiquetas-manuales-staff)
3. [Etiquetas Futuras (No Implementables Actualmente)](#etiquetas-futuras-no-implementables-actualmente)

---

## 🤖 Etiquetas Automáticas (Sistema)

Estas etiquetas son asignadas y removidas automáticamente por el sistema basándose en eventos y datos existentes.

### 1. **Nuevo** 🟢
- **Descripción**: Cliente recién registrado que aún no ha realizado su primer pedido fuera del día de creación.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando se crea un nuevo usuario en `createUser.action.ts` o `getOrCreateUser.action.ts`
  - **Cuándo se remueve**: Cuando el usuario crea un pedido (`createOrder.action.ts` o `createOrderFromCart.action.ts`) y la fecha del pedido (`order.createdAt`) es diferente al día de creación del usuario (`user.createdAt`)
- **Proceso del Sistema**:
  - ✅ Usuario se crea → Etiqueta "Nuevo" agregada a `user.tags[]`
  - ✅ Usuario crea pedido en día diferente → Etiqueta "Nuevo" removida de `user.tags[]`
- **Color Sugerido**: `#10B981` (Verde)

### 2. **Pago Fallido** 🔴
- **Descripción**: Cliente que tiene pedidos con estado de pago fallido.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `PAYMENT_FAILED` en `updateOrderStatus.action.ts`
  - **Cuándo se remueve**: Cuando todos los pedidos del cliente con estado `PAYMENT_FAILED` cambian a otro estado (ej: `WAITING_PAYMENT`, `COOKING`, `CANCELLED`)
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `PAYMENT_FAILED` → Verificar si cliente tiene otros pedidos con `PAYMENT_FAILED`
  - ✅ Si es el primero, agregar etiqueta "Pago Fallido" a `user.tags[]`
  - ✅ Si todos los pedidos `PAYMENT_FAILED` cambian de estado → Remover etiqueta
- **Color Sugerido**: `#EF4444` (Rojo)

### 3. **Cancelaciones Frecuentes** 🟡
- **Descripción**: Cliente que ha cancelado múltiples pedidos (3 o más cancelaciones).
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `CANCELLED` en `updateOrderStatus.action.ts` y el cliente tiene 3 o más pedidos cancelados (`order.status === CANCELLED`)
  - **Cuándo se remueve**: Cuando el cliente completa pedidos exitosamente y el ratio de cancelaciones baja (menos del 30% de sus pedidos son cancelados)
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `CANCELLED` → Contar pedidos cancelados del cliente
  - ✅ Si tiene 3+ cancelaciones → Agregar etiqueta "Cancelaciones Frecuentes" a `user.tags[]`
  - ✅ Si ratio de cancelaciones < 30% y tiene pedidos completados recientes → Remover etiqueta
- **Color Sugerido**: `#EAB308` (Amarillo)

### 4. **Problemas de Entrega** 🔴
- **Descripción**: Cliente que tiene pedidos con problemas reportados.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `ISSUE` en `updateOrderStatus.action.ts`
  - **Cuándo se remueve**: Cuando todos los pedidos con estado `ISSUE` del cliente se resuelven (cambian a `COMPLETED`, `CANCELLED`, o `REFUNDED`)
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `ISSUE` → Verificar si cliente tiene otros pedidos con `ISSUE`
  - ✅ Si es el primero, agregar etiqueta "Problemas de Entrega" a `user.tags[]`
  - ✅ Si todos los pedidos `ISSUE` se resuelven → Remover etiqueta
- **Color Sugerido**: `#EF4444` (Rojo)

### 5. **Reembolsos** 🟡
- **Descripción**: Cliente que ha recibido reembolsos en sus pedidos.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `REFUNDED` en `updateOrderStatus.action.ts`
  - **Cuándo se remueve**: Nunca se remueve automáticamente (permanece como historial)
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `REFUNDED` → Agregar etiqueta "Reembolsos" a `user.tags[]` si no existe
  - ✅ La etiqueta permanece para referencia histórica
- **Color Sugerido**: `#EAB308` (Amarillo)

### 6. **Cliente Activo** 🟢
- **Descripción**: Cliente que ha completado al menos un pedido en los últimos 30 días.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `COMPLETED` en `updateOrderStatus.action.ts` y el cliente tiene al menos un pedido completado en los últimos 30 días
  - **Cuándo se remueve**: Cuando el último pedido completado del cliente tiene más de 30 días de antigüedad
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `COMPLETED` → Verificar fecha del último pedido completado
  - ✅ Si último pedido completado < 30 días → Agregar/actualizar etiqueta "Cliente Activo" en `user.tags[]`
  - ✅ Si último pedido completado > 30 días → Remover etiqueta
- **Color Sugerido**: `#10B981` (Verde)

### 7. **En Riesgo** 🟡
- **Descripción**: Cliente inactivo que no ha realizado pedidos en los últimos 60 días pero tiene historial de pedidos.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando se calcula que el último pedido completado del cliente tiene más de 60 días (se puede calcular en `getUsersWithStats.action.ts` o en un proceso periódico)
  - **Cuándo se remueve**: Cuando el cliente realiza un nuevo pedido que se completa
- **Proceso del Sistema**:
  - ✅ Al calcular estadísticas del usuario → Verificar `lastOrderDate` vs fecha actual
  - ✅ Si `lastOrderDate` > 60 días y tiene pedidos previos → Agregar etiqueta "En Riesgo" a `user.tags[]`
  - ✅ Cuando pedido se completa → Remover etiqueta si existe
- **Color Sugerido**: `#EAB308` (Amarillo)

### 8. **Primer Pedido** 🟢
- **Descripción**: Cliente que acaba de completar su primer pedido exitoso.
- **Asignación Automática**:
  - **Cuándo se agrega**: Cuando un pedido cambia a estado `COMPLETED` y es el primer pedido completado del cliente
  - **Cuándo se remueve**: Cuando el cliente completa su segundo pedido
- **Proceso del Sistema**:
  - ✅ Pedido cambia a `COMPLETED` → Verificar si es el primer pedido completado del cliente
  - ✅ Si es el primero → Agregar etiqueta "Primer Pedido" a `user.tags[]`
  - ✅ Cuando segundo pedido se completa → Remover etiqueta
- **Color Sugerido**: `#10B981` (Verde)

---

## ✋ Etiquetas Manuales (Staff)

Estas etiquetas deben ser asignadas manualmente por el personal administrativo basándose en conocimiento del negocio, interacciones con clientes, o información que no está capturada automáticamente en el sistema.

### 1. **VIP** 🟣
- **Descripción**: Cliente de alto valor que merece atención especial.
- **Asignación**: Manual por staff
- **Criterios Sugeridos**: Clientes con alto LTV, frecuentes, o relaciones especiales
- **Color Sugerido**: `#8B5CF6` (Púrpura)

### 2. **Peligroso / Problemático** 🔴
- **Descripción**: Cliente que presenta comportamientos problemáticos, conflictos, o situaciones de riesgo.
- **Asignación**: Manual por staff
- **Uso**: Para marcar clientes que requieren manejo especial o precaución
- **Color Sugerido**: `#EF4444` (Rojo)

### 3. **Restricciones Alimentarias** 🔵
- **Descripción**: Cliente con restricciones dietéticas específicas (vegetariano, vegano, sin gluten, alergias, etc.).
- **Asignación**: Manual por staff
- **Variantes Sugeridas**: 
  - "Vegetariano"
  - "Vegano"
  - "Sin Gluten"
  - "Alergias" (con nota específica en `user.notes`)
- **Color Sugerido**: `#06B6D4` (Cian)

### 4. **Dirección Especial** 🔵
- **Descripción**: Cliente con ubicación de entrega que requiere instrucciones especiales o atención extra.
- **Asignación**: Manual por staff
- **Uso**: Para clientes con direcciones complicadas, zonas de difícil acceso, o instrucciones de entrega específicas
- **Color Sugerido**: `#06B6D4` (Cian)

### 5. **Horario Restringido** 🔵
- **Descripción**: Cliente que solo puede recibir pedidos en horarios específicos.
- **Asignación**: Manual por staff
- **Uso**: Para clientes con restricciones de horario de entrega
- **Color Sugerido**: `#06B6D4` (Cian)

### 6. **Empleado** 🟣
- **Descripción**: Cliente que es empleado del negocio.
- **Asignación**: Manual por staff
- **Uso**: Para identificar pedidos de empleados (pueden tener descuentos o tratamiento especial)
- **Color Sugerido**: `#8B5CF6` (Púrpura)

### 7. **Amigo / Familiar** 🟣
- **Descripción**: Cliente que es amigo o familiar del dueño/staff.
- **Asignación**: Manual por staff
- **Uso**: Para identificar relaciones personales
- **Color Sugerido**: `#8B5CF6` (Púrpura)

### 8. **Cliente Corporativo** 🟣
- **Descripción**: Cliente que representa una empresa o realiza pedidos corporativos.
- **Asignación**: Manual por staff
- **Uso**: Para identificar pedidos corporativos que pueden requerir facturación especial
- **Color Sugerido**: `#8B5CF6` (Púrpura)

### 9. **Influencer / Referidor** 🟢
- **Descripción**: Cliente que trae nuevos clientes o tiene influencia en redes sociales.
- **Asignación**: Manual por staff
- **Uso**: Para identificar clientes que ayudan a traer nuevos negocios
- **Color Sugerido**: `#10B981` (Verde)

### 10. **Descuento Activo** 🟢
- **Descripción**: Cliente que tiene un descuento o promoción activa.
- **Asignación**: Manual por staff
- **Uso**: Para identificar clientes con descuentos especiales aplicados
- **Color Sugerido**: `#10B981` (Verde)

### 11. **No Contactar** 🔴
- **Descripción**: Cliente que ha solicitado no ser contactado o tiene restricciones de comunicación.
- **Asignación**: Manual por staff
- **Uso**: Para respetar preferencias de comunicación del cliente
- **Color Sugerido**: `#EF4444` (Rojo)

### 12. **Verificación Pendiente** 🟡
- **Descripción**: Cliente que requiere verificación de identidad o información.
- **Asignación**: Manual por staff
- **Uso**: Para marcar clientes que necesitan verificación antes de procesar pedidos
- **Color Sugerido**: `#EAB308` (Amarillo)

---

## 🔮 Etiquetas Futuras (No Implementables Actualmente)

Estas etiquetas requieren funcionalidades o datos que el sistema actualmente no captura o procesa. Se listan aquí para referencia futura.

### 1. **Pago Rápido** 🟢
- **Descripción**: Cliente que paga rápidamente después de realizar el pedido.
- **Razón de No Implementación**: El sistema no tiene un campo de tiempo entre creación del pedido y confirmación de pago. Solo se registra cuando se confirma el pago, no el tiempo transcurrido.
- **Requisitos Futuros**: Agregar timestamp de cuando se crea el pedido y cuando se confirma el pago para calcular tiempo de pago.
- **Color Sugerido**: `#10B981` (Verde)

### 2. **Pago Lento** 🟡
- **Descripción**: Cliente que tarda en pagar sus pedidos.
- **Razón de No Implementación**: Misma razón que "Pago Rápido" - falta tracking de tiempo de pago.
- **Requisitos Futuros**: Agregar tracking de tiempo entre creación y confirmación de pago.
- **Color Sugerido**: `#EAB308` (Amarillo)

### 3. **Pedidos Grandes** 🟢
- **Descripción**: Cliente que frecuentemente realiza pedidos de alto valor.
- **Razón de No Implementación**: El sistema tiene `order.totalPrice` pero no hay un proceso automático que calcule el promedio de pedidos del cliente y compare con un umbral.
- **Requisitos Futuros**: Proceso que calcule promedio de `totalPrice` de pedidos completados y compare con umbral (ej: >$30 promedio).
- **Color Sugerido**: `#10B981` (Verde)

### 4. **Pedidos Pequeños** 🔵
- **Descripción**: Cliente que frecuentemente realiza pedidos de bajo valor.
- **Razón de No Implementación**: Misma razón que "Pedidos Grandes".
- **Requisitos Futuros**: Proceso que calcule promedio de `totalPrice` y compare con umbral bajo.
- **Color Sugerido**: `#06B6D4` (Cian)

### 5. **Personalización Frecuente** 🔵
- **Descripción**: Cliente que frecuentemente modifica sus pedidos (remueve ingredientes).
- **Razón de No Implementación**: El sistema tiene `orderItem.removedIngredients[]` pero no hay proceso que analice la frecuencia de modificaciones.
- **Requisitos Futuros**: Proceso que analice `removedIngredients` en historial de pedidos y calcule frecuencia de modificaciones.
- **Color Sugerido**: `#06B6D4` (Cian)

### 6. **Horario Específico** 🔵
- **Descripción**: Cliente que siempre ordena en el mismo horario del día.
- **Razón de No Implementación**: El sistema tiene `order.createdAt` pero no hay proceso que analice patrones de horario de pedidos.
- **Requisitos Futuros**: Proceso que analice horas de `createdAt` de pedidos completados y detecte patrones (ej: siempre ordena entre 12-14h).
- **Color Sugerido**: `#06B6D4` (Cian)

### 7. **Delivery Preferido** 🔵
- **Descripción**: Cliente que prefiere delivery sobre recogida.
- **Razón de No Implementación**: El sistema no diferencia entre delivery y recogida en el modelo de datos. Los estados `IN_TRANSIT` y `WAITING_PICKUP` indican el método, pero no hay campo explícito.
- **Requisitos Futuros**: Agregar campo `deliveryMethod: 'delivery' | 'pickup'` en `Order` o analizar estados `IN_TRANSIT` vs `WAITING_PICKUP`.
- **Color Sugerido**: `#06B6D4` (Cian)

### 8. **Recogida Preferida** 🔵
- **Descripción**: Cliente que prefiere recoger en el negocio.
- **Razón de No Implementación**: Misma razón que "Delivery Preferido".
- **Requisitos Futuros**: Agregar campo `deliveryMethod` o analizar estados.
- **Color Sugerido**: `#06B6D4` (Cian)

### 9. **Cliente Exigente** 🟡
- **Descripción**: Cliente que frecuentemente hace solicitudes especiales o reclamos.
- **Razón de No Implementación**: El sistema tiene `order.internalNotes` y `orderItem.note` pero no hay proceso que analice frecuencia o contenido de notas/reclamos.
- **Requisitos Futuros**: Proceso que analice contenido de notas y detecte patrones de reclamos o solicitudes especiales frecuentes.
- **Color Sugerido**: `#EAB308` (Amarillo)

### 10. **Cliente Satisfecho** 🟢
- **Descripción**: Cliente que expresa satisfacción frecuentemente.
- **Razón de No Implementación**: El sistema no tiene un campo de rating o feedback del cliente. No se captura satisfacción.
- **Requisitos Futuros**: Agregar sistema de ratings/feedback o analizar `internalNotes` para comentarios positivos.
- **Color Sugerido**: `#10B981` (Verde)

### 11. **Reclamos Frecuentes** 🔴
- **Descripción**: Cliente que frecuentemente presenta reclamos.
- **Razón de No Implementación**: El sistema tiene `order.status === ISSUE` pero no diferencia entre tipos de problemas. No hay tracking de reclamos específicos.
- **Requisitos Futuros**: Agregar categorización de problemas o sistema de tickets de reclamos.
- **Color Sugerido**: `#EF4444` (Rojo)

### 12. **No Responde** 🟡
- **Descripción**: Cliente que no responde a mensajes o llamadas.
- **Razón de No Implementación**: El sistema no tiene integración con WhatsApp o sistema de mensajería que trackee intentos de contacto y respuestas.
- **Requisitos Futuros**: Integración con API de WhatsApp o sistema de mensajería que trackee intentos y respuestas.
- **Color Sugerido**: `#EAB308` (Amarillo)

### 13. **Responde Rápido** 🟢
- **Descripción**: Cliente que responde rápidamente a mensajes.
- **Razón de No Implementación**: Misma razón que "No Responde".
- **Requisitos Futuros**: Integración con sistema de mensajería.
- **Color Sugerido**: `#10B981` (Verde)

### 14. **Frecuente** 🟢
- **Descripción**: Cliente que ordena frecuentemente (ej: más de 2 veces por semana).
- **Razón de No Implementación**: El sistema puede calcular frecuencia pero no hay un proceso automático que analice patrones de frecuencia y compare con umbrales.
- **Requisitos Futuros**: Proceso que calcule frecuencia de pedidos en ventana de tiempo (ej: últimos 30 días) y compare con umbral.
- **Color Sugerido**: `#10B981` (Verde)

---

## 📊 Resumen de Implementación

### Etiquetas Automáticas Implementables (8)
1. ✅ Nuevo
2. ✅ Pago Fallido
3. ✅ Cancelaciones Frecuentes
4. ✅ Problemas de Entrega
5. ✅ Reembolsos
6. ✅ Cliente Activo
7. ✅ En Riesgo
8. ✅ Primer Pedido

### Etiquetas Manuales (12)
1. VIP
2. Peligroso / Problemático
3. Restricciones Alimentarias
4. Dirección Especial
5. Horario Restringido
6. Empleado
7. Amigo / Familiar
8. Cliente Corporativo
9. Influencer / Referidor
10. Descuento Activo
11. No Contactar
12. Verificación Pendiente

### Etiquetas Futuras (14)
Todas requieren funcionalidades adicionales o mejoras en el sistema actual.

---

## 🔧 Notas de Implementación Técnica

### Puntos de Integración para Etiquetas Automáticas

1. **User Creation**:
   - `src/features/database/actions/users/createUser.action.ts`
   - `src/features/database/actions/users/getOrCreateUser.action.ts`
   - Agregar lógica para asignar "Nuevo" al crear usuario

2. **Order Creation**:
   - `src/features/orders/actions/createOrder.action.ts`
   - `src/features/menu/actions/createOrderFromCart.action.ts`
   - Agregar lógica para remover "Nuevo" si pedido es en día diferente

3. **Order Status Updates**:
   - `src/features/orders/actions/updateOrderStatus.action.ts`
   - Agregar lógica para:
     - "Pago Fallido" cuando status = `PAYMENT_FAILED`
     - "Cancelaciones Frecuentes" cuando status = `CANCELLED`
     - "Problemas de Entrega" cuando status = `ISSUE`
     - "Reembolsos" cuando status = `REFUNDED`
     - "Cliente Activo" cuando status = `COMPLETED`
     - "Primer Pedido" cuando status = `COMPLETED` y es el primero

4. **User Stats Calculation**:
   - `src/features/users/actions/getUsersWithStats.action.ts`
   - Agregar lógica para "En Riesgo" basado en `lastOrderDate`

### Funciones Helper Necesarias

Se recomienda crear funciones helper en `src/features/etiquetas/utils/`:

- `assignEtiquetaToUser(userId: string, etiquetaId: string)`
- `removeEtiquetaFromUser(userId: string, etiquetaId: string)`
- `hasEtiqueta(user: User, etiquetaId: string): boolean`
- `getEtiquetaIdByName(name: string): Promise<string | null>`
- `calculateUserEtiquetas(user: User, orders: Order[]): string[]`

---

## 🎨 Guía de Colores

- 🟢 **Verde** (`#10B981`): Etiquetas positivas, clientes valiosos
- 🔴 **Rojo** (`#EF4444`): Etiquetas de advertencia, problemas
- 🟡 **Amarillo** (`#EAB308`): Etiquetas de atención, situaciones especiales
- 🔵 **Azul/Cian** (`#06B6D4`): Etiquetas informativas, preferencias
- 🟣 **Púrpura** (`#8B5CF6`): Etiquetas de relaciones especiales

---

**Última Actualización**: Basado en análisis del sistema actual (2024)
**Versión del Sistema**: Análisis de código base actual

