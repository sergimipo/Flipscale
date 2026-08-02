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

    // Validar tamaño (Vercel limita a ~4.5MB en plan Hobby)
    const maxSize = 4 * 1024 * 1024; // 4MB para estar seguros
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'La imagen es demasiado grande. El límite es 4MB. Por favor, comprímela antes de subirla.' 
      }, { status: 413 });
    }

    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Eliminar metadatos de verdad (sin .withMetadata())
    // .rotate() corrige la orientación de la imagen usando el EXIF antes de borrarlo
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
      errorMessage = 'Formato no soportado. Usa JPEG, PNG o WebP.';
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}