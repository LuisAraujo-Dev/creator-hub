-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SocialLinks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "instagram" TEXT,
    "tiktok" TEXT,
    "youtube" TEXT,
    "twitter" TEXT,
    "strava" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "whatsapp" TEXT,
    "facebook" TEXT,
    "pinterest" TEXT,
    "telegram" TEXT,
    "discord" TEXT,
    "twitch" TEXT,
    "kwai" TEXT,
    "vsco" TEXT,
    "snapchat" TEXT,
    "onlyfans" TEXT,
    "showInsta" BOOLEAN NOT NULL DEFAULT false,
    "showTiktok" BOOLEAN NOT NULL DEFAULT false,
    "showYoutube" BOOLEAN NOT NULL DEFAULT false,
    "showTwitter" BOOLEAN NOT NULL DEFAULT false,
    "showStrava" BOOLEAN NOT NULL DEFAULT false,
    "showLinkedin" BOOLEAN NOT NULL DEFAULT false,
    "showGithub" BOOLEAN NOT NULL DEFAULT false,
    "showWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "showFacebook" BOOLEAN NOT NULL DEFAULT false,
    "showPinterest" BOOLEAN NOT NULL DEFAULT false,
    "showTelegram" BOOLEAN NOT NULL DEFAULT false,
    "showDiscord" BOOLEAN NOT NULL DEFAULT false,
    "showTwitch" BOOLEAN NOT NULL DEFAULT false,
    "showKwai" BOOLEAN NOT NULL DEFAULT false,
    "showVsco" BOOLEAN NOT NULL DEFAULT false,
    "showSnapchat" BOOLEAN NOT NULL DEFAULT false,
    "showOnlyfans" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SocialLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SocialLinks" ("github", "id", "instagram", "linkedin", "showGithub", "showInsta", "showLinkedin", "showStrava", "showTiktok", "showTwitter", "showWhatsapp", "showYoutube", "strava", "tiktok", "twitter", "userId", "whatsapp", "youtube") SELECT "github", "id", "instagram", "linkedin", "showGithub", "showInsta", "showLinkedin", "showStrava", "showTiktok", "showTwitter", "showWhatsapp", "showYoutube", "strava", "tiktok", "twitter", "userId", "whatsapp", "youtube" FROM "SocialLinks";
DROP TABLE "SocialLinks";
ALTER TABLE "new_SocialLinks" RENAME TO "SocialLinks";
CREATE UNIQUE INDEX "SocialLinks_userId_key" ON "SocialLinks"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
