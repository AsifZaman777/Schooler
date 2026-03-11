import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db!;

  // Get all notices (including those wrongly set to "Employee" by the first migration)
  const notices = await db
    .collection("notices")
    .find({}, { projection: { _id: 1, createdBy: 1, createdByModel: 1 } })
    .toArray();

  let teacherCount = 0;
  let employeeCount = 0;
  let skipped = 0;

  for (const notice of notices) {
    if (!notice.createdBy) { skipped++; continue; }

    const createdById = new mongoose.Types.ObjectId(notice.createdBy);

    // Check if this ID exists in the teachers collection
    const teacher = await db
      .collection("teachers")
      .findOne({ _id: createdById }, { projection: { _id: 1 } });

    if (teacher) {
      await db.collection("notices").updateOne(
        { _id: notice._id },
        { $set: { createdByModel: "Teacher" } },
      );
      teacherCount++;
    } else {
      // Assume Employee (default)
      await db.collection("notices").updateOne(
        { _id: notice._id },
        { $set: { createdByModel: "Employee" } },
      );
      employeeCount++;
    }
  }

  console.log(`✅ Migration complete.`);
  console.log(`   Teacher notices: ${teacherCount}`);
  console.log(`   Employee notices: ${employeeCount}`);
  console.log(`   Skipped (no createdBy): ${skipped}`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
