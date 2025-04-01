import ImageKit from "imagekit";
import sharp from "sharp";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_PUBLIC_KEY!,
  privateKey: process.env.IMAGE_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGE_URL_ENDPOINT!,
});

export const uploadToImageKit = async (file: File, label: string) => {
  try {
    if (!file) {
      return {
        message: "No file provided",
      };
    }

    //check file size
    if (file.size > 5 * 1024 * 1024) {
      return {
        message: "File size exceeds 5Mb limit",
      };
    }

    //Read File Buffer
    const buffer = await file.arrayBuffer();
    const processImageBuffer = await sharp(Buffer.from(buffer))
      .webp({
        quality: 80,
        lossless: false,
        effort: 4,
      })
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const result = await imagekit.upload({
      file: processImageBuffer,
      fileName: `${label}_${Date.now()}_${file.name}`,
      folder: `/${label}`, // "/product"
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error("Error upload image : ", error);
    return {
      message: "Filed to upload image",
    };
  }
};
