// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改

// 照片接口
export interface Photo {
  url: string;      // 图片链接
  caption?: string; // 图片描述（可选）
}

// 相册接口
export interface Album {
  id: string;         // 相册唯一标识
  title: string;      // 相册标题
  description: string; // 相册描述
  cover: string;      // 相册封面图链接
  date: string;       // 日期（格式：YYYY-MM）
  photos: Photo[];    // 照片数组
}

// 相册数据
export const albums: Album[] = [
  {
    id: "晚霞",
    title: "晚霞",
    description: "去年随手拍的一些晚霞",
    cover: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163410_19_25.13mfra8fiw.webp",
    date: "2026-06-16",
    photos: [
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163410_19_25.13mfra8fiw.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163411_20_25.41ypusgp09.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163411_21_25.32imhmdxui.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163412_22_25.8dxj2c00ik.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163412_23_25.8vnkqx1e3h.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163408_17_25.7snvg15k7z.webp" },
      { url: "https://github.com/Jayvex/picx-images-hosting/raw/master/blog/风景/微信图片_20260616163409_18_25.3gp28hm8ps.webp" },
    ]
  },
];
