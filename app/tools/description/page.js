const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Comprimir la imagen antes de convertirla a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar a máximo 1024px (suficiente para que la IA la vea bien)
        const maxSize = 1024;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a JPEG con calidad 80% (reduce mucho el tamaño)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setImage(compressedBase64);
        setImageBase64(compressedBase64);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
};