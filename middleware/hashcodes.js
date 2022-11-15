const crypto = require("crypto");

const makeCode = (email, expiry, codeType) => {
  const seed = process.env.CRYPTO_SEED;
  const created = new Date();
  const expires = created[Symbol.toPrimitive]("number") + expiry;
  //   const expires = created[Symbol.toPrimitive]("number") + 599905;
  const expiryTextMsg = `Your ${codeType} Code Expires: ${new Date(
    expires
  ).toString()}`;
  const hash = crypto.createHash("sha256");
  const hash2 = crypto.createHash("sha256");
  const combined = `${seed}${email}${expires}`;
  hash.update(combined);
  hash2.update(email);
  const details = {
    email,
    expires,
    sha256: hash.digest("hex"),
    emailSha: hash2.digest("hex"),
  };
  // console.log(details, hEmail);
  const jsondetails = JSON.stringify(details);
  if (codeType == "confirmation") {
    return { code: btoa(jsondetails), msg: expiryTextMsg };
  } else if (codeType == "preauth") {
    details.msg = expiryTextMsg;
    details.preauth = `${expires}:${details.emailSha.slice(
      0,
      8
    )}:${details.sha256.slice(0, 8)}`;
    delete details.sha256;
    delete details.emailSha;
    delete details.expires;
    return details;
  }
};

const verifyCode = (b64Code) => {
  try {
    const decode = atob(b64Code);
    // console.log(decode);
    const { email, expires, sha256 } = JSON.parse(decode);
    // console.log(email, expires, sha256);
    const seed = process.env.CRYPTO_SEED;
    const hash = crypto.createHash("sha256");
    const combined = `${seed}${email}${expires}`;
    // console.log(new Date(expires).toLocaleTimeString());
    const expiryTextMsg = `Confirmation Code Expires: ${new Date(
      expires
    ).toString()}`;
    hash.update(combined);
    const hashed = hash.digest("hex");
    if (hashed === sha256 && Date.now() < expires) {
      return {
        email,
        expires,
        sha256,
        preauth: sha256.slice(0, 8),
        msg: expiryTextMsg,
      };
    } else {
      return false;
    }
    // return hashed === sha256 && Date.now() < expires;
  } catch (error) {
    return false;
  }

  //   return { seed, email, sha256: hash.digest("hex") };
};

/* 
makeVerificationCode with 10 minute expiry for email verification and password resets
*/
const makeVerificationCode = (email) => {
  const expiry = 599905; // 10 minutes
  const codeType = "confirmation";
  return makeCode(email, expiry, codeType);
};

/* 
makePreAuthCode with 1 day expiry for preAuthroization registration code
*/
const makePreAuthCode = (email) => {
  //   const expiry = 599905; // 10 minute for testing purposes
  const expiry = 86386320; // 24 hours
  const codeType = "preauth";
  return makeCode(email, expiry, codeType);
};

const verifyPreauth = (email, preauthCode) => {
  const [expires, emailSha, shortsha] = preauthCode.split(":");
  //   console.log(expires, shortsha);
  const seed = process.env.CRYPTO_SEED;
  const hash = crypto.createHash("sha256");
  const hash2 = crypto.createHash("sha256");
  const combined = `${seed}${email}${expires}`;
  // console.log(new Date(expires).toLocaleTimeString());
  const expiryTextMsg = `Confirmation Code Expires: ${new Date(
    expires
  ).toString()}`;
  hash.update(combined);
  hash2.update(email);
  const hashed = hash.digest("hex");
  const emailHash = hash2.digest("hex");

  const eValid = {};
  if (emailHash.slice(0, 8) === emailSha) {
    eValid.eValid = "✅";
    eValid.email = email;
  } else {
    eValid.eValid = "❌";
    eValid.email = `invalid email`;
  }

  const isValid =
    (emailHash.slice(0, 8) === emailSha && hashed.slice(0, 8)) === shortsha &&
    Date.now() < expires;
  if (isValid) {
    const pValid = { pValid: "✅", preauthCode };
    return Object.assign({ valid: true, pValid: "✅", preauthCode }, eValid);
  } else {
    return Object.assign({ valid: false, pValid: "❌", preauthCode }, eValid);
  }
};

module.exports = {
  verifyCode,
  verifyPreauth,
  makePreAuthCode,
  makeVerificationCode,
};

// const hash = crypto.createHash("sha256");
// hash.update(code);
// const hashedCode = hash.copy().digest("hex");

// console.log(code);
// console.log(hashedCode);

// const code1 =
//   "94fbd7c4b3084589e2bac940f8c0af34b6a8e122030b63d9a73b539c707c6dc6";

// ///  1f99119dbeabc007e01d87116429d2bdc60b0b7aa0e542a349f2e5a26b413350

// hash.update(code1);
// console.log(hash.digest("hex"));
// // console.log(hash.copy().digest("hex"));

// let codes = [];
// for (let i = 0; i < 10; i++) {
//   const code = crypto.randomBytes(32).toString("hex");
//   codes.push(code);
// }
// console.log(JSON.stringify(codes));

// const codes = [
//   "56d40378e5404f0a742aea4579816d30c5230d647cedcb093ebb1d230ed8f1a0",
//   "e45eab798be5642ea2c9a07a705737deea44ced6c39b566e50424dbe08de2eb0",
//   "6302ce93f9e14e89ef9853276f22ffe019906bcc8b27875134f7daa8939b0e8d",
//   "c91b85826611e45464bad65070ebd78c1f54cec11accee78cffc2d8b3bc35e60",
//   "aa553551148afc9b6c4e3b914406a3d2ff85f67b5b76710b11f15efc8cebdffc",
//   "5ed6c939dee6bcda67769250299bc769fad265fdcecfac2289fc05d49b8945fd",
//   "488a88047d6097ba83c9e6cacc650e84505abe7b418a80f10d1e4bddd8834696",
//   "ace5c0ee06bbff6b575b275b0a82ca4961be1d9589def6a015fcc31be6b0778a",
//   "a68e42757a136bf1b0bf5e3b6dd835e85946cef51c45e5a3ea2d6b85aa51f4bc",
//   "9c73be0eccc527183ba8e687af6849060dd72d888c6309597e553daa921f80e4",
// ];

// for (let i = 0; i < codes.length; i++) {
//   const hash = crypto.createHash("sha256");
//   hash.update(codes[i]);
//   console.log(codes[i], hash.digest("hex"));
// }
