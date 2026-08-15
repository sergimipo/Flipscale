'use client';
import { useState, useEffect } from 'react';

const ALL_LANGUAGES = [
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'en', label: '🇬🇧 Inglés' },
  { code: 'fr', label: '🇷 Francés' },
];

const CONDITIONS = [
  'Nuevo con etiquetas',
  'Nuevo sin etiquetas',
  'Muy bueno',
  'Bueno',
  'Satisfactorio',
];

export default function DescriptionToolPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [languages, setLanguages] = useState(['es', 'en', 'fr']);
  const [presetText, setPresetText] = useState('');

  const [generating, setGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState(null);
  const [generateError, setGenerateError] = useState('');

  // Presets guardados
  const [savedPresets, setSavedPresets] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [savingPreset, setSavingPreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    fetchPresets();
  }, []);

  async function fetchPresets() {
    setLoadingPresets(true);
    try {
      const res = await fetch('/api/presets');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSavedPresets(data.items || []);
    } catch (err) {
      console.error('Error fetchPresets:', err);
    } finally {
      setLoadingPresets(false);
    }
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    
    try {
      const compressed = await compressImage(file);
      setImageBase64(compressed);
    } catch (err) {
      console.error('Error al comprimir imagen:', err);
      setGenerateError('Error al procesar la imagen.');
    }

    // Limpiar campos al subir nueva imagen
    setShortDesc('');
    setPrice('');
    setCondition('');
  }

  function toggleLanguage(code) {
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  }

  function loadSavedPreset(preset) {
    setPresetText(preset.template_text);
    // Limpiar campos al cambiar de preset
    setShortDesc('');
    setPrice('');
    setCondition('');
  }

  async function handleSavePreset() {
    if (!presetText.trim()) {
      alert('Primero pega una descripción base.');
      return;
    }
    if (!presetName.trim()) {
      alert('Ponle un nombre al preset.');
      return;
    }

    setSavingPreset(true);
    try {
      const res = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: presetName.trim(),
          template_text: presetText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSavedPresets((prev) => [data.item, ...prev]);
      setPresetName('');
      alert('✅ Preset guardado correctamente');
    } catch (err) {
      console.error('Error saving preset:', err);
      alert('Error al guardar el preset');
    } finally {
      setSavingPreset(false);
    }
  }

  async function handleDeletePreset(id) {
    if (!confirm('¿Borrar este preset?')) return;
    try {
      const res = await fetch(`/api/presets?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al borrar');
      setSavedPresets((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('No se pudo borrar');
    }
  }

  async function handleGenerate() {
    // Si hay preset, no hace falta imagen ni descripción breve
    if (!presetText.trim() && !shortDesc.trim()) {
      setGenerateError('Pega un preset o escribe una descripción.');
      return;
    }
    if (languages.length === 0) {
      setGenerateError('Selecciona al menos un idioma.');
      return;
    }

    setGenerating(true);
    setGenerateError('');
    setGeneratedDescription(null);

    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64,
          shortDesc,
          price: price || null,
          condition: condition || null,
          languages,
          presetText: presetText || '',
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }
      
      setGeneratedDescription(data.description);
    } catch (err) {
      console.error('Error completo:', err);
      setGenerateError(err.message || 'No se pudo generar la descripción.');
    } finally {
      setGenerating(false);
    }
  }

  function copyToClipboard() {
    if (!generatedDescription) return;
    const text = typeof generatedDescription === 'string' 
      ? generatedDescription 
      : Object.values(generatedDescription).join('\n\n────────\n\n');
    navigator.clipboard.writeText(text);
    alert('¡Descripción copiada al portapapeles!');
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Generador de descripciones
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Datos del producto
            </h2>

            {/* SECCIÓN: PRESET CON LISTA DE GUARDADOS */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <label className="block text-sm font-bold text-indigo-900 mb-1">
                📋 Descripción Base (Preset)
              </label>
              <p className="text-xs text-indigo-700 mb-2">
                Pega aquí la descripción de un producto similar o selecciona un preset guardado.
              </p>

              {/* Lista de presets guardados */}
              {loadingPresets && (
                <p className="text-xs text-indigo-600 mb-2">Cargando presets...</p>
              )}
              {!loadingPresets && savedPresets.length > 0 && (
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-indigo-800 mb-1">
                    Mis presets guardados:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {savedPresets.map((preset) => (
                      <div key={preset.id} className="flex items-center gap-1 bg-white border border-indigo-200 rounded px-2 py-1">
                        <button
                          onClick={() => loadSavedPreset(preset)}
                          className="text-xs text-indigo-700 hover:text-indigo-900 font-medium"
                        >
                          {preset.name}
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Borrar"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                value={presetText}
                onChange={(e) => setPresetText(e.target.value)}
                rows={4}
                placeholder="Ej: 🇪🇸 Español&#10;Sudadera Nike...&#10;NUEVO SIN ETIQUETAS ✨..."
                className="w-full border border-indigo-300 rounded-lg p-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white mb-2"
              />

              {/* Guardar preset actual */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Nombre del preset (ej: Zapatillas Nike)"
                  className="flex-1 border border-indigo-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <button
                  onClick={handleSavePreset}
                  disabled={savingPreset || !presetText.trim() || !presetName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  {savingPreset ? 'Guardando...' : '💾 Guardar'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto del producto <span className="text-gray-400 text-xs">(opcional si hay preset)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="mt-3 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cambios / Descripción breve <span className="text-gray-400 text-xs">(opcional si hay preset)</span>
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={3}
                placeholder={presetText ? "Ej: Es la misma pero en color rojo y talla M" : "Ej: Gafas de sol azules, marca Ray-Ban..."}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (€) <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej: 45,99"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Seleccionar --</option>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idiomas
              </label>
              <div className="flex gap-4">
                {ALL_LANGUAGES.map((lang) => (
                  <label key={lang.code} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={languages.includes(lang.code)}
                      onChange={() => toggleLanguage(lang.code)}
                    />
                    {lang.label}
                  </label>
                ))}
              </div>
            </div>
            {generateError && (
              <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded border border-red-200">{generateError}</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2.5 rounded-lg transition"
            >
              {generating ? '⏳ Generando...' : '✨ Generar Descripción'}
            </button>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Descripción generada
            </h2>
            {!generatedDescription && !generating && (
              <p className="text-sm text-gray-500">
                Rellena el formulario y pulsa &quot;Generar Descripción&quot; para ver el resultado aquí.
              </p>
            )}
            {generating && (
              <p className="text-sm text-gray-500 animate-pulse">
                La IA está analizando...
              </p>
            )}
            {generatedDescription && (
              <>
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-800 border border-gray-200 min-h-[200px]">
                  {typeof generatedDescription === 'string'
                    ? generatedDescription
                    : languages.map((code) => {
                        const lang = ALL_LANGUAGES.find((l) => l.code === code);
                        const text = generatedDescription[code];
                        if (!text) return null;
                        return (
                          <div key={code} className="mb-3 last:mb-0">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              {lang?.label || code}
                            </p>
                            <p>{text}</p>
                          </div>
                        );
                      })}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="mt-4 w-full bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-2.5 rounded-lg transition text-sm"
                >
                   Copiar Descripción
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}