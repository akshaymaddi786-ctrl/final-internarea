const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const urlFilePath = path.join(__dirname, 'backend_url.txt');

function updateGithub(url) {
  console.log(`Writing URL ${url} to backend_url.txt...`);
  fs.writeFileSync(urlFilePath, url.trim(), 'utf8');

  console.log("Committing and pushing updated URL to GitHub...");
  const gitCmd = `git add backend_url.txt && git commit -m "chore: update backend URL" && git push origin main`;
  
  exec(gitCmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error("Failed to push to GitHub:", err.message);
    } else {
      console.log("GitHub updated successfully!");
      console.log(stdout);
    }
  });
}

function startBackend() {
  console.log("Starting backend server (node index.js)...");
  const backend = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
  });

  backend.on('close', (code) => {
    console.log(`Backend server process exited with code ${code}. Restarting in 3 seconds...`);
    setTimeout(startBackend, 3000);
  });
}

function startTunnel() {
  console.log("Starting localhost.run tunnel...");
  const lt = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-R', '80:localhost:5000', 'nokey@localhost.run'], {
    shell: true
  });

  let hasUrl = false;
  let killTimeout = setTimeout(() => {
    if (!hasUrl) {
      console.log("Failed to connect within timeout. Restarting...");
      exec(`taskkill /pid ${lt.pid} /T /F`, (err) => {
        if (err) console.error("Failed to taskkill:", err.message);
      });
    }
  }, 20000);

  lt.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[localhost.run stdout]: ${output.trim()}`);
    
    const urlMatch = output.match(/(https:\/\/[a-zA-Z0-9-.]+\.lhr\.life)/);
    if (urlMatch) {
      hasUrl = true;
      clearTimeout(killTimeout);
      const url = urlMatch[1];
      console.log(`Tunnel successfully established at: ${url}`);
      updateGithub(url);
    }
  });

  lt.stderr.on('data', (data) => {
    const output = data.toString();
    console.error(`[localhost.run stderr]: ${output.trim()}`);
    const urlMatch = output.match(/(https:\/\/[a-zA-Z0-9-.]+\.lhr\.life)/);
    if (urlMatch && !hasUrl) {
      hasUrl = true;
      clearTimeout(killTimeout);
      const url = urlMatch[1];
      console.log(`Tunnel successfully established at: ${url}`);
      updateGithub(url);
    }
  });

  lt.on('close', (code) => {
    console.log(`localhost.run process exited with code ${code}. Restarting in 5 seconds...`);
    clearTimeout(killTimeout);
    setTimeout(startTunnel, 5000);
  });
}

startBackend();
startTunnel();
