import express from "express";
import UserRouter from "./routes/user.routes.js";
import ProductRouter from "./routes/product.routes.js";
import BlogRouter from "./routes/blog.routes.js";
import CategoryRouter from "./routes/category.routes.js"
import BrandRouter from "./routes/brand.routes.js"
import CoupanRouter from "./routes/coupan.routes.js"
import BlogcategoryRouter from "./routes/blogcategory.routes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
// Routes
app.use("/api/user", UserRouter);
app.use("/api/products", ProductRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/category", CategoryRouter)
app.use("/api/brand", BrandRouter);
app.use("/api/coupans", CoupanRouter)
app.use("/api/blogcategory", BlogcategoryRouter)

// Error handling middleware
app.use(errorHandler);


export default app;
