import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No se ha enviado ningún archivo' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido. Solo se permiten JPEG, PNG y WebP.' }, { status: 400 });
    }

    // Límite estricto de 4MB para evitar el rechazo de Vercel
    const maxSize = 4 * 1024 * 1024; 
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'La imagen es demasiado grande. El límite es 4MB. Por favor, usa una imagen más pequeña.' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Eliminar metadatos de verdad
    const cleanedBuffer = await sharp(buffer).rotate().toBuffer();

    let mimeType = file.type;
    let extension = file.name.split('.').pop().toLowerCase();

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      mimeType = 'image/jpeg'; extension = 'jpg';
    } else if (file.type === 'image/png') {
      mimeType = 'image/png'; extension = 'png';
    } else if (file.type === 'image/webp') {
      mimeType = 'image/webp'; extension = 'webp';
    }

    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const cleanFileName = `${originalName}_clean.${extension}`;

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
    if (error.message.includes('unsupported image format')) errorMessage = 'Formato no soportado. Usa JPEG, PNG o WebP.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}