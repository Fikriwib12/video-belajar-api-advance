require("dotenv").config();
const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const kategoriKelasRoutes = require("./routes/kategoriKelasRoutes");
const kelasRoutes = require("./routes/kelasRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const modulKelasRoutes = require("./routes/modulKelasRoutes");
const materialRoutes = require("./routes/materialRoutes");
const pembayaranRoutes = require("./routes/pembayaranRoutes");
const kelasSayaRoutes = require("./routes/kelasSayaRoutes");
const kelasTutorRoutes = require("./routes/kelasTutorRoutes");
const pretestRoutes = require("./routes/pretestRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/kategori-kelas", kategoriKelasRoutes);
app.use("/api/kelas", kelasRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/modul-kelas", modulKelasRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/pembayaran", pembayaranRoutes);
app.use("/api/kelas-saya", kelasSayaRoutes);
app.use("/api/kelas-tutor", kelasTutorRoutes);
app.use("/api/pretest", pretestRoutes);
app.use("/api/review", reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`halo http://localhost:${PORT}`);
});
