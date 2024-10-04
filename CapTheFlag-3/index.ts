import * as algosdk from "algosdk";
import { my_mnemonic as mnemonic } from "../config";
import { API_KEY as KEY } from "../config";

(async () => {
  const account = algosdk.mnemonicToSecretKey(mnemonic);

  const algodClient = new algosdk.Algodv2(
    "a".repeat(64),
    //KEY,
    "https://testnet-api.algonode.cloud",
    443
  );

  const secretRecipient =
    "2JAZQO6Z5BCXFMPVW2CACK2733VGKWLZKS6DGG565J7H5NH77JNHLIIXLY";

  const encoder = new TextEncoder();

  const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: account.addr,
    receiver: secretRecipient,
    amount: algosdk.algosToMicroalgos(1),
    suggestedParams: await algodClient.getTransactionParams().do(),
    note: encoder.encode( //Secret message using fullstop
      "b966c3d07e17b9442740dd2386e6e1ab191d51e964cee3b4dfc122f0fa865d10"
    ),
  });

  // const payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //   sender: account.addr,
  //   receiver: secretRecipient,
  //   amount: algosdk.algosToMicroalgos(1),
  //   suggestedParams: await algodClient.getTransactionParams().do(),
  //   note: encoder.encode( //Secret message without fullstop
  //     "ae6ebfcff2e1d10cafb51c0e4ab77da22838436dd3b5d82b7d2eb6104bd30dc3"
  //   ),
  // });

  const signedPayTxn = payTxn.signTxn(account.sk);

  await algodClient.sendRawTransaction(signedPayTxn).do();

  const res = await algosdk.waitForConfirmation(algodClient, payTxn.txID(), 3);

  console.log(res);
})();