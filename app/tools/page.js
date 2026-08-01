'use client';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import exifr from 'exifr';

export default function Tools() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [globalError, setGlobalError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState(null);
  const [usageStatus, setUsageStatus] = useState({
    allowed: true,
    remaining: 5,
    count: 0,
  });

  const fileInputRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setSubscription(sub);

      const hasSub = sub && sub.status === 'active';
      const res = await fetch(`/api/usage?userId=${user.id}&hasSubscription=${hasSub}`);
      const usageData = await res.json();
      setUsageStatus(usageData);
    };
    init();
  }, []);

  const handleFileSelect = async (e) => {
    const newFiles = Array.from(e.target.files);
    await processFiles(newFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (droppedFiles.length > 0) await processFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = async (newFiles) => {
    setGlobalError('');
    const processedFiles = await Promise.all(
      newFiles.map(async (file) => {
        let metadata = {};
        try {
          metadata = (await exifr.parse(file)) || {};
        } catch (err) {
          metadata = { error: 'No se pudieron leer' };
        }
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          metadata,
          status: 'pending',
          cleanBlob: null,
        };
      })
    );
    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const processAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setProcessing(true);
    setGlobalError('');
    setProgress(0);

    const hasSub = subscription && subscription.status === 'active';
    let localRemaining = hasSub ? 999 : usageStatus.remaining;
    let processedCount = 0;

    for (const fileObj of pendingFiles) {
      if (localRemaining <= 0 && !hasSub) {
        setGlobalError(
          `Has alcanzado el límite de 5 imágenes este mes. Actualiza tu plan para desbloquear usos ilimitados.`
        );
        setFiles((prev) =>
          prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'error' } : f))
        );
        break;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: 'processing' } : f
        )
      );

      try {
        // ✅ LLAMAR AL ENDPOINT REAL DE BORRADO DE METADATOS
        const formData = new FormData();
        formData.append('file', fileObj.file);

        const res = await fetch('/api/remove-metadata', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error al procesar la imagen');
        }

        // Obtener el blob de la imagen limpia
        const cleanBlob = await res.blob();
        const cleanUrl = URL.createObjectURL(cleanBlob);

        // Registrar el uso
        const postRes = await fetch('/api/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        
        if (!postRes.ok) {
          console.warn('No se pudo registrar el uso, pero la imagen se procesó');
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: 'done', cleanBlob, cleanUrl }
              : f
          )
        );

        if (!hasSub) {
          localRemaining -= 1;
          setUsageStatus({
            allowed: localRemaining > 0,
            remaining: localRemaining,
            count: usageStatus.count + 1,
          });
        }
      } catch (error) {
        console.error('Error procesando imagen:', error);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileObj.id ? { ...f, status: 'error', errorMsg: error.message } : f))
        );
      }

      processedCount += 1;
      setProgress(Math.round((processedCount / pendingFiles.length) * 100));
    }
    setProcessing(false);
  };

  const downloadImage = (fileObj) => {
    if (!fileObj.cleanBlob) return;
    const link = document.createElement('a');
    link.href = fileObj.cleanUrl;
    link.download = `Flipscale_${fileObj.file.name.replace(/\.[^/.]+$/, '')}_clean.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    files
      .filter((f) => f.status === 'done')
      .forEach((f, index) => {
        setTimeout(() => downloadImage(f), index * 500);
      });
  };

  const clearAll = () => {
    setFiles([]);
    setGlobalError('');
    setProgress(0);
    setExpandedFileId(null);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );

  const hasSubscription = subscription && subscription.status === 'active';
  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">
          🔒 Borrado de Metadatos por Lotes
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {hasSubscription
            ? `✅ Plan ${subscription.plan.toUpperCase()} activo: Procesamiento por lotes ilimitado.`
            : `Usuario gratuito: ${usageStatus.remaining} de 5 imágenes disponibles este mes.`}
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`bg-white p-8 rounded-lg shadow mb-6 border-2 border-dashed transition-all cursor-pointer ${
            isDragging ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
          }`}
          onClick={() => !processing && fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="text-5xl mb-4"></div>
            <h2 className="text-xl font-bold mb-2">
              Arrastra tus imágenes aquí
            </h2>
            <p className="text-gray-600 mb-4">
              o haz clic para seleccionar múltiples archivos
            </p>
            <p className="text-sm text-gray-500">
              Soporta: JPEG, PNG, WebP (Procesamiento en lote)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            disabled={processing}
            className="hidden"
          />
        </div>

        {processing && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-purple-700">
                Procesando lote...
              </span>
              <span className="font-bold text-purple-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Archivos ({files.length}){' '}
                <span className="text-sm font-normal text-gray-500">
                  ({doneCount} completados)
                </span>
              </h2>
              <div className="flex gap-4">
                {doneCount > 0 && (
                  <button
                    onClick={downloadAll}
                    className="text-green-600 text-sm font-bold hover:underline"
                  >
                    ⬇️ Descargar todo
                  </button>
                )}
                <button
                  onClick={clearAll}
                  disabled={processing}
                  className="text-red-500 text-sm hover:underline disabled:opacity-50"
                >
                  Limpiar todo
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {files.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row gap-4"
                >
                  <img
                    src={fileObj.preview}
                    alt="preview"
                    className="w-full md:w-24 h-24 object-cover rounded border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{fileObj.file.name}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {(fileObj.file.size / 1024).toFixed(2)} KB
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-sm font-bold flex items-center gap-2 ${
                          fileObj.status === 'done'
                            ? 'text-green-600'
                            : fileObj.status === 'processing'
                            ? 'text-blue-600'
                            : fileObj.status === 'error'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {fileObj.status === 'done' && '✅ Procesada'}
                        {fileObj.status === 'processing' && '⏳ Procesando...'}
                        {fileObj.status === 'error' && `❌ Error${fileObj.errorMsg ? ': ' + fileObj.errorMsg : ''}`}
                        {fileObj.status === 'pending' && '⏸️ Pendiente'}
                      </span>

                      {fileObj.status === 'done' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setExpandedFileId(
                                expandedFileId === fileObj.id
                                  ? null
                                  : fileObj.id
                              )
                            }
                            className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded text-sm hover:bg-blue-100 font-medium transition flex items-center gap-1"
                          >
                            {expandedFileId === fileObj.id
                              ? 'Ocultar detalles'
                              : '👁️ Ver qué se eliminó'}
                          </button>
                          <button
                            onClick={() => downloadImage(fileObj)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
                          >
                            ⬇️ Descargar
                          </button>
                        </div>
                      )}
                    </div>

                    {expandedFileId === fileObj.id && (
                      <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <span className="text-red-500">🗑️</span> Metadatos
                          originales detectados y eliminados:
                        </p>
                        {Object.keys(fileObj.metadata).length > 0 &&
                        !fileObj.metadata.error ? (
                          <pre className="whitespace-pre-wrap text-gray-600 max-h-40 overflow-y-auto bg-white p-2 rounded border font-mono">
                            {JSON.stringify(fileObj.metadata, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-gray-500 italic bg-white p-2 rounded border">
                            {fileObj.metadata.error ||
                              'No se detectaron metadatos significativos (EXIF, GPS, cámara) en esta imagen.'}
                          </p>
                        )}
                        <p className="mt-2 text-green-700 font-semibold flex items-center gap-1">
                          <span>✅</span> Toda esta información ha sido
                          eliminada permanentemente de la imagen limpia.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {globalError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-800 font-bold">⚠️ {globalError}</p>
          </div>
        )}

        {pendingCount > 0 && (
          <button
            onClick={processAllFiles}
            disabled={processing || (!usageStatus.allowed && !hasSubscription)}
            className={`w-full px-6 py-4 rounded-lg font-bold text-lg mb-4 transition flex items-center justify-center gap-2 ${
              processing || (!usageStatus.allowed && !hasSubscription)
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {processing
              ? '⏳ Procesando lote...'
              : !usageStatus.allowed && !hasSubscription
              ? ' Límite mensual alcanzado'
              : `🗑️ Procesar ${pendingCount} imagen(es) y Eliminar Metadatos`}
          </button>
        )}

        <div className="text-center">
          <a
            href="/dashboard"
            className="text-purple-600 hover:underline font-medium"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}