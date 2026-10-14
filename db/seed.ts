/**
 * Database seed script
 * Run with: tsx db/seed.ts
 */

import { db } from "./index";
import { users, subscriptions, resumes } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clean up existing data (in development only!)
    if (process.env.NODE_ENV !== "production") {
      console.log("🧹 Cleaning up existing data...");
      await db.delete(resumes);
      await db.delete(subscriptions);
      await db.delete(users);
    }

    // Create a test user
    const [testUser] = await db
      .insert(users)
      .values({
        email: "test@example.com",
        name: "Test User",
      })
      .returning();

    console.log("✅ Created test user:", testUser.email);

    // Create subscription for test user
    await db.insert(subscriptions).values({
      userId: testUser.id,
      provider: "stripe",
      plan: "free",
      status: "active",
    });

    console.log("✅ Created free subscription");

    // Create sample resume
    const [sampleResume] = await db
      .insert(resumes)
      .values({
        userId: testUser.id,
        title: "My First Resume",
        templateId: "minimal",
        content: {
          basics: {
            fullName: "Test User",
            headline: "Full Stack Developer",
            email: "test@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            website: "https://example.com",
            links: [
              {
                label: "LinkedIn",
                url: "https://linkedin.com/in/testuser",
              },
              {
                label: "GitHub",
                url: "https://github.com/testuser",
              },
            ],
          },
          summary:
            "Passionate full-stack developer with 5 years of experience building scalable web applications.",
          sections: [
            {
              id: "exp-1",
              type: "experience" as const,
              title: "Experience",
              visible: true,
              items: [
                {
                  id: "exp-item-1",
                  company: "Tech Corp",
                  position: "Senior Developer",
                  location: "San Francisco, CA",
                  startDate: "2022-01",
                  current: true,
                  highlights: [
                    "Led development of microservices architecture",
                    "Improved application performance by 40%",
                    "Mentored 3 junior developers",
                  ],
                },
              ],
            },
            {
              id: "edu-1",
              type: "education" as const,
              title: "Education",
              visible: true,
              items: [
                {
                  id: "edu-item-1",
                  institution: "State University",
                  degree: "Bachelor of Science",
                  field: "Computer Science",
                  startDate: "2014",
                  endDate: "2018",
                  gpa: "3.8/4.0",
                },
              ],
            },
            {
              id: "skills-1",
              type: "skills" as const,
              title: "Skills",
              visible: true,
              items: [
                {
                  id: "skills-item-1",
                  category: "Programming Languages",
                  skills: ["JavaScript", "TypeScript", "Python", "Go"],
                },
                {
                  id: "skills-item-2",
                  category: "Frameworks & Tools",
                  skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker"],
                },
              ],
            },
          ],
        },
      })
      .returning();

    console.log("✅ Created sample resume:", sampleResume.title);

    console.log("\n🎉 Seeding complete!");
    console.log("\nTest credentials:");
    console.log("  Email: test@example.com");
    console.log("  User ID:", testUser.id);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
