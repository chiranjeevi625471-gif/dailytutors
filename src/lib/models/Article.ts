/**
 * Canonical Article model.
 *
 * Previously this file registered a SECOND Mongoose schema under the model
 * name "Article", conflicting with the one in src/lib/models.ts. Because
 * `mongoose.models.Article || mongoose.model(...)` only keeps the first
 * registration, the two schemas silently fought each other and cron-created
 * articles failed validation. We now re-export the single source of truth.
 */
import { ArticleModel } from "@/lib/models";

export default ArticleModel;
