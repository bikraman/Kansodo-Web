export default function generateUUID() {
    // Generate random bytes
    const cryptoObj = window.crypto || window.msCrypto; // for IE11 compatibility
    const buffer = new Uint8Array(16);
    cryptoObj.getRandomValues(buffer);
  
    // Set version (4) and variant (RFC4122) bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant RFC4122
  
    // Convert bytes to hexadecimal string
    let uuid = '';
    for (let i = 0; i < 16; i++) {
      let byte = buffer[i].toString(16);
      if (byte.length === 1) byte = '0' + byte;
      uuid += byte;
      if ([3, 5, 7, 9].includes(i)) uuid += '-';
    }
  
    return uuid;
}