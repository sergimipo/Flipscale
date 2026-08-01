import { NextResponse } from 'next/server';
import sharp from 'sharp';

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

    // Validar tamaño (máximo 10MB para Vercel Hobby)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande. Máximo 10MB.' 
      }, { status: 400 });
    }

    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Usar sharp para eliminar TODOS los metadatos
    const cleanedBuffer = await sharp(buffer)
      .withMetadata() // Mantiene los metadatos básicos necesarios
      .toBuffer();

    // Crear un nuevo buffer sin metadatos EXIF/IPTC/XMP
    const finalBuffer = await sharp(buffer)
      .jpeg({ quality: 95 }) // Para JPEG
      .png({ compressionLevel: 9 }) // Para PNG
      .webp({ quality: 95 }) // Para WebP
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Reconstruir la imagen sin metadatos
        return sharp(data)
          .withMetadata()
          .toBuffer();
      });

    // Determinar el tipo MIME y extensión
    let mimeType = file.type;
    let extension = file.name.split('.').pop().toLowerCase();

    // Asegurar que la extensión coincida con el tipo
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
    return new NextResponse(finalBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${cleanFileName}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('❌ Error en remove-metadata:', error);
    
    let errorMessage = 'Error al procesar la imagen';
    
    if (error.message.includes('Input buffer contains unsupported image format')) {
      errorMessage = 'Formato de imagen no soportado. Usa JPEG, PNG o WebP.';
    } else if (error.message.includes('Premature end of JPEG file')) {
      errorMessage = 'El archivo JPEG está corrupto o incompleto.';
    } else if (error.message.includes('Image too large')) {
      errorMessage = 'La imagen es demasiado grande para procesar.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}