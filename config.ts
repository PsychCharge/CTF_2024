require("dotenv").config({ path: __dirname+"/.env" });

export const my_mnemonic = process.env.mnemonic!;
export const API_KEY = process.env.ALGOD_API_KEY!;