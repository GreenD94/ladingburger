'use client';

import React from 'react';
import { UserWithStats } from '@/features/users/actions/getUserById.action';
import { formatDate } from '@/features/users/utils/dateFormat.util';
import { useUserDetailedStats } from '@/features/users/hooks/useUserDetailedStats.hook';
import {
  calculateRetentionLevel,
  formatChurnRisk,
  getChurnRiskColor,
  formatCurrency,
  formatPercentage,
  getRiskScore,
  getRiskLevel,
} from '@/features/users/utils/userStats.util';
import { RevenueChart } from '@/features/users/components/charts/RevenueChart.component';
import { OrderFrequencyChart } from '@/features/users/components/charts/OrderFrequencyChart.component';
import { AverageOrderValueChart } from '@/features/users/components/charts/AverageOrderValueChart.component';
import { OrderStatusChart } from '@/features/users/components/charts/OrderStatusChart.component';
import { OrderTimeDistributionChart } from '@/features/users/components/charts/OrderTimeDistributionChart.component';
import { InfoModal } from '@/features/shared/components/InfoModal.component';
import { EMPTY_STRING } from '@/features/database/constants/emptyValues.constants';
import styles from '@/features/users/styles/UserStatsTab.module.css';

interface UserStatsTabProps {
  user: UserWithStats;
}

export function UserStatsTab({ user }: UserStatsTabProps) {
  const { stats, loading } = useUserDetailedStats(user.phoneNumber);

  if (loading || !stats) {
    return (
      <div className={styles.content}>
        <div className={styles.loadingState}>
          <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
          <p className={styles.loadingText}>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const retentionLevel = calculateRetentionLevel(stats.totalOrders);
  const riskScore = getRiskScore(stats);
  const riskLevel = getRiskLevel(riskScore);
  const riskColor = getChurnRiskColor(riskLevel);

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Métricas Clave</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>payments</span>
                <p className={styles.statLabel}>Lifetime Value</p>
              </div>
              <InfoModal
                title="Lifetime Value (LTV)"
                description="El Lifetime Value representa el valor total que un cliente ha generado para el negocio a lo largo de toda su relación. Es la suma de todos los ingresos provenientes de pedidos completados del cliente."
                goodScenario="Un LTV alto indica un cliente valioso que genera ingresos significativos. Un LTV creciente sugiere que el cliente está aumentando su gasto con el tiempo."
                badScenario="Un LTV bajo o estancado puede indicar que el cliente no está generando suficiente valor o que está reduciendo su gasto."
                formula="LTV = Suma de todos los totales de pedidos completados"
                dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: totalPrice']}
              />
            </div>
            <p className={styles.statValue}>{formatCurrency(stats.lifetimeValue)}</p>
            <p className={styles.statDescription}>Valor total generado</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>receipt</span>
                <p className={styles.statLabel}>Ticket Promedio</p>
              </div>
              <InfoModal
                title="Ticket Promedio"
                description="El ticket promedio es el valor medio de cada pedido del cliente. Se calcula dividiendo el total de ingresos entre el número de pedidos completados."
                goodScenario="Un ticket promedio alto o en aumento indica que el cliente valora los productos y está dispuesto a gastar más. Esto sugiere oportunidades de upselling."
                badScenario="Un ticket promedio bajo o en disminución puede indicar que el cliente está reduciendo su gasto, posiblemente debido a problemas de precio o satisfacción."
                formula="Ticket Promedio = Lifetime Value / Número de pedidos completados"
                dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: totalPrice']}
              />
            </div>
            <p className={styles.statValue}>{formatCurrency(stats.averageOrderValue)}</p>
            <p className={styles.statDescription}>Por pedido</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>shopping_bag</span>
                <p className={styles.statLabel}>Total Pedidos</p>
              </div>
              <InfoModal
                title="Total de Pedidos"
                description="El total de pedidos muestra la cantidad de pedidos que el cliente ha realizado, incluyendo todos los estados. Los pedidos completados son los que generan ingresos."
                goodScenario="Un alto número de pedidos indica un cliente activo y comprometido. Múltiples pedidos sugieren alta satisfacción y lealtad."
                badScenario="Pocos pedidos o una alta proporción de pedidos no completados pueden indicar problemas de servicio o insatisfacción."
                formula="Total Pedidos = Número total de pedidos del cliente (todos los estados)"
                dataSources={['Colección de pedidos', 'Campo: customerPhone']}
              />
            </div>
            <p className={styles.statValue}>{stats.totalOrders}</p>
            <p className={styles.statDescription}>
              {stats.completedOrders} completados
            </p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>trending_up</span>
                <p className={styles.statLabel}>Retención</p>
              </div>
              <InfoModal
                title="Nivel de Retención"
                description="El nivel de retención clasifica al cliente según su frecuencia de compra. Se basa en el número total de pedidos completados: Alta (>5), Media (3-5), Baja (<3)."
                goodScenario="Alta retención indica un cliente leal y frecuente que realiza múltiples compras. Esto sugiere alta satisfacción y valor a largo plazo."
                badScenario="Baja retención puede indicar que el cliente realiza compras esporádicas o está perdiendo interés en el negocio."
                formula="Retención = Alta si >5 pedidos, Media si 3-5 pedidos, Baja si <3 pedidos"
                dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Conteo de pedidos']}
              />
            </div>
            <p className={styles.statValue}>{retentionLevel}</p>
            <p className={styles.statDescription}>Nivel de fidelidad</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Análisis de Riesgo y Costos</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>warning</span>
                <p className={styles.statLabel}>Riesgo de Churn</p>
              </div>
              <InfoModal
                title="Riesgo de Churn"
                description="El riesgo de churn indica la probabilidad de que el cliente deje de realizar pedidos. Se calcula basándose en los días transcurridos desde el último pedido: Bajo (≤30 días), Medio (31-90 días), Alto (>90 días)."
                goodScenario="Bajo riesgo indica un cliente activo que realiza pedidos recientemente. Esto sugiere alta satisfacción y engagement continuo."
                badScenario="Alto riesgo indica que el cliente no ha realizado pedidos en mucho tiempo, lo que puede significar pérdida de interés o migración a la competencia."
                formula="Riesgo = Bajo si ≤30 días, Medio si 31-90 días, Alto si >90 días desde último pedido"
                dataSources={['Colección de pedidos', 'Campo: createdAt', 'Fecha del último pedido']}
              />
            </div>
            <p className={styles.statValue} style={{ color: getChurnRiskColor(stats.churnRisk) }}>
              {formatChurnRisk(stats.churnRisk)}
            </p>
            <p className={styles.statDescription}>
              {stats.daysSinceLastOrder} días sin pedir
            </p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>cancel</span>
                <p className={styles.statLabel}>Tasa de Cancelación</p>
              </div>
              <InfoModal
                title="Tasa de Cancelación"
                description="La tasa de cancelación muestra el porcentaje de pedidos que fueron cancelados. Una alta tasa puede indicar problemas de servicio, insatisfacción o problemas logísticos."
                goodScenario="Una tasa de cancelación baja (<5%) indica que el cliente está satisfecho con el servicio y rara vez cancela pedidos."
                badScenario="Una tasa de cancelación alta (>20%) puede generar pérdidas, costos operativos y sugiere problemas de servicio o satisfacción."
                formula="Tasa de Cancelación = (Número de pedidos cancelados / Total de pedidos) × 100"
                dataSources={['Colección de pedidos', 'Estado: CANCELLED', 'Total de pedidos']}
              />
            </div>
            <p className={styles.statValue}>{formatPercentage(stats.cancellationRate)}</p>
            <p className={styles.statDescription}>
              {stats.cancelledOrders} de {stats.totalOrders} pedidos
            </p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>payments</span>
                <p className={styles.statLabel}>Tasa de Reembolso</p>
              </div>
              <InfoModal
                title="Tasa de Reembolso"
                description="La tasa de reembolso muestra el porcentaje de pedidos que fueron reembolsados. Los reembolsos generan pérdidas directas y costos operativos adicionales."
                goodScenario="Una tasa de reembolso baja (<5%) indica que el cliente está satisfecho y rara vez requiere reembolsos, minimizando pérdidas."
                badScenario="Una tasa de reembolso alta (>10%) genera pérdidas significativas y sugiere problemas graves de calidad, servicio o satisfacción."
                formula="Tasa de Reembolso = (Número de pedidos reembolsados / Total de pedidos) × 100"
                dataSources={['Colección de pedidos', 'Estado: REFUNDED', 'Valor de reembolsos']}
              />
            </div>
            <p className={styles.statValue}>{formatPercentage(stats.refundRate)}</p>
            <p className={styles.statDescription}>
              {formatCurrency(stats.totalRefunds)} reembolsados
            </p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>credit_card</span>
                <p className={styles.statLabel}>Éxito de Pago</p>
              </div>
              <InfoModal
                title="Tasa de Éxito de Pago"
                description="La tasa de éxito de pago muestra el porcentaje de pedidos que tuvieron pagos exitosos versus pagos fallidos. Una alta tasa indica un cliente con capacidad de pago confiable."
                goodScenario="Una tasa de éxito alta (>85%) indica que el cliente tiene capacidad de pago confiable y rara vez tiene problemas de pago."
                badScenario="Una tasa de éxito baja (<70%) puede generar problemas operativos, retrasos y sugiere problemas financieros del cliente."
                formula="Tasa de Éxito = ((Total de pedidos - Pedidos con pago fallido) / Total de pedidos) × 100"
                dataSources={['Colección de pedidos', 'Estado: PAYMENT_FAILED', 'Total de pedidos']}
              />
            </div>
            <p className={styles.statValue}>{formatPercentage(stats.paymentSuccessRate)}</p>
            <p className={styles.statDescription}>
              {stats.totalOrders - stats.failedPaymentOrders} de {stats.totalOrders} exitosos
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Métricas de Frecuencia</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>calendar_month</span>
                <p className={styles.statLabel}>Frecuencia Mensual</p>
              </div>
              <InfoModal
                title="Frecuencia Mensual de Pedidos"
                description="La frecuencia mensual muestra cuántos pedidos realiza el cliente en promedio por mes. Se calcula basándose en el historial completo del cliente y los días transcurridos desde el primer pedido."
                goodScenario="Una frecuencia alta (>2 pedidos/mes) indica un cliente activo y comprometido que realiza compras regulares."
                badScenario="Una frecuencia baja (<0.5 pedidos/mes) puede indicar que el cliente realiza compras esporádicas o está perdiendo interés."
                formula="Frecuencia Mensual = (Número de pedidos completados / Días desde primer pedido) × 30"
                dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Fechas de creación']}
              />
            </div>
            <p className={styles.statValue}>{stats.orderFrequency.toFixed(1)}</p>
            <p className={styles.statDescription}>Pedidos por mes</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>schedule</span>
                <p className={styles.statLabel}>Días desde Último Pedido</p>
              </div>
              <InfoModal
                title="Días desde Último Pedido"
                description="Esta métrica muestra cuántos días han transcurrido desde que el cliente realizó su último pedido. Es un indicador clave de actividad y riesgo de churn."
                goodScenario="Pocos días (<30) indican un cliente activo que realiza pedidos recientemente, sugiriendo alta satisfacción."
                badScenario="Muchos días (>90) sin pedidos pueden indicar pérdida de interés, problemas de servicio o migración a la competencia."
                formula="Días desde Último Pedido = Fecha actual - Fecha del último pedido completado"
                dataSources={['Colección de pedidos', 'Estado: COMPLETED', 'Campo: createdAt']}
              />
            </div>
            <p className={styles.statValue}>{stats.daysSinceLastOrder}</p>
            <p className={styles.statDescription}>Días transcurridos</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>trending_up</span>
                <p className={styles.statLabel}>Valor Anual Proyectado</p>
              </div>
              <InfoModal
                title="Valor Anual Proyectado"
                description="El valor anual proyectado estima cuánto generará el cliente en un año completo basándose en su frecuencia actual de pedidos y ticket promedio. Es una proyección que ayuda a planificar ingresos."
                goodScenario="Un valor anual proyectado alto indica un cliente valioso que generará ingresos significativos si mantiene su frecuencia actual."
                badScenario="Un valor anual proyectado bajo puede indicar que el cliente no generará suficientes ingresos o que su frecuencia está disminuyendo."
                formula="Valor Anual = (Frecuencia Mensual / 30) × Ticket Promedio × 365"
                dataSources={['Frecuencia mensual', 'Ticket promedio', 'Cálculo proyectado']}
              />
            </div>
            <p className={styles.statValue}>{formatCurrency(stats.projectedAnnualValue)}</p>
            <p className={styles.statDescription}>Basado en frecuencia actual</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statHeaderLeft}>
                <span className={`material-symbols-outlined ${styles.statIcon}`}>score</span>
                <p className={styles.statLabel}>Puntuación de Riesgo</p>
              </div>
              <InfoModal
                title="Puntuación de Riesgo"
                description="La puntuación de riesgo es un indicador compuesto (0-100) que combina múltiples factores: días desde último pedido, tasa de cancelación, tasa de reembolso y tasa de éxito de pago. Una puntuación alta indica mayor riesgo."
                goodScenario="Una puntuación baja (<30) indica un cliente confiable con bajo riesgo de problemas, cancelaciones o pérdida."
                badScenario="Una puntuación alta (>60) indica múltiples factores de riesgo que pueden generar pérdidas, costos operativos o pérdida del cliente."
                formula="Puntuación = (Días sin pedir × peso) + (Tasa cancelación × peso) + (Tasa reembolso × peso) + (Tasa pago fallido × peso)"
                dataSources={['Múltiples métricas', 'Cálculo compuesto', 'Factores de riesgo']}
              />
            </div>
            <p className={styles.statValue} style={{ color: riskColor }}>
              {riskScore}/100
            </p>
            <p className={styles.statDescription}>
              Nivel: {formatChurnRisk(riskLevel)}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Tendencias de Ingresos</h3>
        <div className={styles.chartCard}>
          <RevenueChart data={stats.revenueByMonth} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Frecuencia de Pedidos</h3>
        <div className={styles.chartCard}>
          <OrderFrequencyChart data={stats.ordersByMonth} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Ticket Promedio</h3>
        <div className={styles.chartCard}>
          <AverageOrderValueChart data={stats.averageOrderValueByMonth} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Distribución de Estados</h3>
        <div className={styles.chartCard}>
          <OrderStatusChart data={stats.orderStatusDistribution} />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Distribución Temporal</h3>
        <div className={styles.chartCard}>
          <OrderTimeDistributionChart
            dayData={stats.ordersByDayOfWeek}
            hourData={stats.ordersByHour}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Fechas Importantes</h3>
        <div className={styles.datesCard}>
          <div className={styles.dateItem}>
            <span className={`material-symbols-outlined ${styles.dateIcon}`}>event</span>
            <div className={styles.dateContent}>
              <p className={styles.dateLabel}>Primer Pedido</p>
              <p className={styles.dateValue}>
                {formatDate(stats.firstOrderDate)}
              </p>
            </div>
          </div>
          <div className={styles.dateItem}>
            <span className={`material-symbols-outlined ${styles.dateIcon}`}>schedule</span>
            <div className={styles.dateContent}>
              <p className={styles.dateLabel}>Último Pedido</p>
              <p className={styles.dateValue}>
                {formatDate(stats.lastOrderDate)}
              </p>
            </div>
          </div>
          <div className={styles.dateItem}>
            <span className={`material-symbols-outlined ${styles.dateIcon}`}>calendar_today</span>
            <div className={styles.dateContent}>
              <p className={styles.dateLabel}>Días como Cliente</p>
              <p className={styles.dateValue}>
                {stats.daysSinceFirstOrder} días
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
