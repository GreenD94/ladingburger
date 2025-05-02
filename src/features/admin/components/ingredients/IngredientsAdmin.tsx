import React, { useState } from 'react';
import { useIngredients } from '@/features/admin/hooks/useIngredients';

export const IngredientsAdmin: React.FC = () => {
  const { ingredients, loading } = useIngredients();
  const [form, setForm] = useState({ name: '', cost: 0 });
  const [editing, setEditing] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editing) {
        await fetch('/api/ingredients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing, ...form }),
        });
      } else {
        await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: '', cost: 0 });
      setEditing(null);
      window.location.reload();
    } catch (err) {
      setError('Error al guardar el ingrediente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar ingrediente?')) {
      setSubmitting(true);
      setError(null);
      try {
        await fetch('/api/ingredients', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        window.location.reload();
      } catch (err) {
        setError('Error al eliminar el ingrediente');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEdit = (ingredient: any) => {
    setForm({ name: ingredient.name, cost: ingredient.cost });
    setEditing(ingredient._id);
  };

  if (loading) return <div>Cargando ingredientes...</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h2>Administrar Ingredientes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Nombre"
          required
          style={{ flex: 2, minWidth: 120, padding: 8 }}
          disabled={submitting}
        />
        <input
          type="number"
          value={form.cost}
          onChange={e => setForm(f => ({ ...f, cost: parseFloat(e.target.value) }))}
          placeholder="Costo"
          required
          min={0}
          step={0.01}
          style={{ flex: 1, minWidth: 80, padding: 8 }}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting} style={{ padding: '8px 16px' }}>
          {editing ? 'Actualizar' : 'Agregar'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ name: '', cost: 0 }); }} style={{ padding: '8px 16px' }}>
            Cancelar
          </button>
        )}
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>Nombre</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>Costo</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map(ing => (
            <tr key={ing._id}>
              <td style={{ padding: 8 }}>{ing.name}</td>
              <td style={{ padding: 8 }}>${ing.cost.toFixed(2)}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(ing)} style={{ marginRight: 8 }}>Editar</button>
                <button onClick={() => handleDelete(ing._id!)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 