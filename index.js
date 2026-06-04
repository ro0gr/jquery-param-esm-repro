import * as dns from 'dns'; // Just to have an ES module import

console.log('--- jquery-param ESM Reproduction ---');

try {
  // Dynamically import the browser UMD entry point of jquery-param
  // This simulates the behavior of browser bundlers resolving the "browser" field
  const modulePath = './node_modules/jquery-param/jquery-param.min.js';
  console.log(`Importing module: ${modulePath}`);
  
  const m = await import(modulePath);
  
  console.log('Module Namespace keys:', Object.keys(m));
  console.log('Module default export value:', m.default);
  
  if (m.default === undefined) {
    console.log('\n❌ SUCCESSFUL REPRODUCTION: default export is undefined.');
    console.log('Trying to call m.default({ a: 1 })...');
    m.default({ a: 1 });
  } else {
    console.log('\n✅ Success? default export is defined:', m.default);
  }
} catch (err) {
  console.log('\n🔥 Caught expected runtime error:');
  console.error(err);
}
