/**
 * @author NTKhang & Modded by NeoKEX
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 *
 * Configured for Diablo Bot V3 by Pratik Shah
 */

const { spawn } = require("child_process");
const express = require("express");
const log = require("./logger/log.js");

// Render-এ ২৪/৭ বটের পোর্ট অ্যাক্টিভ রাখার জন্য এক্সপ্রেস সার্ভার
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Diablo Bot V3 is Running Proudly by Pratik Shah!");
});

app.listen(port, () => {
  log.info("SERVER", `Keep-alive server for Diablo Bot V3 is running on port ${port}`);
});

function startProject() {
    // --expose-gc : lets MemoryManager call global.gc() to force V8 GC when heap is high
    // --max-old-space-size=400 : caps V8 old-gen heap at 400 MB so Node aggressively collects
    //   before the host (Render 512 MB container) hits its limit and OOM-kills the process
    log.info("DIABLO V3", "Starting Diablo Bot V3 Core Engine...");
    
    const child = spawn("node", ["--expose-gc", "--max-old-space-size=400", "Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        log.info("Project stopped with code:", code);
        if (code === 0) {
            log.info("Project", "Stopped cleanly. Not restarting.");
            return;
        }
        const delay = code === 2 ? 0 : 3000;
        log.info("Project", `Restarting Diablo Bot V3 in ${delay / 1000}s...`);
        setTimeout(() => startProject(), delay);
    });
}

startProject();
