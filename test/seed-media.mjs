import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleMediaAssets = [
  {
    name: "ket_test1_part10_listening.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    type: "AUDIO_MP3",
    mimeType: "audio/mpeg",
    sizeBytes: 8808038, // 8.4 MB
    partTag: "Part 10 (Listening 1)",
  },
  {
    name: "ket_test1_part11_dialogue_match.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    type: "AUDIO_MP3",
    mimeType: "audio/mpeg",
    sizeBytes: 6501171, // 6.2 MB
    partTag: "Part 11 (Listening 2)",
  },
  {
    name: "ket_test1_part12_conversations.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    type: "AUDIO_MP3",
    mimeType: "audio/mpeg",
    sizeBytes: 5452595, // 5.2 MB
    partTag: "Part 12 (Listening 3)",
  },
  {
    name: "notices_signs_ket_part1.png",
    url: "https://images.unsplash.com/photo-1572945550744-570423e892fa?w=800&auto=format&fit=crop&q=80",
    type: "IMAGE",
    mimeType: "image/png",
    sizeBytes: 1258291, // 1.2 MB
    partTag: "Part 1 (Biển báo & Thông báo)",
  },
  {
    name: "scan_reading_passage_part4.png",
    url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
    type: "IMAGE",
    mimeType: "image/png",
    sizeBytes: 2411724, // 2.3 MB
    partTag: "Part 4 (Đoạn văn bài đọc)",
  },
  {
    name: "form_note_fill_part8.png",
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
    type: "IMAGE",
    mimeType: "image/png",
    sizeBytes: 1887436, // 1.8 MB
    partTag: "Part 8 (Biểu mẫu đề thi)",
  },
  {
    name: "cam_nang_chuan_dau_ra_ket_2026.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    type: "DOCUMENT_PDF",
    mimeType: "application/pdf",
    sizeBytes: 3670016, // 3.5 MB
    partTag: "Cẩm nang & Hướng dẫn sinh viên",
  },
];

async function main() {
  console.log("Đang kiểm tra bảng MediaAsset...");
  const count = await prisma.mediaAsset.count();
  console.log(`Số tài nguyên hiện tại: ${count}`);

  if (count === 0) {
    console.log("Bảng MediaAsset trống. Bắt đầu seed media mẫu...");
    for (const asset of sampleMediaAssets) {
      await prisma.mediaAsset.create({
        data: asset,
      });
      console.log(`+ Đã tạo media asset: ${asset.name}`);
    }
    console.log("Seed MediaAsset hoàn tất!");
  } else {
    console.log("Bảng MediaAsset đã có dữ liệu, bỏ qua seed.");
  }
}

main()
  .catch((e) => {
    console.error("Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
