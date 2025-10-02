import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import * as fal from "@fal-ai/serverless-client";
import { Blob } from "buffer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS düzeltmesi - ngrok için özel ayar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FAL_KEY kontrolü
if (!process.env.FAL_KEY) {
  console.error("❌ FAL_KEY bulunamadı! .env dosyasını kontrol edin.");
  process.exit(1);
}

console.log("✅ FAL_KEY yüklendi:", process.env.FAL_KEY.substring(0, 10) + "...");

// Fal.ai client'ı yapılandır
fal.config({
  credentials: process.env.FAL_KEY,
});

// Upload klasörü
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Uploads klasörü oluşturuldu");
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || ".m4a";
    const name = `rec_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /m4a|mp3|wav|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    }
    cb(new Error("Sadece ses dosyaları yüklenebilir!"));
  },
});

// Statik servis
app.use("/uploads", express.static(uploadDir));

// Upload endpoint
app.post("/api/upload", upload.single("audio"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya bulunamadı" });
    }

    console.log("📤 Dosya yüklendi:", req.file.filename);

    const baseUrl = process.env.NGROK_URL || `${req.protocol}://${req.get("host")}`;
    const publicUrl = `${baseUrl}/uploads/${req.file.filename}`;

    console.log("🔗 Public URL:", publicUrl);

    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error("❌ Upload hatası:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fal.ai STT endpoint
app.post("/api/stt", async (req, res) => {
  try {
    const { audio_url } = req.body;

    if (!audio_url) {
      return res.status(400).json({ error: "audio_url gerekli" });
    }

    console.log("🎤 STT başlatılıyor...");
    console.log("🔗 Audio URL:", audio_url);

    let falAudioUrl = audio_url;

    if (audio_url.includes('localhost') || audio_url.includes('ngrok')) {
      console.log("📦 Local dosya tespit edildi, Fal.ai'a yükleniyor...");

      const filename = path.basename(new URL(audio_url).pathname);
      const filePath = path.join(uploadDir, filename);

      console.log("📍 Dosya yolu:", filePath);

      if (!fs.existsSync(filePath)) {
        throw new Error("Dosya bulunamadı: " + filePath);
      }

      const fileBuffer = fs.readFileSync(filePath);
      const fileBlob = new Blob([fileBuffer], { type: 'audio/m4a' });

      console.log("☁️ Fal.ai storage'a yükleniyor...");
      falAudioUrl = await fal.storage.upload(fileBlob);
      console.log("✅ Fal.ai URL:", falAudioUrl);
    }

    const result = await fal.subscribe("fal-ai/whisper", {
      input: {
        audio_url: falAudioUrl,
        task: "transcribe",
        language: null,
        chunk_level: "segment",
        version: "3",
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("📊 Queue update:", update.status);
      },
    });

    console.log("✅ STT tamamlandı");

    res.json({
      success: true,
      text: result.text,
      chunks: result.chunks,
      output: result,
    });
  } catch (error) {
    console.error("❌ STT hatası:", error);
    res.status(500).json({
      error: error.message,
      details: error.body || error.response?.data,
    });
  }
});

// Fal.ai Görsel oluşturma endpoint (DÜZELTİLDİ)
app.post("/api/generate-image", async (req, res) => {
  console.log("🎨 /api/generate-image endpoint'e istek geldi");
  console.log("📦 Request body:", req.body);
  
  try {
    const { prompt, isPremium = false } = req.body;

    if (!prompt) {
      console.log("❌ Prompt eksik!");
      return res.status(400).json({ error: "prompt gerekli" });
    }

    console.log("🎨 Görsel oluşturma başlıyor...");
    console.log("📝 Prompt:", prompt);
    console.log("💎 Premium:", isPremium);

    const modelName = isPremium ? "fal-ai/flux/dev" : "fal-ai/flux/schnell";
    console.log("🤖 Kullanılan model:", modelName);

    const result = await fal.subscribe(modelName, {
      input: {
        prompt: prompt,
        image_size: isPremium ? "landscape_16_9" : "square",
        num_inference_steps: isPremium ? 28 : 4,
        num_images: 1,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("📊 Queue update:", update.status);
      },
    });

    console.log("✅ Fal.ai yanıtı:", JSON.stringify(result, null, 2));

    const imageUrl =
      result.images?.[0]?.url ||
      result.data?.images?.[0]?.url ||
      result.image?.url ||
      result.url;

    console.log("🖼️ Bulunan image URL:", imageUrl);

    if (!imageUrl) {
      console.error("❌ Image URL bulunamadı!");
      return res.status(500).json({
        error: "Görsel URL'si alınamadı",
        debug: result
      });
    }

    console.log("✅ Başarılı yanıt gönderiliyor");
    return res.status(200).json({
      success: true,
      imageUrl,
      model: modelName,
      isPremium,
    });

  } catch (error) {
    console.error("❌ Görsel oluşturma hatası:");
    console.error("Hata mesajı:", error.message);
    console.error("Stack:", error.stack);

    return res.status(500).json({
      error: error.message,
      details: error.body || "Detay yok",
    });
  }
});

// Video oluşturma endpoint (DÜZELTİLDİ)
app.post("/api/generate-video", async (req, res) => {
  console.log("🎬 /api/generate-video endpoint'e istek geldi");
  console.log("📦 Request body:", req.body);
  
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.log("❌ Prompt eksik!");
      return res.status(400).json({ error: "prompt gerekli" });
    }

    console.log("🎬 Video oluşturma başlıyor...");
    console.log("📝 Prompt:", prompt);

    const result = await fal.subscribe("fal-ai/pixverse/v5/text-to-video", {
      input: {
        prompt: prompt,
        duration: 5,
        resolution: "720p",
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log("📊 Queue update:", update.status);
      },
    });

    console.log("✅ Video sonucu:", JSON.stringify(result, null, 2));

    const videoUrl =
      result.video?.url ||
      result.data?.video?.url ||
      result.output?.[0]?.url ||
      result.url;

    if (!videoUrl) {
      console.error("❌ Video URL bulunamadı!");
      return res.status(500).json({ 
        error: "Video URL alınamadı", 
        debug: result 
      });
    }

    console.log("✅ Başarılı yanıt gönderiliyor");
    return res.status(200).json({
      success: true,
      videoUrl,
      model: "fal-ai/pixverse/v5/text-to-video",
    });
    
  } catch (error) {
    console.error("❌ Video oluşturma hatası:", error.message);
    console.error("Stack:", error.stack);
    
    return res.status(500).json({
      error: error.message,
      details: error.body || "Detay yok",
    });
  }
});

// Test endpoint
app.get("/api/test", async (req, res) => {
  try {
    const testUrl = req.query.url;
    if (!testUrl) {
      return res.status(400).json({ error: "URL parametresi gerekli" });
    }

    console.log("🧪 Test STT için URL:", testUrl);

    res.json({
      message: "STT için /api/stt endpoint'ini kullanın",
      testUrl,
      payload: { audio_url: testUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/", (_, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: {
      FAL_KEY: process.env.FAL_KEY ? "✅ Ayarlı" : "❌ Eksik",
      NGROK_URL: process.env.NGROK_URL || "Otomatik",
    },
    endpoints: {
      upload: "POST /api/upload",
      stt: "POST /api/stt",
      generateImage: "POST /api/generate-image",
      generateVideo: "POST /api/generate-video",
      test: "GET /api/test?url=YOUR_URL",
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err);
  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
🚀 Backend başlatıldı!
📍 Port: ${PORT}
🔗 Local: http://localhost:${PORT}
🌐 Ngrok: ${process.env.NGROK_URL || "Henüz ayarlanmadı"}
✅ Fal.ai client hazır
  `);
});