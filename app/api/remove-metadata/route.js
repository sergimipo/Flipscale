import { NextResponse } from 'next/server';
import sharp from 'sharp';

// ✅ 1. AUMENTAR EL LÍMITE DE TAMAÑO A 10MB
// Esto evita que Next.js bloquee la petición con "Request Entity Too Large"
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 });
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP.' 
      }, { status: 400 });
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande. Máximo 10MB.' 
      }, { status: 400 });
    }

    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ 2. ELIMINAR METADATOS DE VERDAD
    // Al NO usar .withMetadata(), sharp elimina automáticamente EXIF, GPS, cámara, etc.
    // Usamos .rotate() para corregir la orientación de la imagen antes de borrar los datos EXIF.
    const cleanedBuffer = await sharp(buffer)
      .rotate() 
      .toBuffer();

    // Determinar el tipo MIME y extensión
    let mimeType = file.type;
    let extension = file.name.split('.').pop().toLowerCase();

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      mimeType = 'image/jpeg';
      extension = 'jpg';
    } else if (file.type === 'image/png') {
      mimeType = 'image/png';
      extension = 'png';
    } else if (file.type === 'image/webp') {
      mimeType = 'image/webp';
      extension = 'webp';
    }

    // Crear el nombre del archivo limpio
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const cleanFileName = `${originalName}_clean.${extension}`;

    // Devolver el archivo limpio
    return new NextResponse(cleanedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${cleanFileName}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('❌ Error en remove-metadata:', error);
    
    let errorMessage = 'Error al procesar la imagen';
    
    if (error.message.includes('unsupported image format')) {
      errorMessage = 'Formato de imagen no soportado. Usa JPEG, PNG o WebP.';
    } else if (error.message.includes('Premature end')) {
      errorMessage = 'El archivo está corrupto o incompleto.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}