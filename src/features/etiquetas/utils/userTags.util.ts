import clientPromise from '@/features/database/config/mongodb';
import { ObjectId } from 'mongodb';
import { Order, OrderStatus, OrderStatusType } from '@/features/database/types/index.type';
import { SYSTEM_ETIQUETA_TAGS } from '../constants/systemEtiquetaTags.constants';
import { User } from '@/features/database/types/user.type';

type DbUser = User & { _id?: ObjectId | string };

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

async function getDb() {
  const client = await clientPromise;
  return client.db('saborea');
}

export async function addTagToUser(userId: string, tag: string): Promise<void> {
  const db = await getDb();
  await db.collection<DbUser>('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: { updatedAt: new Date() },
      $addToSet: { tags: tag },
    }
  );
}

export async function removeTagFromUser(userId: string, tag: string): Promise<void> {
  const db = await getDb();
  await db.collection<DbUser>('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: { updatedAt: new Date() },
      $pull: { tags: tag },
    }
  );
}

export async function assignNuevoOnUserCreation(userId: string): Promise<void> {
  await addTagToUser(userId, SYSTEM_ETIQUETA_TAGS.NUEVO);
}

export async function handleNuevoOnOrderCreated(userId: string, orderCreatedAt: Date): Promise<void> {
  const db = await getDb();
  const user = await db.collection<DbUser>('users').findOne({ _id: new ObjectId(userId) });

  if (!user || !user.createdAt) {
    return;
  }

  const userCreatedAt = new Date(user.createdAt);
  const hasNuevo = Array.isArray(user.tags) && user.tags.includes(SYSTEM_ETIQUETA_TAGS.NUEVO);

  if (!hasNuevo) {
    return;
  }

  if (!isSameCalendarDay(userCreatedAt, orderCreatedAt)) {
    await removeTagFromUser(userId, SYSTEM_ETIQUETA_TAGS.NUEVO);
  }
}

export async function recalculateUserEtiquetasForOrderChanges(
  userId: string,
  customerPhone: string
): Promise<void> {
  const db = await getDb();

  // If userId is not provided, try to find user by phone number
  let actualUserId = userId;
  if (!actualUserId && customerPhone) {
    const user = await db.collection<DbUser>('users').findOne({ phoneNumber: customerPhone });
    if (user && user._id) {
      actualUserId = user._id.toString();
    } else {
      // User doesn't exist, can't assign etiquetas
      return;
    }
  }

  if (!actualUserId) {
    // No userId and no phone number, can't proceed
    return;
  }

  const orders = await db
    .collection<Order>('orders')
    .find({
      $or: [
        { userId: actualUserId },
        { customerPhone },
      ],
    })
    .toArray();

  if (!orders || orders.length === 0) {
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PAGO_FALLIDO);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CANCELACIONES_FRECUENTES);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PROBLEMAS_ENTREGA);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CLIENTE_ACTIVO);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PRIMER_PEDIDO);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.EN_RIESGO);
    return;
  }

  const now = new Date();

  const completedOrders = orders.filter((o) => o.status === OrderStatus.COMPLETED);
  const cancelledOrders = orders.filter((o) => o.status === OrderStatus.CANCELLED);
  const paymentFailedOrders = orders.filter((o) => o.status === OrderStatus.PAYMENT_FAILED);
  const issueOrders = orders.filter((o) => o.status === OrderStatus.ISSUE);
  const refundedOrders = orders.filter((o) => o.status === OrderStatus.REFUNDED);

  const totalOrders = orders.length;

  if (paymentFailedOrders.length > 0) {
    await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PAGO_FALLIDO);
  } else {
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PAGO_FALLIDO);
  }

  const cancelledCount = cancelledOrders.length;
  const cancelledRatio = totalOrders > 0 ? cancelledCount / totalOrders : 0;

  if (cancelledCount >= 3 && cancelledRatio >= 0.3) {
    await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CANCELACIONES_FRECUENTES);
  } else {
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CANCELACIONES_FRECUENTES);
  }

  if (issueOrders.length > 0) {
    await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PROBLEMAS_ENTREGA);
  } else {
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PROBLEMAS_ENTREGA);
  }

  if (refundedOrders.length > 0) {
    await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.REEMBOLSOS);
  }

  if (completedOrders.length > 0) {
    const sortedCompleted = [...completedOrders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const firstCompletedAt = new Date(sortedCompleted[0].createdAt);
    const lastCompletedAt = new Date(sortedCompleted[sortedCompleted.length - 1].createdAt);

    if (!isNaN(firstCompletedAt.getTime())) {
      if (sortedCompleted.length === 1) {
        await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PRIMER_PEDIDO);
      } else {
        await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PRIMER_PEDIDO);
      }
    }

    if (!isNaN(lastCompletedAt.getTime())) {
      const daysSinceLastCompleted =
        (now.getTime() - lastCompletedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastCompleted <= 30) {
        await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CLIENTE_ACTIVO);
      } else {
        await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CLIENTE_ACTIVO);
      }

      if (daysSinceLastCompleted >= 60 && sortedCompleted.length > 0) {
        await addTagToUser(actualUserId, SYSTEM_ETIQUETA_TAGS.EN_RIESGO);
      } else {
        await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.EN_RIESGO);
      }
    }
  } else {
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.CLIENTE_ACTIVO);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.PRIMER_PEDIDO);
    await removeTagFromUser(actualUserId, SYSTEM_ETIQUETA_TAGS.EN_RIESGO);
  }
}


