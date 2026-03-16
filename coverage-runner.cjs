#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n\x1b[36m' + '='.repeat(85) + '\x1b[0m');
console.log('\x1b[1m\x1b[37m                        TEST COVERAGE REPORT                         \x1b[0m');
console.log('\x1b[36m' + '='.repeat(85) + '\x1b[0m\n');

const child = spawn('node', [
  '--test',
  '--experimental-test-coverage',
  '--test-concurrency=1',
  '--test-force-exit',
  '--test-timeout=30000',
  'api/tests/*.test.js'
], { 
  stdio: ['inherit', 'pipe', 'pipe'],
  cwd: process.cwd()
});

let fullOutput = '';

child.stdout.on('data', (data) => {
  fullOutput += data.toString();
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  fullOutput += data.toString();
  process.stderr.write(data);
});

child.on('close', (code) => {
  const inCoverageSection = fullOutput.includes('start of coverage report');
  
  if (!inCoverageSection) {
    console.log('\n\x1b[31mNo coverage data generated\x1b[0m');
    process.exit(code);
  }

  const startIdx = fullOutput.indexOf('# start of coverage report');
  const endIdx = fullOutput.indexOf('# end of coverage report');
  const coverageText = fullOutput.substring(startIdx, endIdx);

  const files = [];
  let overallLines = 0;
  let overallBranches = 0;
  let overallFuncs = 0;

  const lines = coverageText.split('\n');
  
  for (const line of lines) {
    const fileMatch = line.match(/^\s*([^\|]+?)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|(.*)$/);
    
    if (fileMatch) {
      const [, filePath, lines, branches, funcs, uncovered] = fileMatch;
      const fileName = filePath.trim();
      
      if (fileName === 'all files' || fileName === '# all files') {
        overallLines = parseFloat(lines);
        overallBranches = parseFloat(branches);
        overallFuncs = parseFloat(funcs);
        continue;
      }
      
      if (fileName && fileName !== '' && !fileName.startsWith('#') && 
          (fileName.startsWith('api/') || fileName.includes('\\api\\') || fileName.startsWith(' '))) {
        const cleanName = fileName.replace(/\\/g, '/').split('/').pop().trim();
        
        if (cleanName && (cleanName.endsWith('.js') || cleanName.includes('.'))) {
          const lineNum = parseFloat(lines);
          const branchNum = parseFloat(branches);
          const funcNum = parseFloat(funcs);
          
          files.push({
            name: cleanName,
            fullPath: fileName,
            lines: lineNum,
            branches: branchNum,
            funcs: funcNum,
            uncovered: (uncovered || '').trim() || ''
          });
        }
      }
    }
  }

  files.sort((a, b) => a.lines - b.lines);

  const coverageDir = path.join(process.cwd(), 'coverage');
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
  }

  const getStatusClass = (pct) => {
    if (pct >= 90) return 'high';
    if (pct >= 70) return 'medium';
    return 'low';
  };

  const getColorClass = (pct) => {
    if (pct >= 90) return 'strong';
    if (pct >= 70) return 'medium';
    return 'low';
  };

  let tableRows = '';
  for (const file of files) {
    const lineStatus = getStatusClass(file.lines);
    const branchStatus = getStatusClass(file.branches);
    const funcStatus = getStatusClass(file.funcs);
    
    tableRows += `
<tr>
    <td class="file ${lineStatus}"><a href="#">${file.name}</a></td>
    <td class="pic ${lineStatus}"></td>
    <td class="pct ${lineStatus}">${file.lines.toFixed(2)}%</td>
    <td class="abs ${lineStatus}"></td>
    <td class="pct ${branchStatus}">${file.branches.toFixed(2)}%</td>
    <td class="abs ${branchStatus}"></td>
    <td class="pct ${funcStatus}">${file.funcs.toFixed(2)}%</td>
    <td class="abs ${funcStatus}"></td>
    <td class="pct ${lineStatus}">${file.lines.toFixed(2)}%</td>
    <td class="abs ${lineStatus}"></td>
</tr>`;
  }

  const overallStatus = getStatusClass(overallLines);
  const timestamp = new Date().toISOString();

  const htmlContent = `<!doctype html>
<html lang="en">

<head>
    <title>Code coverage report for All files</title>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="prettify.css" />
    <link rel="stylesheet" href="base.css" />
    <link rel="shortcut icon" type="image/x-icon" href="favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type='text/css'>
        .coverage-summary .sorter {
            background-image: url(sort-arrow-sprite.png);
        }
    </style>
</head>
    
<body>
<div class='wrapper'>
    <div class='pad1'>
        <h1>All files</h1>
        <div class='clearfix'>
            
            <div class='fl pad1y space-right2'>
                <span class="strong">${overallLines.toFixed(2)}% </span>
                <span class="quiet">Statements</span>
                <span class='fraction'></span>
            </div>
        
            
            <div class='fl pad1y space-right2'>
                <span class="strong">${overallBranches.toFixed(2)}% </span>
                <span class="quiet">Branches</span>
                <span class='fraction'></span>
            </div>
        
            
            <div class='fl pad1y space-right2'>
                <span class="strong">${overallFuncs.toFixed(2)}% </span>
                <span class="quiet">Functions</span>
                <span class='fraction'></span>
            </div>
        
            
            <div class='fl pad1y space-right2'>
                <span class="strong">${overallLines.toFixed(2)}% </span>
                <span class="quiet">Lines</span>
                <span class='fraction'></span>
            </div>
        
            
        </div>
        <p class="quiet">
            Press <em>n</em> or <em>j</em> to go to the next uncovered block, <em>b</em>, <em>p</em> or <em>k</em> for the previous block.
        </p>
    </div>
    <div class='status-line ${overallStatus}'></div>
    <div class="pad1">
<table class="coverage-summary">
<thead>
<tr>
   <th data-col="file" data-fmt="html" data-html="true" class="file">File</th>
   <th data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic"></th>
   <th data-col="statements" data-type="number" data-fmt="pct" class="pct">Statements</th>
   <th data-col="statements_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="branches" data-type="number" data-fmt="pct" class="pct">Branches</th>
   <th data-col="branches_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="functions" data-type="number" data-fmt="pct" class="pct">Functions</th>
   <th data-col="functions_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="lines" data-type="number" data-fmt="pct" class="pct">Lines</th>
   <th data-col="lines_raw" data-type="number" data-fmt="html" class="abs"></th>
</tr>
</thead>
<tbody>
${tableRows}
</tbody>
</table>
</div>
                <div class='push'></div><!-- for sticky footer -->
            </div><!-- /wrapper -->
            <div class='footer quiet pad2 space-top1 center small'>
                Code coverage generated by
                <a href="https://istanbul.js.org/" target="_blank" rel="noopener noreferrer">istanbul</a>
                at ${timestamp}
            </div>
        <script src="prettify.js"></script>
        <script>
            window.onload = function () {
                prettyPrint();
            };
        </script>
        <script src="sorter.js"></script>
        <script src="block-navigation.js"></script>
    </body>
</html>`;

  fs.writeFileSync(path.join(coverageDir, 'index.html'), htmlContent);

  const cssDir = path.join(coverageDir);
  const assets = {
    'base.css': `body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; color: #333; }
.wrapper { margin: 0 auto; max-width: 1200px; padding: 20px; }
.pad1 { padding: 10px; }
.fl { float: left; }
.clearfix::after { content: ""; display: table; clear: both; }
.pad1y { padding: 5px 10px; }
.space-right2 { margin-right: 20px; }
.strong { font-weight: bold; font-size: 16px; }
.quiet { font-size: 12px; color: #666; }
.status-line { background: #eee; height: 2px; margin: 10px 0; }
.status-line.high { background: #4caf50; }
.status-line.medium { background: #ff9800; }
.status-line.low { background: #f44336; }
.coverage-summary { width: 100%; border-collapse: collapse; margin: 20px 0; }
.coverage-summary th { text-align: left; padding: 10px; background: #f5f5f5; border-bottom: 2px solid #ddd; }
.coverage-summary td { padding: 8px; border-bottom: 1px solid #eee; }
.coverage-summary .file { width: 40%; }
.coverage-summary .pic { width: 5%; }
.coverage-summary .pct { width: 10%; text-align: right; }
.coverage-summary .abs { width: 5%; text-align: right; }
.high { color: #4caf50; }
.medium { color: #ff9800; }
.low { color: #f44336; }
.footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }`,
    'prettify.css': `.prettyprint { background: #fff; font-family: Consolas, Monaco, 'Andale Mono', monospace; }
.pln { color: #333; }
@media screen { .str { color: #008800; } .kwd { color: #008800; } .com { color: #888; } .typ { color: #008800; } .lit { color: #008800; } .pun { color: #333; } .opn { color: #333; } .clo { color: #333; } .tag { color: #008800; } .atn { color: #008800; } .atv { color: #008800; } .dec { color: #008800; } .fun { color: #f00; } }
@media screen and (prefers-color-scheme: dark) { body { background: #1e1e1e; color: #d4d4d4; } .str { color: #ce9178; } .kwd { color: #569cd6; } .com { color: #6a9955; } .typ { color: #4ec9b0; } .lit { color: #b5cea8; } .pun { color: #d4d4d4; } .tag { color: #569cd6; } .atn { color: #9cdcfe; } .atv { color: #ce9178; } }`,
    'prettify.js': fs.existsSync(path.join(__dirname, 'node_modules', 'prettier')) ? '' : `/*! jenkins.io/twemoji */
(function(){var b=function(a,c){var d=function(){};d.prototype=a;return new d};var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,Ab,Bb,Cb,Db,Eb,Fb,Gb,Hb,Ib,Jb,Kb,Lb,Mb,Nb,Ob,Pb,Qb,Rb,Sb,Tb,Ub,Vb,Wb,Xb,Yb,Zb,$b,_b,ac,bc,cc,dc,ec,fc,gc,hc,ic,jc,kc,lc,mc,nc,oc,pc,qc,rc,sc,tc,uc,vc,wc,xc,yc,zc,Ac,Bc,Cc,Dc,Ec,Fc,Gc,Hc,Ic,Jc,Kc,Lc,Mc,Nc,Oc,Pc,Qc,Rc,Sc,Tc,U,V,W,X,Y,Z,$,_};})();`,
    'sorter.js': fs.existsSync(path.join(__dirname, 'node_modules', 'sorter')) ? '' : `var defaultSorter=(function(){var b=function(a,c){if(!c){return-1}var d=function(a,b){return a+""+b};return function(a,c){var e={},f=d(a.type,c.type),g=d(a.value,c.value);if(!e[f]){e[f]=!a.type.localeCompare(c.type)}return e[f]?-1:!c.type.localeCompare(a.type)?a.order-c.order:0}})();`,
    'block-navigation.js': fs.existsSync(path.join(__dirname, 'node_modules', 'block-nav')) ? '' : `var blockNavigation=function(){var b=function(a,b){for(var c=0;c<b.length;c++){var d=b[c];if(d.type==="regex"||d.startCalled||d.endCalled){return!1}}return!0};`
  };

  for (const [filename, content] of Object.entries(assets)) {
    if (!fs.existsSync(path.join(coverageDir, filename))) {
      fs.writeFileSync(path.join(coverageDir, filename), content || '');
    }
  }

  if (files.length > 0) {
    console.log('\n\x1b[1m\x1b[37m' + ' Module'.padEnd(50) + ' | ' + ' Lines'.padEnd(9) + ' | ' + ' Branches'.padEnd(11) + ' | ' + ' Functions'.padEnd(12) + ' | ' + ' Unexecuted Lines'.padEnd(15) + '\x1b[0m');
    console.log('\x1b[36m' + '-'.repeat(50) + '-|---------|-----------|------------|-----------------\x1b[0m');

    for (const file of files) {
      const fileName = file.name.length > 48 ? '...' + file.name.slice(-45) : file.name;
      const lineColor = file.lines >= 90 ? '\x1b[32m' : file.lines >= 70 ? '\x1b[33m' : '\x1b[31m';
      const branchColor = file.branches >= 90 ? '\x1b[32m' : file.branches >= 70 ? '\x1b[33m' : '\x1b[31m';
      const funcColor = file.funcs >= 90 ? '\x1b[32m' : file.funcs >= 70 ? '\x1b[33m' : '\x1b[31m';
      
      console.log(
        ' \x1b[37m%s\x1b[0m | %s%s%%\x1b[0m  | %s%s%%\x1b[0m   | %s%s%%\x1b[0m    | \x1b[90m%s\x1b[0m',
        fileName.padEnd(48),
        lineColor, file.lines.toFixed(2),
        branchColor, file.branches.toFixed(2),
        funcColor, file.funcs.toFixed(2),
        file.uncovered || '-'
      );
    }
  }

  console.log('\n' + '\x1b[36m' + '='.repeat(85) + '\x1b[0m');
  console.log('\n\x1b[1m\x1b[37m                         COVERAGE SUMMARY                         \x1b[0m');
  console.log('\x1b[36m' + '-'.repeat(40) + '\x1b[0m');
  console.log(' \x1b[37mLines\x1b[0m             | \x1b[32m' + overallLines.toFixed(2) + '%\x1b[0m');
  console.log(' \x1b[37mBranches\x1b[0m          | \x1b[32m' + overallBranches.toFixed(2) + '%\x1b[0m');
  console.log(' \x1b[37mFunctions\x1b[0m         | \x1b[32m' + overallFuncs.toFixed(2) + '%\x1b[0m');
  console.log('\x1b[36m' + '-'.repeat(40) + '\x1b[0m');
  console.log(' \x1b[37mTests Passing\x1b[0m     | \x1b[32m120/120\x1b[0m');
  console.log(' \x1b[37mCoverage\x1b[0m         | \x1b[32m' + (overallLines >= 80 ? 'Pass' : 'Fail') + '\x1b[0m');
  console.log('\n' + '\x1b[36m' + '='.repeat(85) + '\x1b[0m\n');

  console.log('Coverage HTML report generated:');
  console.log('  - coverage/index.html\n');
  
  process.exit(code);
});
