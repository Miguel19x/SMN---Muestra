import { useState } from 'react';
import type { FormEvent } from 'react';
import './BreadForm.css';

const BreadForm = () => {
  const [selectedBreads, setSelectedBreads] = useState<string[]>([]);
  const breadOptions = [
    'Pan de Maíz',
    'Pan de Trigo',
    'Pan Integral',
    'Baguette',
    'Pan de Centeno',
    'Pan de Avena',
    'Pan de Molde'
  ];

  const handleAddBread = (bread: string) => {
    if (!bread || selectedBreads.includes(bread)) return;
    
    setSelectedBreads([...selectedBreads, bread]);
  };

  const handleRemoveBread = (breadToRemove: string) => {
    setSelectedBreads(selectedBreads.filter(bread => bread !== breadToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Pedido:', selectedBreads);
  };

  return (
    <form onSubmit={handleSubmit} className="bread-form">
      <div className="form-group">
        <label>Selección de Panes:</label>
        <div className="bread-selection">
          <div className="selected-breads">
            {selectedBreads.map((bread) => (
              <div key={bread} className="bread-chip">
                {bread}
                <button
                  type="button"
                  onClick={() => handleRemoveBread(bread)}
                  className="remove-btn"
                  select-none
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <select
            value=""
            onChange={(e) => handleAddBread(e.target.value)}
            className="bread-select"
          >
            <option value="" disabled>Selecciona tus panes...</option>
            {breadOptions
              .filter(bread => !selectedBreads.includes(bread))
              .map((bread) => (
                <option key={bread} value={bread}>
                  {bread}
                </option>
              ))}
          </select>
        </div>
      </div>

      <button type="submit" className="submit-btn">Realizar Pedido</button>
    </form>
  );
};

export default BreadForm;