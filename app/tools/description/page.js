'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DescriptionTool() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Nuevo con etiquetas');
  const [languages, setLanguages] = useState(['es']);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageBase64(reader.result); // Esto ya genera el formato "data:image/..." perfecto para la IA
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      // Evitar que se quede sin ningún idioma
      if (languages.length > 1) {
        setLanguages(languages.filter((l) => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const generateDescription = async () => {
    if (!imageBase64 || !shortDesc || !price) {
      setError('Por favor, sube una foto, escribe una descripción breve y añade el precio.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          shortDescription: shortDesc,
          price,
          condition,
          languages,
        }),
      });

      const data = await res.json();

      if (data.description) {
        setResult(data.description);
      } else {
        setError(data.error || 'Error al generar la descripción.');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con la IA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('¡Descripción copiada al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          ✨ Optimizador de Descripciones IA
        </h1>
        <p className="text-center text-gray-600 mb-8">
  Sube una foto y completa los datos. La IA &quot;verá&quot; tu producto y escribirá la descripción perfecta.
</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA: INPUTS */}
          <div className="space-y-4">
            {/* Subida de Imagen */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-bold mb-2">1. Foto del producto</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <img src={image} alt="Preview" className="max-h-48 mx-auto rounded" />
                ) : (
                  <div className="py-8">
                    <p className="text-4xl mb-2">📷</p>
                    <p className="text-gray-500">Haz clic para subir una foto</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Descripción Breve */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-bold mb-2">2. Descripción breve</label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Ej: Gafas de ciclismo, incluye estuche y lentes extra..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                rows="3"
              />
            </div>

            {/* Precio */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-bold mb-2">3. Precio (€)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 39,99"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Estado */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-bold mb-2">4. Estado del producto</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option>Nuevo con etiquetas</option>
                <option>Nuevo sin etiquetas</option>
                <option>Muy bueno</option>
                <option>Bueno</option>
                <option>Satisfactorio</option>
              </select>
            </div>

            {/* Idiomas */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block font-bold mb-2">5. Idiomas</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleLanguage('es')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    languages.includes('es') ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    languages.includes('en') ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => toggleLanguage('fr')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    languages.includes('fr') ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🇫🇷 Français
                </button>
              </div>
            </div>

            <button
              onClick={generateDescription}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                loading ? 'bg-gray-400 text-gray-200' : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {loading ? '⏳ La IA está analizando la imagen...' : '✨ Generar Descripción'}
            </button>
          </div>

          {/* COLUMNA DERECHA: RESULTADO */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-lg">Resultado</label>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                >
                  📋 Copiar
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded mb-4">⚠️ {error}</div>
            )}

            {result ? (
              <div className="bg-gray-50 p-4 rounded-lg border whitespace-pre-wrap text-gray-800 min-h-[300px] font-mono text-sm">
                {result}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border text-gray-400 min-h-[300px] flex items-center justify-center text-center">
                Aquí aparecerá la descripción optimizada por la IA...
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/dashboard" className="text-purple-600 hover:underline">← Volver al Dashboard</a>
        </div>
      </div>
    </div>
  );
}