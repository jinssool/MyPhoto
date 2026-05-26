import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync, inflateSync } from "node:zlib";

const WIDTH = 1200;
const HEIGHT = 800;
const root = process.cwd();
const privateAssetsDir = join(root, "private-assets");
const logoPath = join(privateAssetsDir, "arsenal-logo.png");
const outputRoot = join(root, "test-assets/private-generated/arsenal-2025-2026");
const imagesDir = join(outputRoot, "images");
const manifestPath = join(outputRoot, "manifest.json");
const readmePath = join(outputRoot, "README.md");
const logoImage = loadOptionalLogo();
const logoImageIds = new Set([1, 5, 9, 16, 22, 30, 36, 40, 50]);

const red = { r: 196, g: 18, b: 48, a: 255 };
const deepRed = { r: 122, g: 8, b: 28, a: 255 };
const white = { r: 250, g: 249, b: 245, a: 255 };
const gold = { r: 238, g: 190, b: 78, a: 255 };
const navy = { r: 18, g: 28, b: 44, a: 255 };
const green = { r: 39, g: 136, b: 72, a: 255 };
const darkGreen = { r: 21, g: 86, b: 47, a: 255 };

const specs = [
  entry(1, "stadium_confetti", "Arsenal Stadium Confetti", "Red and white confetti over a championship stadium celebration.", "2026-05-24T18:30:00Z", "Championship Celebration", "Emirates-style stadium", ["stadium", "confetti", "fans"]),
  entry(2, "family_watch_party", "Arsenal Family Watch Party", "A family living room watch party in red and white colors.", "2026-05-24T19:00:00Z", "Family Watch Party", "Home living room", ["family", "watch party", "scarves"]),
  entry(3, "trophy_lift", "Arsenal Trophy Lift", "A gold trophy lift scene with red and white celebration lights.", "2026-05-24T19:30:00Z", "Trophy Lift", "Football pitch", ["trophy", "pitch", "celebration"]),
  entry(4, "parade_red_bus", "Arsenal Parade Red Bus", "A parade-style red bus rolling through a crowd of cheering supporters.", "2026-05-25T12:00:00Z", "Victory Parade", "North London street", ["parade", "bus", "fans"]),
  entry(5, "scarf_wall", "Arsenal Scarf Wall", "Rows of supporters raising red and white scarves.", "2026-05-25T13:00:00Z", "Supporter Celebration", "Stadium stand", ["scarves", "crowd", "red white"]),
  entry(6, "pitch_fireworks", "Arsenal Pitch Fireworks", "Fireworks over the football pitch after the final whistle.", "2026-05-25T21:00:00Z", "Pitch Celebration", "Football pitch", ["fireworks", "pitch", "night"]),
  entry(7, "red_white_crowd", "Arsenal Red White Crowd", "A dense crowd celebration in red and white.", "2026-05-26T15:00:00Z", "Supporter Celebration", "Stadium concourse", ["fans", "crowd", "confetti"]),
  entry(8, "north_london_night", "Arsenal North London Night", "A night celebration with lights, banners, and red smoke.", "2026-05-26T21:00:00Z", "City Celebration", "North London", ["night", "banners", "red smoke"]),
  entry(9, "champions_tifo", "Arsenal Champions Tifo", "A giant champions tifo across a red and white stand.", "2026-05-27T17:00:00Z", "Champions Tifo", "Stadium stand", ["tifo", "stadium", "champions"]),
  entry(10, "victory_lap", "Arsenal Victory Lap", "A stylized victory lap around the pitch with flags and confetti.", "2026-05-27T18:00:00Z", "Victory Lap", "Football pitch", ["victory lap", "flags", "pitch"]),
  entry(11, "living_room_goal", "Arsenal Living Room Goal", "A family jumps from the sofa as a goal goes in on TV.", "2026-05-28T19:45:00Z", "Watch Party", "Home living room", ["family", "goal", "watch party"]),
  entry(12, "away_day_train", "Arsenal Away Day Train", "Supporters in red and white scarves on an away-day train platform.", "2026-05-29T10:00:00Z", "Away Day", "Train platform", ["away day", "scarves", "travel"]),
  entry(13, "highbury_memories", "Arsenal Highbury Memories", "A nostalgic red and white memory wall for older supporters.", "2026-05-29T14:00:00Z", "Family Memories", "Memory wall", ["nostalgia", "family", "history"]),
  entry(14, "emirates_sunset", "Arsenal Emirates Sunset", "A warm sunset celebration outside a stadium silhouette.", "2026-05-29T20:15:00Z", "Stadium Sunset", "Stadium exterior", ["sunset", "stadium", "banners"]),
  entry(15, "fan_flags", "Arsenal Fan Flags", "Big red and white flags waving above supporters.", "2026-05-30T13:30:00Z", "Flag Celebration", "Supporter square", ["flags", "fans", "celebration"]),
  entry(16, "trophy_closeup", "Arsenal Trophy Closeup", "Close-up championship trophy graphic with red ribbons.", "2026-05-30T16:00:00Z", "Trophy Moment", "Celebration table", ["trophy", "ribbons", "gold"]),
  entry(17, "kids_kickabout", "Arsenal Kids Kickabout", "Children playing football under red and white bunting.", "2026-05-30T17:30:00Z", "Family Kickabout", "Neighborhood pitch", ["kids", "family", "football"]),
  entry(18, "confetti_rain", "Arsenal Confetti Rain", "Confetti raining over red and white celebratory graphics.", "2026-05-30T19:00:00Z", "Confetti Moment", "Celebration graphic", ["confetti", "graphics", "champions"]),
  entry(19, "pub_watch_party", "Arsenal Pub Watch Party", "Supporters watching the decisive match together.", "2026-05-31T18:00:00Z", "Watch Party", "Family-friendly pub", ["watch party", "fans", "scarves"]),
  entry(20, "matchday_queue", "Arsenal Matchday Queue", "Fans queueing on a sunny matchday with banners and flags.", "2026-05-31T13:00:00Z", "Matchday", "Stadium approach", ["matchday", "fans", "banners"]),
  entry(21, "supporters_march", "Arsenal Supporters March", "A parade of supporters marching with red and white flags.", "2026-06-01T12:30:00Z", "Supporters March", "City street", ["march", "flags", "fans"]),
  entry(22, "final_whistle", "Arsenal Final Whistle", "A final-whistle celebration with arms raised across the stand.", "2026-06-01T17:00:00Z", "Final Whistle", "Football pitch", ["final whistle", "crowd", "pitch"]),
  entry(23, "dressing_room_graphic", "Arsenal Dressing Room Graphic", "A stylized post-match board with scarves and red shirts.", "2026-06-01T19:00:00Z", "Post Match", "Dressing room", ["graphic", "shirts", "scarves"]),
  entry(24, "red_sky_celebration", "Arsenal Red Sky Celebration", "Red sky, white streamers, and fans under stadium lights.", "2026-06-02T20:30:00Z", "Night Celebration", "Stadium exterior", ["red sky", "streamers", "night"]),
  entry(25, "balcony_flags", "Arsenal Balcony Flags", "Red and white flags hanging from a family balcony.", "2026-06-02T11:00:00Z", "Home Celebration", "Family balcony", ["home", "flags", "family"]),
  entry(26, "family_scarves", "Arsenal Family Scarves", "A family holding red and white scarves for a group photo.", "2026-06-02T15:00:00Z", "Family Photo", "Home", ["family", "scarves", "group photo"]),
  entry(27, "pitch_champions", "Arsenal Pitch Champions", "A champions graphic painted across a green football pitch.", "2026-06-02T18:00:00Z", "Pitch Champions", "Football pitch", ["pitch", "champions", "graphics"]),
  entry(28, "stadium_lights", "Arsenal Stadium Lights", "Floodlights shining on a red and white night crowd.", "2026-06-02T21:15:00Z", "Stadium Night", "Stadium stand", ["lights", "stadium", "night"]),
  entry(29, "red_smoke", "Arsenal Red Smoke", "Safe stylized red smoke and celebration banners.", "2026-06-03T18:30:00Z", "Street Celebration", "Supporter square", ["red smoke", "banners", "fans"]),
  entry(30, "trophy_parade", "Arsenal Trophy Parade", "A trophy parade scene with streamers and red bus details.", "2026-06-03T13:00:00Z", "Trophy Parade", "Parade route", ["trophy", "parade", "bus"]),
  entry(31, "corner_flag_party", "Arsenal Corner Flag Party", "A corner-flag celebration on a green pitch with confetti.", "2026-06-03T16:00:00Z", "Pitch Party", "Football pitch", ["corner flag", "confetti", "pitch"]),
  entry(32, "victory_banner", "Arsenal Victory Banner", "A large red victory banner in front of a cheering stand.", "2026-06-03T17:00:00Z", "Victory Banner", "Stadium stand", ["banner", "fans", "victory"]),
  entry(33, "night_bus_celebration", "Arsenal Night Bus Celebration", "A night bus parade with gold lights and red-white flags.", "2026-06-03T21:00:00Z", "Night Parade", "City street", ["bus", "night", "flags"]),
  entry(34, "crowd_wave", "Arsenal Crowd Wave", "Supporters creating a red and white wave around the stand.", "2026-06-04T15:00:00Z", "Crowd Wave", "Stadium stand", ["crowd", "wave", "red white"]),
  entry(35, "players_silhouette", "Arsenal Players Silhouette", "Player silhouettes celebrating in front of red and white lights.", "2026-06-04T19:00:00Z", "Pitch Celebration", "Football pitch", ["silhouette", "players", "celebration"]),
  entry(36, "champions_wallpaper", "Arsenal Champions Wallpaper", "A clean red and white champions poster-style graphic.", "2026-06-04T20:00:00Z", "Poster Graphic", "Digital poster", ["poster", "champions", "graphics"]),
  entry(37, "group_photo_style", "Arsenal Group Photo Style", "A family-friendly group photo scene after the celebration.", "2026-06-05T12:00:00Z", "Family Group Photo", "Home street", ["family", "group photo", "scarves"]),
  entry(38, "red_white_mosaic", "Arsenal Red White Mosaic", "A red and white fan mosaic filling the stand.", "2026-06-05T16:00:00Z", "Fan Mosaic", "Stadium stand", ["mosaic", "fans", "stadium"]),
  entry(39, "celebration_poster", "Arsenal Celebration Poster", "Poster-style celebration with confetti, ribbons, and bold type.", "2026-06-05T18:00:00Z", "Poster Graphic", "Digital poster", ["poster", "confetti", "ribbons"]),
  entry(40, "trophy_table", "Arsenal Trophy Table", "A trophy on a table with scarves, flags, and family snacks.", "2026-06-05T19:30:00Z", "Family Celebration", "Home table", ["trophy", "family", "scarves"]),
  entry(41, "garden_watch_party", "Arsenal Garden Watch Party", "A garden watch party with string lights and red-white bunting.", "2026-06-06T19:00:00Z", "Garden Watch Party", "Family garden", ["garden", "watch party", "family"]),
  entry(42, "street_flags", "Arsenal Street Flags", "A street full of red and white flags after the title win.", "2026-06-06T15:30:00Z", "Street Celebration", "Neighborhood street", ["street", "flags", "banners"]),
  entry(43, "stadium_roofline", "Arsenal Stadium Roofline", "A stadium roofline silhouette with red and white celebration lights.", "2026-06-06T21:00:00Z", "Stadium Night", "Stadium exterior", ["stadium", "lights", "night"]),
  entry(44, "away_fans_confetti", "Arsenal Away Fans Confetti", "Away supporters celebrating with compact red and white confetti.", "2026-06-07T17:00:00Z", "Away Celebration", "Away stand", ["away fans", "confetti", "scarves"]),
  entry(45, "sunday_family_match", "Arsenal Sunday Family Match", "A family football kickabout in red and white after the celebration.", "2026-06-07T10:30:00Z", "Family Match", "Local pitch", ["family", "football", "pitch"]),
  entry(46, "celebration_collage", "Arsenal Celebration Collage", "A collage of scarves, tickets, flags, and confetti.", "2026-06-07T12:00:00Z", "Memory Collage", "Digital collage", ["collage", "scarves", "flags"]),
  entry(47, "red_white_fireworks", "Arsenal Red White Fireworks", "Red and white fireworks above a celebratory skyline.", "2026-06-07T22:00:00Z", "Fireworks", "City skyline", ["fireworks", "night", "red white"]),
  entry(48, "final_day_scoreboard", "Arsenal Final Day Scoreboard", "A celebratory final-day scoreboard graphic without real scores.", "2026-06-08T18:00:00Z", "Final Day", "Stadium screen", ["scoreboard", "champions", "graphics"]),
  entry(49, "family_trophy_pose", "Arsenal Family Trophy Pose", "A family posing with a symbolic gold trophy and scarves.", "2026-06-08T19:00:00Z", "Family Trophy Pose", "Home", ["family", "trophy", "scarves"]),
  entry(50, "champions_banner", "Arsenal Champions Banner", "A red and white champions banner for the private test album.", "2026-06-08T20:00:00Z", "Champions Banner", "Digital banner", ["banner", "champions", "graphics"])
];

function main() {
  mkdirSync(privateAssetsDir, { recursive: true });
  rmSync(imagesDir, { recursive: true, force: true });
  mkdirSync(imagesDir, { recursive: true });

  const manifestEntries = specs.map((spec) => {
    const logoUsed = Boolean(logoImage && logoImageIds.has(spec.number));
    const canvas = createCanvas(WIDTH, HEIGHT);
    renderScene(canvas, spec, logoUsed);
    const png = encodePng(canvas.width, canvas.height, canvas.data);
    writeFileSync(join(imagesDir, spec.filename), png);

    return {
      id: spec.id,
      filename: spec.filename,
      title: spec.title,
      description: spec.description,
      syntheticDate: spec.syntheticDate,
      eventName: spec.eventName,
      placeName: spec.placeName,
      tags: spec.tags,
      intendedAlbum: "Private Arsenal 2025-2026 Drive import test",
      logoUsed
    };
  });

  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        generatedBy: "scripts/generate-private-arsenal-test-images.mjs",
        imageCount: manifestEntries.length,
        theme: "2025-2026 Arsenal championship celebration",
        outputDirectory: "test-assets/private-generated/arsenal-2025-2026/images",
        logoSource: existsSync(logoPath) ? "private-assets/arsenal-logo.png" : null,
        officialLogoDownloadedAutomatically: false,
        entries: manifestEntries
      },
      null,
      2
    )}\n`
  );

  writeFileSync(readmePath, createGeneratedReadme(Boolean(logoImage)));

  console.log(`Generated ${manifestEntries.length} private test images.`);
  console.log(`Images: ${imagesDir}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Logo overlay used: ${logoImage ? "yes" : "no"}`);
}

function entry(number, slug, title, description, syntheticDate, eventName, placeName, tags) {
  const padded = String(number).padStart(3, "0");

  return {
    number,
    id: `arsenal-private-2025-2026-${padded}`,
    slug,
    filename: `arsenal_private_2025_2026_${padded}_${slug}.png`,
    title,
    description,
    syntheticDate,
    eventName,
    placeName,
    tags
  };
}

function createGeneratedReadme(logoLoaded) {
  return `# Arsenal 2025-2026 Private Test Images

These are private local test assets for the real Google Drive metadata import flow.

- The images are generated under \`test-assets/private-generated/arsenal-2025-2026/images/\`.
- This directory is ignored by git and should stay local-only.
- If \`private-assets/arsenal-logo.png\` exists, it is user-provided and may be overlaid on a small subset of generated images.
- The script never downloads official logo assets.
- The official logo file is ignored by git and must not be committed.
- Generated logo-bearing images should not be committed to a public repository.
- Upload these generated images manually to a private Google Drive folder.
- Use \`/admin/import\` to preview and register the folder metadata.
- The app registers metadata only; Google Drive originals are not deleted, moved, renamed, or modified.

Logo overlay used for this generation: ${logoLoaded ? "yes" : "no"}.
`;
}

function renderScene(canvas, spec, logoUsed) {
  const rng = createRng(spec.number * 97531);
  drawBackground(canvas, rng);
  drawSceneBase(canvas, spec, rng);
  drawSceneDetails(canvas, spec, rng);
  drawChampionshipBanner(canvas, spec);
  drawConfetti(canvas, rng, 260 + (spec.number % 5) * 25);

  if (logoUsed && logoImage) {
    drawLogoBadge(canvas, logoImage, WIDTH - 148, 34, 112);
  }
}

function drawBackground(canvas, rng) {
  for (let y = 0; y < canvas.height; y += 1) {
    const t = y / (canvas.height - 1);
    const top = mixColor(navy, deepRed, 0.35 + 0.25 * rng());
    const bottom = mixColor(red, { r: 38, g: 24, b: 40, a: 255 }, 0.35);
    const color = mixColor(top, bottom, t);
    drawLine(canvas, 0, y, canvas.width, y, 1, color);
  }
}

function drawSceneBase(canvas, spec, rng) {
  const scene = spec.slug;

  if (scene.includes("living_room") || scene.includes("watch_party") || scene.includes("family") || scene.includes("home") || scene.includes("garden") || scene.includes("trophy_table")) {
    drawRoomScene(canvas, rng);
  } else if (scene.includes("parade") || scene.includes("bus") || scene.includes("street") || scene.includes("march") || scene.includes("balcony")) {
    drawStreetScene(canvas, rng);
  } else if (scene.includes("poster") || scene.includes("wallpaper") || scene.includes("collage") || scene.includes("banner") || scene.includes("graphic") || scene.includes("mosaic")) {
    drawGraphicScene(canvas, rng);
  } else {
    drawStadiumScene(canvas, rng);
  }
}

function drawSceneDetails(canvas, spec, rng) {
  const slug = spec.slug;

  if (slug.includes("trophy")) drawTrophy(canvas, 570, 315, 1.35);
  if (slug.includes("bus") || slug.includes("parade")) drawBus(canvas, 250, 440, 640, 160);
  if (slug.includes("scarf") || slug.includes("scarves")) drawScarf(canvas, 180, 535, 840, 72, "ARSENAL");
  if (slug.includes("fireworks") || slug.includes("night")) drawFireworks(canvas, rng);
  if (slug.includes("scoreboard")) drawScoreboard(canvas, 330, 210, 540, 240);
  if (slug.includes("kids") || slug.includes("kickabout") || slug.includes("match")) drawFootball(canvas, 720, 575, 42);
  if (slug.includes("pitch") || slug.includes("corner_flag")) drawCornerFlag(canvas, 885, 445);
  if (slug.includes("mosaic")) drawMosaic(canvas, rng);
  if (slug.includes("group_photo") || slug.includes("family_trophy_pose")) drawFamilyGroup(canvas, rng);

  drawCrowd(canvas, rng, 48 + (spec.number % 8) * 4);
}

function drawChampionshipBanner(canvas, spec) {
  const subtitle = spec.number % 3 === 0 ? "2025-2026" : "PRIVATE TEST";
  drawRect(canvas, 150, 66, 900, 112, { r: 255, g: 255, b: 255, a: 220 });
  drawRect(canvas, 162, 78, 876, 88, { r: 191, g: 18, b: 46, a: 245 });
  drawText(canvas, "ARSENAL", 600, 94, 8, white, "center");
  drawText(canvas, "CHAMPIONS", 600, 136, 6, gold, "center");
  drawText(canvas, subtitle, 600, 185, 3, white, "center");
}

function drawStadiumScene(canvas, rng) {
  drawRect(canvas, 0, 430, WIDTH, 370, green);
  drawRect(canvas, 0, 585, WIDTH, 215, darkGreen);
  drawLine(canvas, 90, 590, 1110, 590, 4, white);
  drawLine(canvas, 240, 430, 130, 800, 3, { r: 235, g: 240, b: 230, a: 180 });
  drawLine(canvas, 960, 430, 1070, 800, 3, { r: 235, g: 240, b: 230, a: 180 });
  drawRect(canvas, 0, 230, WIDTH, 185, { r: 70, g: 24, b: 34, a: 255 });
  for (let x = 0; x < WIDTH; x += 28) {
    drawRect(canvas, x, 252 + Math.floor(rng() * 50), 20, 38 + Math.floor(rng() * 50), rng() > 0.5 ? red : white);
  }
  drawLine(canvas, 0, 420, WIDTH, 420, 10, white);
  drawLine(canvas, 120, 220, 260, 80, 8, { r: 230, g: 230, b: 220, a: 210 });
  drawLine(canvas, 1080, 220, 940, 80, 8, { r: 230, g: 230, b: 220, a: 210 });
}

function drawRoomScene(canvas, rng) {
  drawRect(canvas, 0, 360, WIDTH, 440, { r: 84, g: 37, b: 44, a: 255 });
  drawRect(canvas, 0, 500, WIDTH, 300, { r: 126, g: 64, b: 54, a: 255 });
  drawRect(canvas, 390, 215, 420, 230, navy);
  drawRect(canvas, 416, 240, 368, 180, green);
  drawLine(canvas, 416, 330, 784, 330, 2, white);
  drawRect(canvas, 250, 520, 700, 130, deepRed);
  drawRect(canvas, 305, 474, 160, 90, red);
  drawRect(canvas, 735, 474, 160, 90, red);
  drawScarf(canvas, 300, 675, 600, 46, "COYG");
  drawFamilyGroup(canvas, rng);
}

function drawStreetScene(canvas, rng) {
  drawRect(canvas, 0, 475, WIDTH, 325, { r: 62, g: 65, b: 72, a: 255 });
  drawRect(canvas, 0, 650, WIDTH, 50, { r: 42, g: 43, b: 50, a: 255 });
  for (let x = 60; x < WIDTH; x += 160) {
    drawRect(canvas, x, 230, 82, 250, { r: 96, g: 70, b: 75, a: 255 });
    drawRect(canvas, x + 13, 260, 56, 42, rng() > 0.5 ? white : red);
  }
  drawLine(canvas, 0, 560, WIDTH, 560, 5, white);
  drawFlags(canvas, rng);
}

function drawGraphicScene(canvas, rng) {
  drawRect(canvas, 125, 220, 950, 410, { r: 248, g: 244, b: 236, a: 235 });
  drawRect(canvas, 160, 255, 880, 340, { r: 181, g: 10, b: 39, a: 235 });
  for (let i = 0; i < 8; i += 1) {
    drawCircle(canvas, 235 + i * 105, 420 + Math.sin(i) * 70, 48, i % 2 ? white : gold);
  }
  drawText(canvas, "2025-2026", 600, 360, 6, white, "center");
  drawText(canvas, "CHAMPIONS", 600, 450, 8, gold, "center");
  drawFlags(canvas, rng);
}

function drawCrowd(canvas, rng, count) {
  for (let i = 0; i < count; i += 1) {
    const x = 50 + rng() * (WIDTH - 100);
    const y = 500 + rng() * 210;
    const body = rng() > 0.55 ? red : white;
    drawCircle(canvas, x, y - 22, 13, { r: 235, g: 187, b: 145, a: 255 });
    drawRect(canvas, x - 16, y - 8, 32, 50, body);
    if (rng() > 0.55) {
      drawLine(canvas, x - 18, y + 4, x - 48, y - 28, 5, body);
      drawLine(canvas, x + 18, y + 4, x + 48, y - 28, 5, body);
    }
  }
}

function drawFamilyGroup(canvas, rng) {
  const baseX = 385 + rng() * 60;
  const baseY = 570;
  const colors = [red, white, red, { r: 235, g: 60, b: 82, a: 255 }, white];
  for (let i = 0; i < 5; i += 1) {
    const x = baseX + i * 88;
    const h = i % 2 === 0 ? 92 : 112;
    drawCircle(canvas, x, baseY - h, 18, { r: 232, g: 184, b: 139, a: 255 });
    drawRect(canvas, x - 22, baseY - h + 20, 44, h, colors[i]);
  }
}

function drawTrophy(canvas, cx, cy, scale) {
  drawRect(canvas, cx - 55 * scale, cy + 110 * scale, 110 * scale, 26 * scale, gold);
  drawRect(canvas, cx - 28 * scale, cy + 50 * scale, 56 * scale, 72 * scale, gold);
  drawCircle(canvas, cx, cy, 70 * scale, { r: 244, g: 203, b: 94, a: 255 });
  drawRect(canvas, cx - 60 * scale, cy - 70 * scale, 120 * scale, 95 * scale, gold);
  drawCircle(canvas, cx - 82 * scale, cy - 20 * scale, 42 * scale, { r: 244, g: 203, b: 94, a: 255 });
  drawCircle(canvas, cx + 82 * scale, cy - 20 * scale, 42 * scale, { r: 244, g: 203, b: 94, a: 255 });
  drawCircle(canvas, cx - 82 * scale, cy - 20 * scale, 24 * scale, { r: 120, g: 31, b: 41, a: 255 });
  drawCircle(canvas, cx + 82 * scale, cy - 20 * scale, 24 * scale, { r: 120, g: 31, b: 41, a: 255 });
  drawLine(canvas, cx - 68 * scale, cy - 52 * scale, cx - 18 * scale, cy + 25 * scale, 7 * scale, red);
  drawLine(canvas, cx + 68 * scale, cy - 52 * scale, cx + 18 * scale, cy + 25 * scale, 7 * scale, red);
}

function drawBus(canvas, x, y, w, h) {
  drawRect(canvas, x, y, w, h, red);
  drawRect(canvas, x + 35, y + 35, w - 70, 56, white);
  drawRect(canvas, x + 80, y - 55, w - 160, 60, red);
  drawText(canvas, "CHAMPIONS", x + w / 2, y + 104, 5, white, "center");
  drawCircle(canvas, x + 120, y + h, 42, navy);
  drawCircle(canvas, x + w - 120, y + h, 42, navy);
  drawCircle(canvas, x + 120, y + h, 20, white);
  drawCircle(canvas, x + w - 120, y + h, 20, white);
}

function drawScarf(canvas, x, y, w, h, text) {
  drawRect(canvas, x, y, w, h, red);
  drawRect(canvas, x, y, 80, h, white);
  drawRect(canvas, x + w - 80, y, 80, h, white);
  for (let i = 0; i < 8; i += 1) {
    drawRect(canvas, x + 100 + i * 70, y, 34, h, i % 2 ? white : deepRed);
  }
  drawText(canvas, text, x + w / 2, y + h / 2 - 17, Math.max(4, Math.floor(h / 12)), white, "center");
}

function drawFireworks(canvas, rng) {
  for (let i = 0; i < 9; i += 1) {
    const cx = 120 + rng() * 960;
    const cy = 110 + rng() * 230;
    const color = i % 3 === 0 ? gold : i % 3 === 1 ? white : red;
    for (let j = 0; j < 18; j += 1) {
      const angle = (Math.PI * 2 * j) / 18;
      drawLine(canvas, cx, cy, cx + Math.cos(angle) * 70, cy + Math.sin(angle) * 70, 3, color);
    }
  }
}

function drawFlags(canvas, rng) {
  for (let i = 0; i < 9; i += 1) {
    const x = 80 + i * 130;
    const y = 260 + rng() * 120;
    drawLine(canvas, x, y, x, y + 155, 5, white);
    drawRect(canvas, x + 4, y + 8, 82, 50, i % 2 ? red : white);
    if (i % 2) drawText(canvas, "A", x + 45, y + 20, 3, white, "center");
  }
}

function drawScoreboard(canvas, x, y, w, h) {
  drawRect(canvas, x, y, w, h, navy);
  drawRect(canvas, x + 18, y + 18, w - 36, h - 36, { r: 20, g: 95, b: 60, a: 255 });
  drawText(canvas, "FINAL DAY", x + w / 2, y + 54, 5, white, "center");
  drawText(canvas, "CHAMPIONS", x + w / 2, y + 126, 7, gold, "center");
  drawText(canvas, "2025-26", x + w / 2, y + 198, 4, white, "center");
}

function drawCornerFlag(canvas, x, y) {
  drawLine(canvas, x, y, x, y + 180, 6, white);
  drawRect(canvas, x + 6, y + 10, 92, 54, red);
  drawCircle(canvas, x, y + 180, 45, { r: 230, g: 230, b: 220, a: 80 });
}

function drawFootball(canvas, x, y, radius) {
  drawCircle(canvas, x, y, radius, white);
  drawCircle(canvas, x, y, radius * 0.38, navy);
  for (let i = 0; i < 5; i += 1) {
    const angle = (Math.PI * 2 * i) / 5;
    drawLine(canvas, x, y, x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 3, navy);
  }
}

function drawMosaic(canvas, rng) {
  for (let y = 255; y < 585; y += 34) {
    for (let x = 170; x < 1030; x += 34) {
      drawRect(canvas, x, y, 28, 28, rng() > 0.5 ? red : white);
    }
  }
}

function drawConfetti(canvas, rng, count) {
  const colors = [red, deepRed, white, gold, { r: 230, g: 74, b: 93, a: 255 }];
  for (let i = 0; i < count; i += 1) {
    const x = rng() * WIDTH;
    const y = rng() * HEIGHT;
    const w = 4 + rng() * 12;
    const h = 2 + rng() * 8;
    drawRect(canvas, x, y, w, h, colors[Math.floor(rng() * colors.length)]);
  }
}

function drawLogoBadge(canvas, image, x, y, size) {
  drawCircle(canvas, x + size / 2, y + size / 2, size / 2, { r: 255, g: 255, b: 255, a: 238 });
  const scale = Math.min((size * 0.78) / image.width, (size * 0.78) / image.height);
  const drawWidth = Math.max(1, Math.floor(image.width * scale));
  const drawHeight = Math.max(1, Math.floor(image.height * scale));
  overlayImage(canvas, image, x + Math.floor((size - drawWidth) / 2), y + Math.floor((size - drawHeight) / 2), drawWidth, drawHeight);
}

function createCanvas(width, height) {
  return {
    width,
    height,
    data: new Uint8Array(width * height * 4)
  };
}

function setPixel(canvas, x, y, color) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return;

  const index = (py * canvas.width + px) * 4;
  const alpha = (color.a ?? 255) / 255;
  const inverse = 1 - alpha;

  canvas.data[index] = Math.round(color.r * alpha + canvas.data[index] * inverse);
  canvas.data[index + 1] = Math.round(color.g * alpha + canvas.data[index + 1] * inverse);
  canvas.data[index + 2] = Math.round(color.b * alpha + canvas.data[index + 2] * inverse);
  canvas.data[index + 3] = 255;
}

function drawRect(canvas, x, y, width, height, color) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(canvas.width, Math.ceil(x + width));
  const y1 = Math.min(canvas.height, Math.ceil(y + height));

  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      setPixel(canvas, px, py, color);
    }
  }
}

function drawCircle(canvas, cx, cy, radius, color) {
  const r = Math.max(1, radius);
  const x0 = Math.floor(cx - r);
  const x1 = Math.ceil(cx + r);
  const y0 = Math.floor(cy - r);
  const y1 = Math.ceil(cy + r);
  const rr = r * r;

  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= rr) setPixel(canvas, x, y, color);
    }
  }
}

function drawLine(canvas, x0, y0, x1, y1, thickness, color) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
  const radius = Math.max(1, thickness / 2);

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    drawCircle(canvas, x0 + dx * t, y0 + dy * t, radius, color);
  }
}

function drawText(canvas, text, x, y, scale, color, align = "left") {
  const chars = String(text).toUpperCase().split("");
  const charWidth = 6 * scale;
  const totalWidth = chars.length * charWidth - scale;
  let cursorX = align === "center" ? x - totalWidth / 2 : x;

  for (const char of chars) {
    const glyph = font[char] ?? font[" "];
    glyph.forEach((row, rowIndex) => {
      row.split("").forEach((value, columnIndex) => {
        if (value === "1") {
          drawRect(canvas, cursorX + columnIndex * scale, y + rowIndex * scale, scale, scale, color);
        }
      });
    });
    cursorX += charWidth;
  }
}

function overlayImage(canvas, image, targetX, targetY, targetWidth, targetHeight) {
  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const sx = Math.min(image.width - 1, Math.floor((x / targetWidth) * image.width));
      const sy = Math.min(image.height - 1, Math.floor((y / targetHeight) * image.height));
      const sourceIndex = (sy * image.width + sx) * 4;
      setPixel(canvas, targetX + x, targetY + y, {
        r: image.data[sourceIndex],
        g: image.data[sourceIndex + 1],
        b: image.data[sourceIndex + 2],
        a: image.data[sourceIndex + 3]
      });
    }
  }
}

function mixColor(a, b, t) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
    a: Math.round((a.a ?? 255) + ((b.a ?? 255) - (a.a ?? 255)) * t)
  };
}

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rawOffset = y * (width * 4 + 1);
    raw[rawOffset] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, rawOffset + 1);
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 7 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

const crcTable = new Uint32Array(256).map((_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function loadOptionalLogo() {
  if (!existsSync(logoPath)) return null;

  try {
    return decodePng(readFileSync(logoPath));
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown PNG decode failure";
    console.warn(`Could not decode private logo PNG, generating images without logo overlay: ${message}`);
    return null;
  }
}

function decodePng(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
    throw new Error("not a PNG file");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];
  let palette = null;
  let transparency = null;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "PLTE") {
      palette = data;
    } else if (type === "tRNS") {
      transparency = data;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || interlace !== 0) {
    throw new Error("only 8-bit non-interlaced PNG logos are supported");
  }

  const channels = getPngChannels(colorType);
  const bytesPerPixel = Math.max(1, channels);
  const inflated = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const rows = Buffer.alloc(height * stride);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const row = inflated.subarray(inputOffset, inputOffset + stride);
    inputOffset += stride;
    const previous = y === 0 ? null : rows.subarray((y - 1) * stride, y * stride);
    const output = rows.subarray(y * stride, (y + 1) * stride);
    unfilterRow(filter, row, output, previous, bytesPerPixel);
  }

  return {
    width,
    height,
    data: expandPngToRgba(rows, width, height, colorType, palette, transparency)
  };
}

function getPngChannels(colorType) {
  if (colorType === 0) return 1;
  if (colorType === 2) return 3;
  if (colorType === 3) return 1;
  if (colorType === 4) return 2;
  if (colorType === 6) return 4;
  throw new Error(`unsupported PNG color type ${colorType}`);
}

function unfilterRow(filter, row, output, previous, bpp) {
  for (let i = 0; i < row.length; i += 1) {
    const left = i >= bpp ? output[i - bpp] : 0;
    const up = previous ? previous[i] : 0;
    const upLeft = previous && i >= bpp ? previous[i - bpp] : 0;

    if (filter === 0) output[i] = row[i];
    else if (filter === 1) output[i] = (row[i] + left) & 0xff;
    else if (filter === 2) output[i] = (row[i] + up) & 0xff;
    else if (filter === 3) output[i] = (row[i] + Math.floor((left + up) / 2)) & 0xff;
    else if (filter === 4) output[i] = (row[i] + paeth(left, up, upLeft)) & 0xff;
    else throw new Error(`unsupported PNG filter ${filter}`);
  }
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function expandPngToRgba(rows, width, height, colorType, palette, transparency) {
  const out = new Uint8Array(width * height * 4);
  let input = 0;
  let output = 0;

  for (let i = 0; i < width * height; i += 1) {
    if (colorType === 0) {
      const gray = rows[input++];
      out[output++] = gray;
      out[output++] = gray;
      out[output++] = gray;
      out[output++] = 255;
    } else if (colorType === 2) {
      out[output++] = rows[input++];
      out[output++] = rows[input++];
      out[output++] = rows[input++];
      out[output++] = 255;
    } else if (colorType === 3) {
      if (!palette) throw new Error("indexed PNG logo is missing palette");
      const index = rows[input++];
      out[output++] = palette[index * 3] ?? 0;
      out[output++] = palette[index * 3 + 1] ?? 0;
      out[output++] = palette[index * 3 + 2] ?? 0;
      out[output++] = transparency?.[index] ?? 255;
    } else if (colorType === 4) {
      const gray = rows[input++];
      out[output++] = gray;
      out[output++] = gray;
      out[output++] = gray;
      out[output++] = rows[input++];
    } else if (colorType === 6) {
      out[output++] = rows[input++];
      out[output++] = rows[input++];
      out[output++] = rows[input++];
      out[output++] = rows[input++];
    }
  }

  return out;
}

const font = {
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00001", "00001", "00001", "00001", "10001", "10001", "01110"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"]
};

main();
