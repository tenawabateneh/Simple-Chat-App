#!/usr/bin/env node
/**
 * jenkins-fix.js
 * Run this script after every Docker Desktop / Jenkins restart to fix:
 *   1. Docker socket permissions (chmod 666 /var/run/docker.sock)
 *   2. Kubeconfig sync: replaces 127.0.0.1 with host.docker.internal
 *
 * Usage:  node jenkins-fix.js
 */

const fs = require('fs');
const { execSync } = require('child_process');

function run(cmd, label) {
    try {
        const out = execSync(cmd, { encoding: 'utf8' });
        if (out.trim()) console.log(out.trim());
        return out.trim();
    } catch (e) {
        console.error(`❌ Failed [${label}]: ${e.message}`);
        throw e;
    }
}

console.log('======================================================');
console.log('  Jenkins / Kubernetes Auto-Fix Script');
console.log('======================================================\n');

// ── STEP 1: Fix Docker socket permissions ───────────────────────
console.log('🔧 Step 1: Fixing Docker socket permissions...');
run('docker exec -u 0 jenkins chmod 666 /var/run/docker.sock', 'chmod docker.sock');
console.log('✅ Docker socket permissions fixed.\n');

// ── STEP 2: Sync Kubeconfig ──────────────────────────────────────
console.log('🔧 Step 2: Syncing kubeconfig to Jenkins container...');

const hostConfigPath = 'C:\\Users\\admin\\.kube\\config';
const config = fs.readFileSync(hostConfigPath, 'utf8');
const lines = config.split(/\r?\n/);
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
    // Replace any 127.0.0.1:<port> server line with host.docker.internal:<port>
    const serverMatch = lines[i].match(/^(\s+server:\s+https:\/\/)127\.0\.0\.1:(\d+)\s*$/);
    if (serverMatch) {
        const port = serverMatch[2];
        lines[i] = `    server: https://host.docker.internal:${port}`;
        console.log(`  ✓ Replaced 127.0.0.1:${port} → host.docker.internal:${port}`);
        updatedCount++;

        // Replace certificate-authority* with insecure-skip-tls-verify
        for (let j = i - 1; j >= 0; j--) {
            if (lines[j].includes('- cluster:')) break;
            if (lines[j].includes('certificate-authority')) {
                lines[j] = '    insecure-skip-tls-verify: true';
                console.log(`  ✓ Replaced certificate-authority with insecure-skip-tls-verify`);
                break;
            }
        }
    }
}

if (updatedCount === 0) {
    console.log('  ℹ️  No 127.0.0.1 entries found - config may already be correct.');
}

const tempPath = require('path').join(__dirname, 'temp_kube_config');
fs.writeFileSync(tempPath, lines.join('\n'));

execSync(`docker cp "${tempPath}" jenkins:/var/jenkins_home/.kube/config`);
execSync('docker exec -u 0 jenkins chown jenkins:jenkins /var/jenkins_home/.kube/config');
execSync('docker exec -u 0 jenkins chmod 600 /var/jenkins_home/.kube/config');
fs.unlinkSync(tempPath);

console.log('✅ Kubeconfig synced to Jenkins container.\n');

// ── STEP 3: Verify both fixes ────────────────────────────────────
console.log('🔍 Step 3: Verifying...');
console.log('\n  Docker access from Jenkins:');
run('docker exec jenkins docker ps --format "table {{.Names}}\t{{.Status}}"', 'docker ps check');

console.log('\n  Kubernetes connection from Jenkins:');
run('docker exec jenkins kubectl cluster-info', 'kubectl cluster-info');

console.log('\n======================================================');
console.log('  ✅ All fixes applied! You can now run Jenkins.');
console.log('======================================================');
